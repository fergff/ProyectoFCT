#include <WiFi.h>
#include <FirebaseESP32.h>
#include "DHT.h"

// Reemplaza con tu SSID y contraseña de red
const char* ssid = "TP-Link_A7EA";
const char* password = "xdfer12345";

#define DHTPIN 4     // El pin donde está conectado el DHT11
#define DHTTYPE DHT11 // Definir el tipo de DHT como DHT11
#define LED_PIN 2    // Define el pin del LED
DHT dht(DHTPIN, DHTTYPE);

// Configuración de Firebase
#define FIREBASE_HOST "https://esp32prueba-a1da6-default-rtdb.firebaseio.com/" // Reemplaza con tu URL de Firebase Realtime Database
#define FIREBASE_AUTH "dHxVXL13wcClIqXsRR5crQTtRj1dmSd0jqfkqfWC" // Reemplaza con tu clave secreta de Firebase

FirebaseData firebaseData;
// Identificadores de usuario y dispositivo
String userId = "user01";
String deviceId = "device01"; // Este ID podría generarse o asignarse dinámicamente según tu lógica de aplicación


String path="usuarios";
void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT); // Configura el pin del LED como salida
  dht.begin();
  
  // Conecta a la red Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado a Wi-Fi.");
  
  // Conecta a Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  Serial.println("Conectado a Firebase");
  String basePath = "/"+ path +"/"+ userId + "/devices/" + deviceId;
  Firebase.setBool(firebaseData, basePath + "/SensorLed",false);
}

void loop() {
  // Lee los valores del sensor DHT11
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Verifica si alguna lectura falló y sale temprano (para intentar de nuevo).
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Rutas actualizadas según la estructura de usuario/dispositivo
  String basePath = "/"+ path +"/"+ userId + "/devices/" + deviceId;
  Firebase.setFloat(firebaseData, basePath + "/SensorHum", h);
  Firebase.setFloat(firebaseData, basePath + "/Sensortemp", t);
  Serial.print(basePath);
  // Actualización del estado del LED basado en Firebase
  if (Firebase.getBool(firebaseData, basePath + "/SensorLed")) {
    bool ledState = firebaseData.boolData();
    digitalWrite(LED_PIN, ledState ? HIGH : LOW);
  } else {
    Serial.println("Failed to read LED state from Firebase");
  }

  // Imprime los valores en el Serial Monitor
  Serial.print("Humedad: ");
  Serial.print(h);
  Serial.print(" %\t");
  Serial.print("Temperatura: ");
  Serial.print(t);
  Serial.println(" *C ");

  delay(500); // Espera un poco antes de la próxima lectura
}

#include <WiFi.h>
#include <FirebaseESP32.h>
#include "DHT.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Configuración de WiFi
const char* ssid = "TP-Link_A7EA";
const char* password = "xdfer12345";

// Configuración de Firebase
#define FIREBASE_HOST "https://esp32prueba-a1da6-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "dHxVXL13wcClIqXsRR5crQTtRj1dmSd0jqfkqfWC"

FirebaseData firebaseData;
String userId = "user01";
String deviceId = "devicepruebasensorh";
String path = "usuarios";

// Configuración del sensor DHT
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Configuración de pantalla OLED
#define SCREEN_WIDTH 128 // Ancho de la pantalla OLED
#define SCREEN_HEIGHT 64 // Altura de la pantalla OLED
#define OLED_RESET    -1 // Reset no es usado
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Configuración de botón y LED
#define BUTTON_PIN 0 // GPIO0 como pin del botón
#define LED_PIN 2
bool ledState = false; // Estado inicial del LED
bool lastButtonState = HIGH; // Estado anterior del botón para detectar de high a low
unsigned long lastButtonPressTime = 0; // Para evitar rebotes y actualizaciones rápidas
unsigned long lastFirebaseCheck = 0; // Para controlar la frecuencia de actualización desde Firebase

// Configuración del sensor de humedad del suelo
#define HS_PIN 34 // Pin analógico para el sensor de humedad del suelo

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(HS_PIN, INPUT);
  dht.begin();

  Wire.begin(21, 19); // SDA, SCL
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Bucle infinito
  }
  display.clearDisplay();
  display.setTextSize(1);      
  display.setTextColor(WHITE);  
  display.setCursor(0,0);     

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado a Wi-Fi.");

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  Serial.println("Conectado a Firebase");

  String basePath = "/" + path + "/" + userId + "/devices/" + deviceId;
  Firebase.setBool(firebaseData, basePath + "/SensorLed", ledState);
  
  // Añadir campos type y connected una sola vez
  Firebase.setString(firebaseData, basePath + "/type", "plant");
  Firebase.setBool(firebaseData, basePath + "/connected", true);
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int roundedTemp = round(t); // pasarlo a entero
  int hs = analogRead(HS_PIN);
  float hsPercent = map(hs, 1300, 4095, 100, 0);

  String basePath = "/" + path + "/" + userId + "/devices/" + deviceId;
  if (!isnan(h) && !isnan(t)) {
    Firebase.setFloat(firebaseData, basePath + "/SensorHum", h);
    Firebase.setFloat(firebaseData, basePath + "/Sensortemp", roundedTemp);
    Firebase.setFloat(firebaseData, basePath + "/SensorHumSuelo", hsPercent);
  }

  Firebase.setBool(firebaseData, basePath + "/connected", true);

  bool currentButtonState = digitalRead(BUTTON_PIN);
  if (currentButtonState != lastButtonState && (millis() - lastButtonPressTime > 50)) {
    lastButtonPressTime = millis();
    if (currentButtonState == LOW) {
      ledState = !ledState;
      digitalWrite(LED_PIN, ledState ? HIGH : LOW);
      Firebase.setBool(firebaseData, basePath + "/SensorLed", ledState);
    }
  }
  lastButtonState = currentButtonState;

  if (millis() - lastFirebaseCheck > 2000) {
    lastFirebaseCheck = millis();
    if (Firebase.getBool(firebaseData, basePath + "/SensorLed")) {
      bool firebaseLedState = firebaseData.boolData();
      if (firebaseLedState != ledState) {
        ledState = firebaseLedState;
        digitalWrite(LED_PIN, ledState ? HIGH : LOW);
      }
    }
  }

  // Actualizar la pantalla OLED
  display.clearDisplay();
  display.setCursor(0, 0);
  display.print("Temp: ");
  display.print(t);
  display.println(" *C");
  display.print("Hum: ");
  display.print(h);
  display.println(" %");
  display.print("Hum Suelo: ");
  display.print(hsPercent);
  display.println(" %");
  display.setTextSize(2); // Aumentar tamaño
  display.print("Riego: ");
  display.println(ledState ? "ON" : "OFF");
  display.setTextSize(1); // Restaurar tamaño 
  display.display();

  delay(10);
}

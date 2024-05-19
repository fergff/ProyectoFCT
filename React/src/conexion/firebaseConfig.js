// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxQ5k-HcFjnBWP38RG1rtY7tJQFkxVDd4",
  authDomain: "esp32prueba-a1da6.firebaseapp.com",
  databaseURL: "https://esp32prueba-a1da6-default-rtdb.firebaseio.com",
  projectId: "esp32prueba-a1da6",
  storageBucket: "esp32prueba-a1da6.appspot.com",
  messagingSenderId: "399894773300",
  appId: "1:399894773300:web:53be9872201ad0c5791461"
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene una instancia de la base de datos
const database = getDatabase(app);

export { database };
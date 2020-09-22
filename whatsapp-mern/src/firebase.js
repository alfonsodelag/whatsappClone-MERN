const firebase = require('firebase')

const firebaseConfig = {
  apiKey: "AIzaSyB_7FaMfRv3r9T6jCcBSR1Irdw0-51m5UU",
  authDomain: "whatsapp-mern-bbe12.firebaseapp.com",
  databaseURL: "https://whatsapp-mern-bbe12.firebaseio.com",
  projectId: "whatsapp-mern-bbe12",
  storageBucket: "whatsapp-mern-bbe12.appspot.com",
  messagingSenderId: "555484549134",
  appId: "1:555484549134:web:9e0aa6fd142676cc0aac5f"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider };
export default db;
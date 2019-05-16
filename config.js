import Firebase from 'firebase';

let config = {
  apiKey: "AIzaSyCowZ18HHJ1C2uIrbQqOtuzjEmGSwQ3neM",
  authDomain: "coinshack-533be.firebaseapp.com",
  databaseURL: "https://coinshack-533be.firebaseio.com",
  projectId: "coinshack-533be",
  storageBucket: "coinshack-533be.appspot.com",
  messagingSenderId: "1059449383508",
  appId: "1:1059449383508:web:d79145db316a5dfe"
};

let app = Firebase.initializeApp(config);

export const db = app.database();

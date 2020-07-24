import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAJThz3SfNRcphoa9w0Ub0LdfNTPv-BIIs",
  authDomain: "skrallgaming-a5a16.firebaseapp.com",
  databaseURL: "https://skrallgaming-a5a16.firebaseio.com",
  projectId: "skrallgaming-a5a16",
  storageBucket: "skrallgaming-a5a16.appspot.com",
  messagingSenderId: "503205984846",
  appId: "1:503205984846:web:53b48d615237bc3d21a11f",
  measurementId: "G-LYQ0DKT136"
};

firebase.initializeApp(config);

export const firestoreDb = firebase.firestore();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

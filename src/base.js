import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp(
    {
        apiKey: "AIzaSyBP8g-Kl5DYUFpHDVQ-ULIUg0O0tNnWEU4",
        authDomain: "catch-of-the-day-vix-morrigan.firebaseapp.com",
        databaseURL: "https://catch-of-the-day-vix-morrigan.firebaseio.com",
        
      });

      const base = Rebase.createClass(firebaseApp.database());

      export {firebaseApp};
      
      //default export
      export default base;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, off } from "firebase/database";
import { getFunctions } from "firebase/functions";
import { readable} from "svelte/store";

// import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDGL89hIKI6ymFOyPIhd3ZPhG8UpbXVD6A",
    authDomain: "indiana-a91d4.firebaseapp.com",
    databaseURL: "https://indiana-a91d4-default-rtdb.firebaseio.com",
    projectId: "indiana-a91d4",
    storageBucket: "indiana-a91d4.appspot.com",
    messagingSenderId: "424890659460",
    appId: "1:424890659460:web:5a1c8135cc06bb079d08d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const functions = getFunctions(app);

export const sources = readable({}, function start(set) {
    const sources_ref = ref(db, "sources");
    onValue(sources_ref, (snapshot) => {  // on() method to listen for changes to the data
        // const data = snapshot.val();
        // const sources = Object.keys(data).map((key) => ({
            // ...data[key],
            // id: key,
        // }));
        const sources = snapshot.val() ? snapshot.val() : {};
        set(sources);
    });

    // return a function that will be called when the store is no longer in use. Actually it is always in use.
    return function stop() {
    };
}
);


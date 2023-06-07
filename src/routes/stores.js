import { onValue, ref } from "firebase/database";
import { readable} from "svelte/store";
import { db } from "./firebase.js";

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


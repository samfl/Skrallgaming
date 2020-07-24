import { firestoreDb } from ".";

export var isAuthenticated = async (username, password) => {
    let status = false;
    await firestoreDb.collection('players').get().then(snap => {
        snap.docs.forEach(doc => {
            if((username === doc.data().nick) && (password === doc.data().password)) {
                status = true; 
            }
        });
    });
    return status; 
}
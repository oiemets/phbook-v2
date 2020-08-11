const CONTACTS = 'cnts/';

function getAllContacts() {
    if(state.isAuth){
        return new Promise( (resolve) => {
            firebase.database().ref(CONTACTS).once('value', (snap) => {
                if(!snap.val()){
                    resolve([]);
                    return;
                }
                resolve(snap.val());
            });
        });  
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                let json = localStorage.getItem(CONTACTS);
                if(!json){
                    resolve([]);
                    return;
                }
                resolve(JSON.parse(json));
            }, 2000);   
        })
    }
}

function addContact(contact) {
    if(state.isAuth){
        return new Promise((resolve) => {
            firebase.database().ref(CONTACTS).once('value', (snap) => {
                if(!snap.val()){
                    resolve([]);
                    return;
                }
                resolve(snap.val());
            })
        }).then((database) => {
                return new Promise((resolve, reject) => {
                    if(database.find(c => c.email === contact.email)){
                        reject(new Error(`contact with this email: ${contact.email} already exists`));
                        return;
                    }
                    database.push(contact);
                    firebase.database().ref(CONTACTS).set([...database]);
                    resolve();
                });
            });
        
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let json = localStorage.getItem(CONTACTS);
                let arr = [];
                if(json){
                    arr = JSON.parse(json);
                }
                if(arr.find(c => c.email === contact.email)){
                    reject(new Error(`contact with this email: ${contact.email} already exists`)); 
                }
                arr.push(contact);
                localStorage.setItem(CONTACTS, JSON.stringify(arr));
                resolve();
            }, 2000);
        });
    }
}

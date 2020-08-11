const CONTACTS = 'cnts/';

const TIMEOUT = 0;
const awaiter = (value) => new Promise(
    resolve =>
        setTimeout(
            () => resolve(value),
            TIMEOUT
        )
);

class LocalDB {
    getAllContacts() {
        let json = localStorage.getItem(CONTACTS);
        if (!json){
            return awaiter([]);
        }
        return awaiter(JSON.parse(json));
    }

    addContact(contact) {
        let json = localStorage.getItem(CONTACTS);
        let arr = [];
        if(json){
            arr = JSON.parse(json);
        }
        if (arr.find(c => c.email === contact.email)) {
            throw new Error(`contact with this email: ${contact.email} already exists`)
        }
        arr.push(contact);
        localStorage.setItem(CONTACTS, JSON.stringify(arr));

        return awaiter();
    }
}

class FireBaseDB {
    getAllContacts() {
        return new Promise(resolve => {
            firebase.database().ref(CONTACTS).once('value', (snap) => {
                if (!snap.val()) {
                    resolve([]);
                    return;
                }
                resolve(snap.val().filter(v => v && v.email));
            });
        })
    }

    async addContact(contact) {
        const contacts = (await this.getAllContacts());
        if (contacts.find(c => c.email === contact.email)) {
            throw new Error(`contact with this email: ${contact.email} already exists`);
        }
        contacts.push(contact);
        firebase.database().ref(CONTACTS).set([...contacts]);
    }
}

class DataBase {
    static Databases = {
        local: LocalDB,
        firebase: FireBaseDB
    }

    constructor(type) {
        this.type = type;
        this._database = new DataBase.Databases[type](type)
    }

    async getAllContacts() {
        return this._database.getAllContacts();
    }

    async addContact(contact) {
        return this._database.addContact(contact)
    }
}

// function getAllContacts() {
//     if(state.isAuth){
//         return new Promise( (resolve) => {
//             firebase.database().ref(CONTACTS).once('value', (snap) => {
//                 if(!snap.val()){
//                     resolve([]);
//                     return;
//                 }
//                 resolve(snap.val());
//             });
//         });
//     } else {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 let json = localStorage.getItem(CONTACTS);
//                 if(!json){
//                     resolve([]);
//                     return;
//                 }
//                 resolve(JSON.parse(json));
//             }, 2000);
//         })
//     }
// }

// function addContact(contact) {
//     if(state.isAuth){
//         return new Promise((resolve) => {
//             firebase.database().ref(CONTACTS).once('value', (snap) => {
//                 if(!snap.val()){
//                     resolve([]);
//                     return;
//                 }
//                 resolve(snap.val());
//             })
//         }).then((database) => {
//                 return new Promise((resolve, reject) => {
//                     if(database.find(c => c.email === contact.email)){
//                         reject(new Error(`contact with this email: ${contact.email} already exists`));
//                         return;
//                     }
//                     database.push(contact);
//                     firebase.database().ref(CONTACTS).set([...database]);
//                     resolve();
//                 });
//             });

//     } else {
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 let json = localStorage.getItem(CONTACTS);
//                 let arr = [];
//                 if(json){
//                     arr = JSON.parse(json);
//                 }
//                 if(arr.find(c => c.email === contact.email)){
//                     reject(new Error(`contact with this email: ${contact.email} already exists`));
//                 }
//                 arr.push(contact);
//                 localStorage.setItem(CONTACTS, JSON.stringify(arr));
//                 resolve();
//             }, 2000);
//         });
//     }
// }

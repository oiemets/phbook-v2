let state = {
    loader: false,
    contacts: [],
    isAuth: false
}

function setState(newState) {
    state = {...newState};
    app();
};

(() => {
    const root = document.querySelector('#root');
    const loader = document.querySelector('.lds-ring');
    loader.style.display = 'none';
    root.style.display = 'flex';
    const form = loginForm();
    root.append(form);

    form.onsubmit = (e) => {
        e.preventDefault();
        setState({...state, loader: true});
        const auth = firebase.auth();
        auth.signOut()
        .then(() => auth.signInWithEmailAndPassword(e.target.email.value, e.target.password.value))
        .then((user) => {
            if(user){
                setState({...state, loader: true, isAuth: true});
                getAllContacts()
                .then((contacts) => {
                setState({...state, contacts, loader: false})
            });
        }
        }).catch(e => {
            setState({...state, loader: true});
            alert(e + 'localStorage it is!');
            getAllContacts()
            .then((contacts) => {
            setState({...state, contacts, loader: false})})
    })}
})();  

function app() {
    const root = document.querySelector('#root');
    const loader = document.querySelector('.lds-ring');
        if(state.loader) {
            loader.style.display = 'block';
            root.style.display = 'none';
        } else {
            loader.style.display = 'none';
            root.style.display = 'flex';
            root.innerHTML = contactList(state.contacts);
            const form = myForm();
            root.append(form);
    
            form.onsubmit = (e) => {
                e.preventDefault();
                setState({...state, loader: true});
                let contact = {email: e.target.email.value,
                    fullname: e.target.fullname.value,
                    phone: e.target.phone.value}
                addContact(contact).then(() => {
                    setState({...state, contacts: [...state.contacts, contact], loader: false});
                }).catch(e => {
                    setState({...state, loader: false});
                    alert(e);
                });                  
            }
        };
}

function contactList(arr) {
    return `
    <ul>
    ${arr.map(c => `<li>${c.fullname} - ${c.phone} - ${c.email}</li>`).join('')}
    </ul>
    `
}

function myForm() {
    const form = document.createElement('form');
    form.name = 'form';
    form.action = '#';
    form.innerHTML = `
        <input type="text" name="email" placeholder="email" autocomplete="off" required>
        <input type="text" name="fullname" placeholder="full name" autocomplete="off" required>
        <input type="text" name="phone" placeholder="phone" autocomplete="off" required>
        <button type="submit">add</button>
    `;
    return form;
};

function loginForm() {
    const form = document.createElement('form');
    form.name = 'form';
    form.className = 'login_form';
    form.action = '#';
    form.innerHTML = `
        <input type="text" name="email" placeholder="email" autocomplete="off" required>
        <input type="text" name="password" placeholder="password" autocomplete="off" required>
        <button type="submit">log in</button>
    `;
    return form;
};
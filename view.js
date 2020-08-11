let state = {
    loader: false,
    contacts: [],
    database: undefined
}

function setState(newState) {
    state = {...newState};
    app();
};


(async () => {
    const root = document.querySelector('#root');
    const loader = document.querySelector('.lds-ring');
    loader.style.display = 'none';
    root.style.display = 'flex';
    const form = loginForm();
    root.append(form);

    form.onsubmit = async (e) => {
        e.preventDefault();
        setState({...state, loader: true});
        const auth = firebase.auth();
        await auth.signOut();


        const user = await auth.signInWithEmailAndPassword(
            e.target.email.value,
            e.target.password.value
        ).catch(() => {});

        if(user) {
            const database = new DataBase('firebase');
            setState({...state, loader: true, database});

            const contacts = await database.getAllContacts();
            setState({...state, contacts, loader: false})
            return;
        }

        const database = new DataBase('local');
        setState({...state, loader: true, database});

        alert(e + 'localStorage it is!');

        const contacts = await database.getAllContacts();
        setState({...state, contacts, loader: false});
    }

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

            form.onsubmit = async (e) => {
                e.preventDefault();
                if (!state.database) {
                    throw new Error('DataBase have to be instantiated');
                }

                setState({...state, loader: true});

                const contact = ['email', 'fullname', 'phone'].reduce(
                    (acc, field) => ({...acc, [field]: e.target[field].value}),
                    {}
                );

                try {
                    await state.database.addContact(contact);
                    setState({
                        ...state,
                        contacts: [...state.contacts, contact],
                        loader: false
                    });
                } catch (e) {
                    setState({...state, loader: false});
                    alert(e);
                }
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
        <input type="text" name="email" placeholder="email" required>
        <input type="password" name="password" placeholder="password" required>
        <button type="submit">log in</button>
    `;
    return form;
};
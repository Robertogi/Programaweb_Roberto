// JavaScript do Aplicativo

// Monitora usuário logado
firebase.auth().onAuthStateChanged((user) => {

    // Se tem alguém logado
    if (user) {

        // Monta 'view' do usuário logado
        var html = `
<div id="userLogged">        
    <img src="${user.photoURL}" alt="${user.displayName}">
    <div>${user.displayName}</div>
</div>
        `;

        // Mostra usuário logado
        $('#userData').html(html);

        // Monitora click no usuário logado
        $(document).on('click', '#userLogged', logout);
    } else {
        // User is signed out

        var html = `
        
<img src="/img/user.png" alt="Logue-se">
<button id="btnLogin"><i class="fab fa-fw fa-google"></i> Entrar / Login</button>        
        
        `;

        // Mostra botão de login
        $('#userData').html(html);

        // Monitora botão "login"
        $(document).on('click', '#btnLogin', login);

        console.log('Ninguém logou ainda!');
    }
});

var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'});

// Login de usuário
function login() {

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(
            firebase.auth().signInWithPopup(provider)
                .then(

                    (result) => {
                        /** @type {firebase.auth.OAuthCredential} */
                        var credential = result.credential;

                        // This gives you a Google Access Token. You can use it to access the Google API.
                        var token = credential.accessToken;
                        // The signed-in user info.
                        var user = result.user;
                        // ...
                    }

                ).catch((error) => { console.error('Erro: ', error); })
    )
    .catch ((error) => { console.error('Erro: ', error); });
}

function logout() {

    var msg = `Tem certeza que deseja sair do aplicativo?`;

    if (confirm(msg)) {

        firebase.auth().signOut();

    }

    return false;

}
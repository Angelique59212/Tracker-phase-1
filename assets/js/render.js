const ipc = require('electron').ipcRenderer;

document.getElementById('mon-button').addEventListener('click', ()=> {
    // envoi de l'event de log
    ipc.send('log-error', {
        type: 'Critical',
        message: "L'appli va s'auto-détruire"
    });
    remote.dialog.showErrorBox('Erreur système', "Erreur critique détectée, l'appli doit redemarré");
});




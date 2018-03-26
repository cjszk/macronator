$(document).ready(function() {
    api.getUserById((data) => {
        store.currentUser = data;
        console.log(store.currentUser);
        macronator.render();
    });

    macronator.bindEventListeners();
})
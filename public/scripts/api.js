const api = (function() {
    BASE_URL = 'http://localhost:8080'
    id = "000000000000000000000000"
    const getUserById = function(callback) {
        console.log('getUserById ran')
        $.getJSON(`${BASE_URL}/users/${id}`, callback);
    }
    return {
        getUserById
    }
}());
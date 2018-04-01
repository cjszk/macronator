const api = (function() {
    BASE_URL = 'http://localhost:8080'
    
    const getUsers = function(callback) {
        $.getJSON(`${BASE_URL}/users`, callback);
    }

    const getUserById = function(id, callback) {
        $.getJSON(`${BASE_URL}/users/${id}`, callback);
        // $.ajax({
        //     url: `${BASE_URL}/users/${id}`,
        //     method: 'GET',
        //     contentType: 'application/json',
        //     success: callback
        // })
    }

    const updateUser = function(id, updateData, callback) {
        $.ajax({
            url: `${BASE_URL}/users/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: callback
        })
        console.log('ran through updateId')
    }

    const postData = function(data, callback) {
        $.ajax({
            url: `${BASE_URL}/data/`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: callback
        })
    }

    const postMeasurement = function(data, callback) {
        $.ajax({
            url: `${BASE_URL}/measurements/`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: callback
        })
    }

    return {
        getUsers,
        getUserById,
        updateUser,
        postData,
        postMeasurement
    }
}());
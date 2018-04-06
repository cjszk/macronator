const api = (function() {
    //BASE_URL = 'http://localhost:8080'
    BASE_URL = 'https://macronator.herokuapp.com'
    
    const getUsers = function(callback) {
        $.getJSON(`${BASE_URL}/users`, callback);
    }

    const getUserById = function(id, callback) {
        $.getJSON(`${BASE_URL}/users/${id}`, callback);
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

    const updatePassword = function(id, updateData, callback) {
        $.ajax({
            url: `${BASE_URL}/password/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: callback
        })
        console.log('ran through updateId')
    }

    const updateData = function(id, updateData, callback) {
        $.ajax({
            url: `${BASE_URL}/data/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: callback
        })
    }

    const updateMeasurements = function(id, updateData, callback) {
        $.ajax({
            url: `${BASE_URL}/measurements/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: callback
        })
    }

    const postUser = function (data, callback) {
        $.ajax({
            url: `${BASE_URL}/users/`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: callback
        })
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

    const deleteData = function(id, callback) {
        $.ajax({
            url: `${BASE_URL}/data/${id}`,
            method: 'DELETE',
            contentType: 'application/json',
            success: callback
        })
    }

    const login = function(data, callback) {
        $.ajax({
            url: `${BASE_URL}/login/`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: callback,
            statusCode: {
                401:function() {alert(`Access Denied: Incorrect Password`)}
            }
        })
    }

    return {
        updatePassword,
        login,
        postUser,
        updateData,
        updateMeasurements,
        deleteData,
        getUsers,
        getUserById,
        updateUser,
        postData,
        postMeasurement
    }
}());

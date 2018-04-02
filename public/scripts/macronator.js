const macronator = (function() {

    const render = function (html) {
        $('.app').html(html);
    }

    const loginScreen = function () {
        let html = `
        <div class="login">
            <form class="login__form">
                <label class="login__form__label">Login Username</label>
                <br>
                <input class="login__form__username" required>
                <br>
                <label class="login__form__label">Login Password</label>
                <br>
                <input class="login__form__password" type="password" required>
                <br>
                <button class="login__form__button" type="submit">Log In</button>
            </form>
        </div>
        `
        render(html);
    }

    const login = function () {
        $('.app').on('submit', '.login__form', function(event) {
            event.preventDefault();
            const loginUsername = $('.login__form__username').val();
            const loginPassword = $('.login__form__password').val();
            $('.password-input').val('');
            let found = false;
            api.getUsers(function(results) {
                found = false;
                results.forEach((user) => {
                    if (user.username === loginUsername) {
                        if (user.password === loginPassword) {
                            console.log(user);
                            store.currentUser = user;
                        } else {
                            found = true;
                            alert('Incorrect Password, please try again.')
                        }
                    } 
                })
                if (!store.currentUser && found === false) {
                    alert('User not found, please confirm that your information is correct.')
                }
            })
        setTimeout(function() {
            if (store.currentUser) {
                console.log(store.currentUser);
                macronator.sortDataDate();
                macronator.renderMain();
            }
        }, 1000)
        })
    }

    const sortDataDate = function() {
        store.currentUser.data.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        console.log('sorted')
    }

    const handleNotNew = function() {
        const currentUser = store.currentUser;
        const measurements = {
            weight: null,
            shoulders: null,
            chest: null, 
            waistAbove: null,
            waist: null, 
            waistBelow: null,
            hips: null,
            quads: null
        };
        currentUser.data.forEach((item) => {
            if (item.weight) {
                measurements.weight = item.weight;
            }
            if (item.measurements.shoulders) {
                measurements.shoulders = item.measurements.shoulders;
            }
            if (item.measurements.chest) {
                measurements.chest = item.measurements.chest;
            }
            if (item.measurements.waistAbove) {
                measurements.waistAbove = item.measurements.waistAbove;
            }
            if (item.measurements.waist) {
                measurements.waist = item.measurements.waist;
            }
            if (item.measurements.waistBelow) {
                measurements.waistBelow = item.measurements.waistBelow;
            }
            if (item.measurements.hips) {
                measurements.hips = item.measurements.hips;
            }
            if (item.measurements.quads) {
                measurements.quads = item.measurements.quads;
            }
        })
        
        let year;
        let month;
        let day;
        let cryptoDate;
        let monthDays
        let cryptoDateArray = [];
        for (i=0; i<currentUser.data.length; i++) {
            year = currentUser.data[i].date.slice(0, 4)
            month = currentUser.data[i].date.slice(5, 7)
            day = currentUser.data[i].date.slice(8, 10)
            if (month == 01) {
                monthDays = 0
            }
            if (month == 02) {
                monthDays = 31
            }
            else if (month == 03) {
                monthDays = 59.5
            }
            else if (month == 04) {
                monthDays = 90.5
            }
            else if (month == 05) {
                monthDays = 120.5
            }
            else if (month == 06) {
                monthDays = 151.5
            }
            else if (month == 07) {
                monthDays = 181.5
            }
            else if (month == 08) {
                monthDays = 212.5
            }
            else if (month == 09) {
                monthDays = 243.5
            }
            else if (month == 10) {
                monthDays = 273.5
            }
            else if (month == 11) {
                monthDays = 304.5
            }
            else if (month == 12) {
                monthDays = 334.5
            }

            cryptoDate = parseInt(year * 365) + parseInt(monthDays) + parseInt(day);
            let newData = {
                calories: currentUser.data[i].calories,
                weight: currentUser.data[i].weight,
                cryptoDate: cryptoDate
            }
            cryptoDateArray.push(newData)
        }
        console.log(cryptoDateArray);
        let cryptoDateArrayTemp;
        //If cryptoDateArray > 30, get only the most recent 30 entries instead.
        if (cryptoDateArray.length > 30) {
            cryptoDateArrayTemp = cryptoDateArray.slice(cryptoDateArray.length-30, cryptoDateArray.length); 
            cryptoDateArray = cryptoDateArrayTemp 
        }

        //Calculate TDEE
        let estDailyTDEE;
        let TDEEArray = [];
        for (let i=1; i<cryptoDateArray.length; i++) {
            let dateMargin = cryptoDateArray[i].cryptoDate - cryptoDateArray[i-1].cryptoDate;
            let avgCalorieConsumption = (cryptoDateArray[i].calories + cryptoDateArray[i-1].calories) / 2;
            let weightMargin = cryptoDateArray[i].weight - cryptoDateArray[i-1].weight;
            estDailyTDEE = ((avgCalorieConsumption*dateMargin) - (weightMargin*3500)) / dateMargin;
            TDEEArray.push(estDailyTDEE);
        }

        const calculatedTDEE = Math.round(TDEEArray.reduce((a, b) => {
           return a + b
        })/TDEEArray.length)
        console.log(calculatedTDEE)

        let advised;
        if (currentUser.goal === "Gain") {
            advised = Math.round(calculatedTDEE * 1.05);
        } else if (currentUser.goal === "Cut") {
            advised = Math.round(calculatedTDEE * 0.8);
        } else {
            advised = Math.round(calculatedTDEE);
        }
        let protein = Math.round(measurements.weight);
        let fat = Math.round(measurements.weight * 0.4);
        let carbs = Math.round( ( advised - ((protein * 4) + (fat * 9))) / 4);
        const html = `
            <div class="home">
                <h3 class="home__h3">Overview</h3>
                <div class="home__left col-5">
                    <div class="home__left__tdee"><p>Your Current Estimated TDEE: <b>${calculatedTDEE} kcal</b></p></div>
                    <div class="home__left__current-weight"><p>Most Recent Weigh-In: <b>${measurements.weight} lbs</b></p></div>
                    <div class="home__left__goal"><p>Current Goal: <b>${currentUser.goal}</b></p></div>
                    <div class="home__left__advice-calories"><p>Advised Calorie Consumption: <b>${advised} kcal</b> </p></div>
                    <div class="home__left__advice-macros">Example Macro Distribution: <b>${protein}g Protein / ${carbs}g Carbs / ${fat}g Fat</b></div>
                </div>
                <div class="home__right col-5">
                    <div class="home__right__body-stats">
                        <ul class="home__right__body-stats__list"><b><u>Most Recent Body Measurements</u></b>
                            <li>Shoulders: <b>${measurements.shoulders}"</b></li>
                            <li>Chest: <b>${measurements.chest}"</b></li>
                            <li>Waist 2" above: <b>${measurements.waistAbove}"</b></li>
                            <li>Waist (at navel): <b>${measurements.waist}"</b></li>
                            <li>Waist 2" below: <b>${measurements.waistBelow}"</b></li>
                            <li>Hips: <b>${measurements.hips}"</b></li>
                            <li>Quadriceps: <b>${measurements.quads}"</b></li>
                        </ul>
                    </div>
                </div>
            </div>
        `
        render(html);
    }
    

    const home = function () {
        $('.header__home').on('click', function() {
            renderMain();
        })
    }

    const inputNewForm = function () {
        if (store.currentUser) {
            const html = `
            <div class="input">
            <h3 class="input__h3">Input New Data</h3>
            <form class="input__form">
                <div class="input__form__basic">
                    <h4 class="input__h4">Basic Info</h4>
                    <label>Date</label>
                    <input class="input__form__basic__date" type="date" required>
                    <label>Calories Consumed</label>
                    <input type="number" class="input__form__basic__calories" max="15000">
                    <label>Weight</label>
                    <input type="number" class="input__form__basic__weight" max="600">
                </div>
                <button class="submit-data" type="submit">Submit</button>
                <div class="input__form__measurements">
                    <h4 class="input__h4">Body Measurements (optional)</h4>
                    <label>Shoulders</label>
                    <input type="number" class="input__form__measurements__shoulders">
                    <label>Chest</label>
                    <input type="number" class="input__form__measurements__chest">
                    <label>Waist 2" Above</label>
                    <input type="number" class="input__form__measurements__waistAbove">
                    <label>Waist (at navel)</label>
                    <input type="number" class="input__form__measurements__waist">
                    <label>Waist 2" Below</label>
                    <input type="number" class="input__form__measurements__waistBelow">
                    <label>Hips</label>
                    <input type="number" class="input__form__measurements__hips">
                    <label>Quads</label>
                    <input type="number" class="input__form__measurements__quads">
                </div>
            </form>
        </div>
            `
            render(html);
        }
    }

    const inputNew = function () {
        $('.input-data').on('click', function() {
            inputNewForm();
        })
    }

    const handleNew = function() {
        alert('Since you have no data yet, please input some data.')
        inputNewForm();
    }

    const detailsTab = function () {
        let liStrings = [];
        store.currentUser.data.forEach((item) => {
            let date = item.date.slice(0, 10)
            console.log(item.id);
            liStrings.push(`<li class="details__ul__li"><a 
            measurements-id="${item.measurements.id}"
            data-id="${item.id}" 
            calories="${item.calories}" weight="${item.weight}" date="${item.date}"
            shoulders="${item.measurements.shoulders}"
            chest="${item.measurements.chest}"
            waistAbove="${item.measurements.waistAbove}"
            waist="${item.measurements.waist}"
            waistBelow="${item.measurements.waistBelow}"
            hips="${item.measurements.hips}"
            quads="${item.measurements.quads}"
             href="#" class="details__ul__li__a">
             Date: <b>${date}</b> Calories: <b>${item.calories}</b> Weight: <b>${item.weight}</b>
             </a><button id="${item.id}" class="details__ul__li__delete">Delete</button></li>`)
        });
        let joinedLi = liStrings.join('');
        console.log(joinedLi);
        let html = `
        <div class="details">
            <ul class="details__ul">
                ${joinedLi}
            </ul>
        </div>
        `;
        render(html);
    }

    const clickDetailsTab = function () {
        $('.view-edit-details').on('click', function() {
            detailsTab();
        })
    }

    const deleteEntry = function () {
        $('.app').on('click', '.details__ul__li__delete', function() {
            const id = $(this).attr('id');
            api.deleteData(id, function () {
                console.log(`Deleted ${id}`)
                let dataArr = [];
                store.currentUser.data.forEach(function(item) {
                    if (item.id !== id) {
                        dataArr.push(item);
                    }
                })
                store.currentUser.data = dataArr;
                macronator.sortDataDate();
                console.log(store.currentUser);
                detailsTab();
            })
        })
    }

    //Needs more work. This isn't working as intended.
    const selectDate = function () {
        $('.app').on('click', '.details__ul__li__a', function () {
            const dateInfo = $(this).attr('date');
            const date = dateInfo.slice(0, 10);
            const calories = $(this).attr('calories');
            const weight = $(this).attr('weight');
            const shoulders = $(this).attr('shoulders');
            const chest = $(this).attr('chest');
            const waistAbove = $(this).attr('waistAbove');
            const waist = $(this).attr('waist');
            const waistBelow = $(this).attr('waistBelow');
            const hips = $(this).attr('hips');
            const quads = $(this).attr('quads');
            console.log($(this).attr('measurements-id'));
            const html = `
            <div class="edit" data-id="${$(this).attr('data-id')}" measurements-id="${$(this).attr('measurements-id')}">
            <h3 class="edit__h3">Edit New Data</h3>
            <form class="edit__form">
                <div class="edit__form__basic">
                    <h4 class="edit__h4">Basic Info</h4>
                    <label>Date</label>
                    <input id="edit__form__basic__date" class="edit__form__basic__date" type="date" value="${date}" required>
                    <label>Calories Consumed</label>
                    <input type="number" class="edit__form__basic__calories" value="${calories}" max="15000">
                    <label>Weight</label>
                    <input type="number" class="edit__form__basic__weight" value=${weight} max="600">
                </div>
                <button class="submit-data" type="submit">Submit</button>
                <div class="edit__form__measurements">
                    <h4 class="edit__h4">Body Measurements (optional)</h4>
                    <label>Shoulders</label>
                    <input type="number" class="edit__form__measurements__shoulders" value="${shoulders}">
                    <label>Chest</label>
                    <input type="number" class="edit__form__measurements__chest" value="${chest}">
                    <label>Waist 2" Above</label>
                    <input type="number" class="edit__form__measurements__waistAbove" value="${waistAbove}">
                    <label>Waist (at navel)</label>
                    <input type="number" class="edit__form__measurements__waist" value="${waist}">
                    <label>Waist 2" Below</label>
                    <input type="number" class="edit__form__measurements__waistBelow" value="${waistBelow}">
                    <label>Hips</label>
                    <input type="number" class="edit__form__measurements__hips" value="${hips}">
                    <label>Quads</label>
                    <input type="number" class="edit__form__measurements__quads" value="${quads}">
                </div>
            </form>
        </div>
            `
            render(html);
        })

    }

    const renderMain = function() {
        if (store.currentUser.data.length !== 0) {
            handleNotNew();
        } else {
            handleNew();
        }
    }

    const submitData = function() {
        $('.app').on('submit', '.input__form', function(event) {
            event.preventDefault();
            const date = $('.input__form__basic__date').val();
            console.log(date);
            console.log(store.currentUser.data[0].date.slice(0, 10))
            const calories = $('.input__form__basic__calories').val();
            const weight = $('.input__form__basic__weight').val();
            const shoulders = $('.input__form__measurements__shoulders').val();
            const chest = $('.input__form__measurements__chest').val();
            const waistAbove = $('.input__form__measurements__waistAbove').val();
            const waist = $('.input__form__measurements__waist').val();
            const waistBelow = $('.input__form__measurements__waistBelow').val();
            const hips = $('.input__form__measurements__hips').val();
            const quads = $('.input__form__measurements__quads').val();
            let existing = false;
            store.currentUser.data.forEach((item) => {
                if (date === item.date.slice(0, 10)) {
                    existing = true;
                }
            })
            if (existing === true) {
                alert('That date already has an entry.')
            } else {
                $('.input__form__basic__date').val('');
                $('.input__form__basic__calories').val('');
                $('.input__form__basic__weight').val('');
                $('.input__form__measurements__shoulders').val('');
                $('.input__form__measurements__chest').val('');
                $('.input__form__measurements__waistAbove').val('');
                $('.input__form__measurements__waist').val('');
                $('.input__form__measurements__waistBelow').val('');
                $('.input__form__measurements__hips').val('');
                $('.input__form__measurements__quads').val('');
                const currentUser = store.currentUser;
                const newMeasurements = {
                    shoulders: shoulders,
                    chest: chest,
                    waistAbove: waistAbove,
                    waist: waist,
                    waistBelow: waistBelow,
                    hips: hips,
                    quads: quads
                }
                console.log(newMeasurements);
                //post the measurement data, then post the data data along with measurement ID, then update the data ID to the user data
                api.postMeasurement(newMeasurements, function(results) {
                    let measurementsId = results.id
                    console.log(measurementsId);
                    const newData = {
                        date: date,
                        weight: weight,
                        calories: calories,
                        measurements: measurementsId
                    }
                    console.log(newData);
                    api.postData(newData, function(results) {
                        console.log(results);
                        let newDataId = results.id
                        currentUser.data.push()
                        let newUserUpdate = {
                            username: currentUser.username,
                            password: currentUser.password,
                            data: [],
                            goal: currentUser.goal
                        }
                        currentUser.data.forEach((arr) => {
                            newUserUpdate.data.push(arr.id)
                        })
                        newUserUpdate.data.push(newDataId);
                        console.log(newUserUpdate);
                        console.log(currentUser.id);
                        api.updateUser(currentUser.id, newUserUpdate, function(results) {
                            console.log(results);
                            store.currentUser = results;
                            macronator.sortDataDate();
                        })
                    })
                })
            }
        })
    }
    const editData = function() {
        $('.app').on('submit', '.edit__form', function(event) {
            event.preventDefault();
            const date = $('.edit__form__basic__date').val();
            const calories = $('.edit__form__basic__calories').val();
            const weight = $('.edit__form__basic__weight').val();
            const shoulders = $('.edit__form__measurements__shoulders').val();
            const chest = $('.edit__form__measurements__chest').val();
            const waistAbove = $('.edit__form__measurements__waistAbove').val();
            const waist = $('.edit__form__measurements__waist').val();
            const waistBelow = $('.edit__form__measurements__waistBelow').val();
            const hips = $('.edit__form__measurements__hips').val();
            const quads = $('.edit__form__measurements__quads').val();
            const currentUser = store.currentUser;
            const newMeasurements = {
                shoulders: shoulders,
                chest: chest,
                waistAbove: waistAbove,
                waist: waist,
                waistBelow: waistBelow,
                hips: hips,
                quads: quads
            }

            const dataId = $('.edit').attr('data-id');
            const measurementsId = $('.edit').attr('measurements-id')
            api.updateMeasurements(measurementsId, newMeasurements, function (result) {
                console.log(result)
                const newData = {
                    date: date,
                    weight: weight,
                    calories: calories,
                    measurements: measurementsId
                }
                api.updateData(dataId, newData, function (result) {
                    const userId = store.currentUser.id;
                    console.log(userId);
                    api.getUserById(userId, function(result) {
                        console.log(result);
                        store.currentUser = result;
                        sortDataDate();
                        detailsTab();
                    })
                })
            })
        })
    }

    const settings = function () {
        $('.edit-settings').on('click', function () {
            if (store.currentUser) {
                const html = `            
                <div class="settings">
                    <a href="#" class="settings__goals">Change Goals</a>
                    <a href="#" class="settings__password">Change Password</a>
                </div>`
                render(html);
            }
        })
    }
    const changePassword = function () {
        $('.app').on('click', '.settings__password',function () {
            const html = `
            <div class="settings">
                <form class ="settings__form" action="submit">
                    <label for="settings__old-password">Old Password</label>
                    <input class="settings__old-password" type="password" required>
                    <label for="settings__new-password">New Password</label>
                    <input class="settings__new-password" type="password" required>
                    <label for="settings__confirm-password">Confirm New Password</label>
                    <input class="settings__confirm-password" type="password" required>
                    <button class="settings__submit submit-data">Submit</button>
                </form>
            </div>
            `
            render(html);
        })
    }

    const submitNewPassword = function () {
        $('.app').on('submit', '.settings__form', function (event) {
            event.preventDefault();
            const oldPassword = $('.settings__old-password').val();
            const newPassword = $('.settings__new-password').val();
            const confirmPassword = $('.settings__confirm-password').val();
            if (oldPassword === store.currentUser.password) {
                if (newPassword === confirmPassword) {
                    let newUserUpdate = {
                        username: store.currentUser.username,
                        password: newPassword,
                        data: [],
                        goal: store.currentUser.goal
                    }
                    store.currentUser.data.forEach((arr) => {
                        newUserUpdate.data.push(arr.id)
                    })
                    api.updateUser(store.currentUser.id, newUserUpdate, function(results) {
                        console.log(results);
                        store.currentUser = results;
                        alert('Password has been changed');
                        macronator.sortDataDate();
                        handleNotNew();
                    })
                } else {
                    alert('New password does not match with the confirmed password, please try again.')
                    $('.settings__confirm-password').val('');
                    $('.settings__new-password').val('');
                }
            } else {
                alert('Incorrect password, please try again.')
                $('.settings__old-password').val('');
            }
        })
    }

    const changeGoals = function () {
        $('.app').on('click', '.settings__goals', function () {
            const html = `
            <div class="settings">
                <form class ="settings__goals-form" action="submit">
                    <label for="settings__change-goals">Set Goal:</label>
                    <select class="settings__change-goals" name="goals" size="3">
                        <option value="Gain">Gain Muscle</option>
                        <option value="Cut">Lose Fat</option>
                        <option value="Maintain">Maintain</option>
                    </select>
                    <button class="submit-data">Submit</button>
                </form>
            </div>
            `
            render(html);
        })
    }

    const submitChangeGoals = function () {
        $('.app').on('submit', '.settings__goals-form', function (event) {
            event.preventDefault();
            const newGoal = $('.settings__change-goals').val();
            if (newGoal !== null) {
                let newUserUpdate = {
                    username: store.currentUser.username,
                    password: store.currentUser.password,
                    data: [],
                    goal: newGoal
                }
                store.currentUser.data.forEach((arr) => {
                    newUserUpdate.data.push(arr.id)
                })
                api.updateUser(store.currentUser.id, newUserUpdate, function(results) {
                    console.log(results);
                    store.currentUser = results;
                    alert('Goal has been updated');
                    macronator.sortDataDate();
                    handleNotNew();
                })
            } else {
                alert('Please select a goal.')
            }
        })
    }


    function bindEventListeners() {
        submitChangeGoals();
        changeGoals();
        submitNewPassword();
        changePassword();
        settings();
        editData();
        clickDetailsTab();
        deleteEntry();
        selectDate();
        submitData();
        home();
        inputNew();
        login();
    }

    return {
        loginScreen: loginScreen,
        render: render,
        bindEventListeners: bindEventListeners,
        renderMain: renderMain,
        sortDataDate: sortDataDate
    }

}());
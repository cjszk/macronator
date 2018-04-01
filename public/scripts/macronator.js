const macronator = (function() {

    const render = function (html) {
        $('.app').html(html);
    }

    const loginScreen = function () {
        let html = `
            <div class="login-div">
                <form class="login-form">
                    <label>Login Username</label>
                    <input class="username-input" required>
                    <label>Login Password</label>
                    <input class="password-input" type="password" required>
                    <button type="submit">Log In</button>
                </form>
            </div>
        `
        render(html);
    }

    const login = function () {
        $('.app').on('submit', '.login-form', function(event) {
            event.preventDefault();
            const loginUsername = $('.username-input').val();
            const loginPassword = $('.password-input').val();
            $('.password-input').val('');
            let found = false;
            api.getUsers(function(results) {
                found = false;
                results.forEach((user) => {
                    if (user.username === loginUsername) {
                        if (user.password === loginPassword) {
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
        let protein = measurements.weight;
        let fat = Math.round(measurements.weight * 0.4);
        let carbs = Math.round( ( advised - ((protein * 4) + (fat * 9))) / 4);
        // let exampleCaloriesRemaining = Math.round((advised - (protein*4) - (carbs*4) - (fat*9)));
        // let exampleCarbs = Math.round(carbs + ((exampleCaloriesRemaining * 0.7) / 4));
        // let exampleFat = Math.round(fat + ((exampleCaloriesRemaining * 0.3) / 9));
        const html = `
            <div class="home">
                <div class="home__left col-5">
                    <div class="home__left__tdee"><p>Your Current Estimated TDEE: <b>${calculatedTDEE}</b></p></div>
                    <div class="home__left__current-weight"><p>Most Recent Weigh-In: <b>${measurements.weight}</b></p></div>
                    <div class="home__left__goal"><p>Current Goal: <b>${currentUser.goal}</b></p></div>
                    <div class="home__left__advice-calories"><p>Advised Calorie Consumption: <b>${advised}</b> </p></div>
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
        // const html = `
        //     <div class="left-panel">
        //         <div class="tdee"><p>Your Current Estimated TDEE: ${calculatedTDEE}</p></div>
        //         <div class="goal"><p>Goal: ${currentUser.goal}</p></div>
        //         <div class="current-weight"><p>Most Recent Weigh-In: ${measurements.weight} lbs</p></div>
        //         <div class="advice-calories"><p>Advised Calorie Consumption: ${advised}</p></div>
        //         <div class="advice-macros">
        //             <ul>Advised Macro Distribution: 
        //                 <li>Approximately: ${protein}g protein</li>
        //                 <li> Minimum of: ${carbs}g carbohydrates</li>
        //                 <li> Minimum of: ${fat}g fat</li>
        //                 <br>
        //                 <li> Remaining calories as desired from either carbohydrates or fats</li>
        //                 <br>
        //                 <li>For Example: <br>${protein}g Protein / ${exampleCarbs}g Carbs / ${exampleFat}g Fats</li>
        //             </ul>
        //         </div>
        //         <div class="body-stats">
        //             <ul>Most recent Stats:
        //                 <li>Shoulders: ${measurements.shoulders}"</li>
        //                 <li>Chest: ${measurements.chest}"</li>
        //                 <li>Waist 2" above: ${measurements.waistAbove}"</li>
        //                 <li>Waist (at navel): ${measurements.waist}"</li>
        //                 <li>Waist 2" below: ${measurements.waistBelow}"</li>
        //                 <li>Hips: ${measurements.hips}"</li>
        //                 <li>Quadriceps: ${measurements.quads}"</li>
        //             </ul>
        //         </div>
        //     </div>
        // `;
        render(html);
    }

    const handleNew = function() {

    }

    const renderMain = function() {
        if (store.currentUser.data.length !== 0) {
            handleNotNew();
        } else {
            handleNew();
        }
    }

    const submitData = function() {
        $('.app').on('submit', '.submit-data-form', function(event) {
            event.preventDefault();
            const date = $('.input-date').val();
            const calories = $('.input-calories').val();
            const weight = $('.input-weight').val();
            const shoulders = $('.input-shoulders').val();
            const chest = $('.input-chest').val();
            const waistAbove = $('.input-waistAbove').val();
            const waist = $('.input-waist').val();
            const waistBelow = $('.input-waistBelow').val();
            const hips = $('.input-hips').val();
            const quads = $('.input-quads').val();
            let currentUser = store.currentUser;
            let newMeasurements = {
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
                let newData = {
                    date: date,
                    weight: weight,
                    calories: calories,
                    measurements: measurementsId
                }
                api.postData(newData, function(results) {
                    console.log(results);
                    let newDataId = results.id
                    currentUser.data.push()
                    let newUserUpdate = {
                        username: currentUser.username,
                        password: currentUser.password,
                        data: []
                    }
                    currentUser.data.forEach((arr) => {
                        newUserUpdate.data.push(arr.id)
                    })
                    newUserUpdate.data.push(newDataId);
                    console.log(newUserUpdate);
                    console.log(currentUser.id);
                    api.updateUser(currentUser.id, newUserUpdate, function(results) {
                        console.log(results);
                        console.log('re-rendering')
                        renderMain();
                    })
                })
            })
        })
    }

    const graphs = function() {
    }

    const checkStore = function() {
        $('.store').click(function(){
            console.log(store.currentUser);
        })
    }

    function bindEventListeners() {
        submitData();
        checkStore();
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
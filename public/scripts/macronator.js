const macronator = (function() {

    const getData = function () {
        api.get()
    }

    const render = function (html) {
        $('.js-render-app').html(html);
    }

    const overview = function () {

    }

    const submitRecords = function () {
        $('.submit-records').click(function() {

            const html = `
            
            `;
            render(html);
        })
    }

    const graphs = function() {

    }

    function bindEventListeners() {
        submitRecords();
    }

    return {
        render: render,
        bindEventListeners: bindEventListeners
    }

}());
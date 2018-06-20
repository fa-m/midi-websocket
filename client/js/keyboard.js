$( document ).ready(function() {

    const connection = new WebSocket('ws://localhost:9000');

    connection.onopen = function () {
        connection.send('KEYBOARD CONNECTED');
    };

    // Log errors
    connection.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    connection.onmessage = function (e) {
        messageHandler('Got from Server: ' + e.data);
    };

    function messageHandler(message) {
        $('#receivedMessages').append(message + '<br />');
    }


    // CLICK HANDLER

    $('.whiteButton').click((e)=>{
        let tune = $(e.currentTarget).data('tune');
        connection.send(tune);
        messageHandler("Sent tune: " + tune)

    });

});
$( document ).ready(function() {

    const connection = new WebSocket('ws://localhost:9000');

    connection.onopen = function () {
        let message = 'BROADCASTER CONNECTED';

        connection.send(message);
        messageHandler('Sent to Server: ' + message)
    };

    // Log errors
    connection.onerror = function (error) {
        console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    connection.onmessage = function (e) {
        messageHandler('Received from Server: ' + e.data);
        let message = {data : [144, e.data, 1]};
        onMIDIMessage2(message);

        setTimeout( () => {
                let message2 = {data : [128, e.data, 0]};
                onMIDIMessage2(message2);
            }
            , 200);

    };


    let context = new AudioContext(),
        oscillators = {};

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess()
            .then(success, failure);
    }

    function success (midi) {
        let inputs = midi.inputs.values();
        // inputs is an Iterator

        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            // each time there is a midi message call the onMIDIMessage function
            input.value.onmidimessage = onMIDIMessage;
        }
    }

    function failure () {
        console.error('No access to your midi devices.')
    }

    function onMIDIMessage (message) {
        console.log("DATA FROM MIDI-DEVICE", message.data[0], message.data[1], message.data[2]);

        connection.send(message.data[1]);
        messageHandler("MESSAGE SENT: ", message.data[1]);

        let frequency = midiNoteToFrequency(message.data[1]);

        if (message.data[0] === 144 && message.data[2] > 0) {
            playNote(frequency);
        }

        if (message.data[0] === 128 || message.data[2] === 0) {
            stopNote(frequency);
        }
    }

    function onMIDIMessage2 (message) {
        console.log("DATA FROM MIDI-DEVICE", message.data[0], message.data[1], message.data[2]);

        let frequency = midiNoteToFrequency(message.data[1]);

        if (message.data[0] === 144 && message.data[2] > 0) {
            playNote(frequency);
        }

        if (message.data[0] === 128 || message.data[2] === 0) {
            stopNote(frequency);
        }
    }

    function midiNoteToFrequency (note) {
        return Math.pow(2, ((note - 69) / 12)) * 440;
    }

    function playNote (frequency) {
        oscillators[frequency] = context.createOscillator();
        oscillators[frequency].frequency.value = frequency;
        oscillators[frequency].connect(context.destination);
        oscillators[frequency].start(context.currentTime);
    }

    function stopNote (frequency) {
        oscillators[frequency].stop(context.currentTime);
        oscillators[frequency].disconnect();
    }

    function messageHandler(message) {
        $('#receivedMessages').append(message + '<br />');
    }

    // CLICK HANDLER
    $('#ws-sendbutton').click(()=>{
        let message = $('#ws-message').val();

        connection.send(message);
        messageHandler('Sent to Server: ' + message);
        $('#ws-message').val('');
    });

});
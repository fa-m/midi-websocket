# midi-websocket

## How to install

Just install npm dependencies with `npm install` and execute `npm start` after installation, so the Server will be started.

After that you can just open the `client/index.html` and change the following line, if needed.

    const connection = new WebSocket('ws://localhost:9000');
    
Connect a USB-Midi device to your computer/device and open `client/index.html` in your browser. (only tested in Google Chrome!)

    
## How to use

Just connect a USB-Midi device (Keyboard, drums etc.) and to your computer/device and open the `client/index.html`.

Everything you send with your USB-device will be broadcasted to the Clients, which are connected via the websocket.

## Links

* <a href="https://code.tutsplus.com/tutorials/introduction-to-web-midi--cms-25220" target="_blank">https://code.tutsplus.com/tutorials/introduction-to-web-midi--cms-25220</a>
   Tutorial Midi Device in HTML5






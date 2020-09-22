var HID = require('node-hid');
var devices = HID.devices();

console.log("Connected devices: ", devices)
console.log("Connected devices path: ", devices[0].path)
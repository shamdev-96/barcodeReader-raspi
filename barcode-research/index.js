const UsbScanner = require('@isirthijs/barcode-scanner');
var HID = require('node-hid');
var devices = HID.devices();

console.log("Connected devices: ", devices)
console.log("Connected devices path: ", devices[0].path)

const options = {
    vendorID:  1504,
    productID: 4608
}

const scanner = new UsbScanner(options)

scanner.on('data', (data) => {
    /// your code
    console.log("Data from barcode:" , data);
});

scanner.startScanning()
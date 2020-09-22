const UsbScanner = require('@isirthijs/barcode-scanner');
var HID = require('node-hid');
var devices = HID.devices();

console.log("Connected devices: ", devices)
console.log("Connected devices path: ", devices[0].path)

// const options = {
//     vendorID:  '05e0',
//     productID: '1200'
// }

// const options = {
// 	path: '/dev/hidraw0'
// }

console.log("Start the scanner>>>>");
var device = new HID.HID(devices[0].vendorId , devices[0].productId);

device.on("data", function(data) {
    console.log("-----------------------------------------------------------------");
    console.log("Data from barcode:" , data.toString('base64')) //<-- Decodes to hexadecimal
    data = atob(data.toString('base64'));
    console.log("Data from barcode CONVERT:" , data)
    // data.toString('base64'); //<-- Decodes to base64);
    console.log("-----------------------------------------------------------------");
  });



// const scanner = new UsbScanner(options)
// var deviceScanner = UsbScanner.showDevices()
// console.log("List of devices:" , deviceScanner);

// scanner.on('data', (data) => {
//     /// your code
//     console.log("Data from barcode:" , data);
// });

// try{
//     console.log("Start the scanner>>>>");
//     scanner.startScanning()
// }
// catch (e)
// {
//     console.log("Error when start the scanner: " , e);
// }

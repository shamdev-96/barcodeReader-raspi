const UsbScanner = require('@isirthijs/barcode-scanner');
var HID = require('node-hid');
var devices = HID.devices();

console.log("Connected devices: ", devices)
console.log("Connected devices path: ", devices[0].path)

// const options = {
//     vendorID:  1504,
//     productID: 4608
// }

// const options = {
// 	path: '/dev/hidraw0'
// }

var deviceInfo = devices.find( function(d) {
    var isTeensy = d.vendorId===0x1504 && d.productId===0x4608;
    return isTeensy;
});
if( deviceInfo ) {

  console.log("Start the scanner>>>>");
  var device = new HID.HID( deviceInfo.path );

  device.on("data", function(data) {
    console.log("Data from barcode:" , data);
  });
}

//   try{
    
//     scanner.startScanning()
// }
// catch (e)
// {
//     console.log("Error when start the scanner: " , e);
// }
//   // ... use device
// }

// const scanner = new UsbScanner(options)

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

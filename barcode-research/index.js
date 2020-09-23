//const UsbScanner = require("@isirthijs/barcode-scanner");
var HID = require("node-hid");
const hidMap = require("./hidmap");
const EventEmitter = require('events');
const BarcodeScanner = require('./barcode-scanner')
var devices = HID.devices();


var barcodeDevice = devices.find(item => item.product.includes("Scanner"))
console.log("Barcode device is detected: " , barcodeDevice );

const options = {
    vendorID:  barcodeDevice.vendorId,
    productID: barcodeDevice.productId
}

const scanner = new BarcodeScanner(options)

scanner.on('data', (data) => 
{
  if(data)
  {
    data = substring(0,data.length-1).replace("b" , "")
    //TODO: send barcode through socket
    console.log("Data from barcode:" , data); //eslint-disable-line 
  }

});
 

scanner.startScanning();

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

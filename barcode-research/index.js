const UsbScanner = require("@isirthijs/barcode-scanner");
var HID = require("node-hid");
const hidMap = require("./hidmap");
var atob = require("atob");
var devices = HID.devices();

let _hidMap = hidMap.standard;
let _hidMapShift = hidMap.shift;

console.log("Connected devices: ", devices);
console.log("Connected devices path: ", devices[0].path);

// const options = {
//     vendorID:  '05e0',
//     productID: '1200'
// }

// const options = {
// 	path: '/dev/hidraw0'
// }

console.log("Start the scanner>>>>");
var device = new HID.HID(devices[0].vendorId, devices[0].productId);

let scanResult = [];
let vCard = [];

// device.on("data", function (data) {

// //   const modifierValue = data[0];
// //   const characterValue = data[2];
// //   if (characterValue !== 0) {
// //     if (modifierValue === 2 || modifierValue === 20) {
// //       scanResult.push(_hidMapShift[characterValue]);
// //     } else if (characterValue !== 40) {
// //       scanResult.push(_hidMap[characterValue]);
// //     } else if (characterValue === 40) {
// //       let barcode = scanResult.join("");
// //       scanResult = [];
// //       barcode = removeUTF8(barcode);
// //       console.log("Data from barcode:", barcode);

// //       if (barcode === "BEGIN:VCARD") {
// //         vCard.push(barcode);
// //         console.log("Data from barcode:", vCard);
// //       } else if (barcode === "END:VCARD") {
// //         vCard.push(barcode);
// //         vCard = vCard.join("|");
// //         console.log("Data from barcode:", vCard);
// //         vCard = [];
// //       } else if (vCard.length > 0) {
// //         vCard.push(barcode);
// //         console.log("Data from barcode:", vCard);
// //       } else {
// //         console.log("Data from barcode:", vCard);
// //       }
// //     }

//     console.log("-----------------------------------------------------------------");
//     console.log("Data from barcode:" , data) 
//     console.log("-----------------------------------------------------------------");
  
// });

function removeUTF8(barcode) {
  let utf8 = barcode.slice(0, 7);
  if (utf8 === "\\000026") {
    barcode = barcode.slice(7);
    return barcode;
  } else return barcode;
}

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

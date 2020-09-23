
var HID = require("node-hid");
const BarcodeScanner = require('./barcode-scanner')

var devices = HID.devices();
console.log("List of devices:" , devices );
var barcodeDevice = devices.find(item => item.product.includes("Scanner"))
console.log("Barcode device is detected: " , barcodeDevice );

const options = {
    vendorID:  barcodeDevice.vendorId,
    productID: barcodeDevice.productId
}

const scanner = new BarcodeScanner(options)

scanner.on('data', (data) => 
{
  let formattedBarcode = ""

  if(data)
  {
    formattedBarcode = data
    /**
     * Converted data from event to formatted barcode string
     * Eg data: "bd06357715l"
     * But, the exact barcode string is "06357715"
     * So, we need to remove the last and first two character
     */
    formattedBarcode = formattedBarcode.substring(0 , formattedBarcode.length -1).substring(1).substring(1)

    //TODO: send barcode through socket
    console.log("Data from barcode:" , formattedBarcode); //eslint-disable-line 
  }

});

scanner.on('error ' , (err) =>
{
  console.log("Barcode Scanner Error" , err);
});
 
scanner.startScanning();


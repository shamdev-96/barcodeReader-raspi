const HID = require("node-hid").HID;
const devices = require("node-hid").devices();
const EventEmitter = require("events");
const hidMap = require("./hidmap");

class BarcodeScanner extends EventEmitter {
  constructor(options) {
    options = options || {};

    let {
      vendorID = undefined,
      productID = undefined,
      path = undefined,
	  vCardString = true,
	  isBusy = false,
      vCardSeperator = "|",
    } = options;

    super();

	this.vendorID = vendorID;
	this.isBusy = isBusy;
    this.productID = productID;
    this.path = path;
    this._vCardString = vCardString;
    this._vCardSeperator = vCardSeperator;

    this._hidMap = hidMap.standard;
    this._hidMapShift = hidMap.shift;

    // Bind 'this' to the methods
    this.startScanning = this.startScanning.bind(this);
  }


  static showDevices() {
    return devices;
  }

  async startScanning() {

    console.log("Start the scanner>>>>");

    try {
      if (this.path) {
        this.hid = new HID(path);
        console.log("---Scanner is Succesfully Registered with Path---");
      } else if (this.vendorID && this.productID) {
        this.hid = new HID(this.vendorID, this.productID);
        console.log("---Scanner is Succesfully Registered with VendorId & ProductId---");
      } else {
        throw "Device cannot be found, please supply a path or VID & PID";
      }
    } catch (error) {
      this.emit("error", error);
    }

    let scanResult = [];
    let vCard = [];

    let barcode = null

    this.hid.on("data", async (data) => {			
      const modifierValue = data[0];
      const characterValue = data[2];
      if (characterValue !== 0) {
        if (modifierValue === 2 || modifierValue === 20) {
        //   scanResult.push(this._hidMapShift[characterValue]);
        } else if (characterValue !== 40) {
          scanResult.push(this._hidMap[characterValue]);
          barcode = scanResult.join("");
          barcode = removeUTF8(barcode);
        } else if (characterValue === 40) {
          barcode = scanResult.join("");
          scanResult = [];
          barcode = removeUTF8(barcode);
          if (this._vCardString) {
            if (barcode === "BEGIN:VCARD") {
              vCard.push(barcode);
            } else if (barcode === "END:VCARD") {
              vCard.push(barcode);
              vCard = vCard.join(this._vCardSeperator);
              this.emit("data", vCard);
              vCard = [];
            } else if (vCard.length > 0) {
              vCard.push(barcode);
            } else {
              this.emit("data", barcode);
            }
          } else {
            this.emit("data", barcode);
          }
        } else {
          console.log("No need to process");
        }
      } else {
		  
		await sleep(250)
		scanResult = [];
		let simplifiedBarcode = barcode.replace("b" , "")
		simplifiedBarcode = simplifiedBarcode.subString(0,simplifiedBarcode.length()-1) 
		this.emit('data', simplifiedBarcode);
		barcode = null;
		//to delay until get full barcode data
		// if(!this.isBusy)
		// {
		// 	this.isBusy = true;
		// 	this.emit('data', barcode);		
		// }
		
      }
    });

  }

stopScanning() {
    this.hid.removeAllListeners("data");
    this.hid.close();
  }
}

let sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function removeUTF8(barcode) {
  let utf8 = barcode.slice(0, 7);
  if (utf8 === "\\000026") {
    barcode = barcode.slice(7);
    return barcode;
  } else {
    return barcode;
  }
}

module.exports = BarcodeScanner;

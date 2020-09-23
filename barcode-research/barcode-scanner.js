const HID = require('node-hid').HID;
const devices = require('node-hid').devices();
const EventEmitter = require('events');
const hidMap = require('./hidmap');

class BarcodeScanner extends EventEmitter {

	constructor(options) {
		options = options || {};

		let { 
			vendorID = undefined,
			productID = undefined,
			path = undefined, 
			vCardString = true,
			vCardSeperator = '|'
		} = options;

		super();

		this.vendorID = vendorID;
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
			if(this.path) 
			{
				this.hid = new HID(path);
				console.log("---Scanner is Succesfully Registered---");
			}
			else if (this.vendorID && this.productID)
			{
				this.hid = new HID(this.vendorID, this.productID);
				console.log("---Scanner is Succesfully Registered---");
			} 
			else 
			{
				throw 'Device cannot be found, please supply a path or VID & PID';
			}
		} catch(error) {
			this.emit('error', error);
		}
		
		let scanResult = [];
		let vCard = [];

		// Wait for device to respond
		let done = false;
		let isProcessing = false;
		let barcode = "";
		this.hid.on('data', (data) => {

			isProcessing = true;

			console.log('data is enter ----> ')
			const modifierValue = data[0];
			const characterValue = data[2];

			if (characterValue !== 0) {
				console.log('[characterValue !== 0]]')
				if (modifierValue === 2 || modifierValue === 20) {
					console.log('scanResult.push [modifierValue === 2 || modifierValue === 20]')
					scanResult.push(this._hidMapShift[characterValue]);
				} else if (characterValue !== 40) {
					console.log('scanResult.push [characterValue !== 40]')
					scanResult.push(this._hidMap[characterValue]);
					console.log('scanResult.push [characterValue !== 40]: ' ,scanResult)
					barcode = scanResult.join('');
					barcode = removeUTF8(barcode);
					console.log('scanResult.push [characterValue !== 40] Barcode: ' ,barcode)
				} else if (characterValue === 40) {
					console.log('scanResult.join [characterValue === 40]: ' , scanResult)
					let barcode = scanResult.join('');	
					console.log('scanResult.join [characterValue === 40]: ' , barcode)
					scanResult = [];

					barcode = removeUTF8(barcode);
					
					if (this._vCardString) {
						if (barcode === 'BEGIN:VCARD') {
							console.log('vCard.push[barcode === BEGIN:VCARD]: ' , barcode)
							vCard.push(barcode);
						} else if (barcode === 'END:VCARD') {
							console.log('vCard.push[barcode === END:VCARD]:' , barcode)
							vCard.push(barcode);
							vCard = vCard.join(this._vCardSeperator);							
							this.emit('data', vCard);
							console.log('this.emit : ' , vCard)
							vCard = [];
						} else if (vCard.length > 0 ) {
							console.log('vCard.push[vCard.length > 0]:' , barcode)
							vCard.push(barcode);
						} else 
						{
							this.emit('data', barcode);
							console.log('this.emit barcode : ' , barcode)
						}
					} else {
						this.emit('data', barcode);
						console.log('this.emit barcode LAST: ' , barcode)
					}
				}		
			}
		});

		if(isProcessing)
		{
			while (isProcessing) { 
				console.log("Processing barcode.." );
				await sleep(1000);
				isProcessing = false;
			}

			this.emit('data', barcode);
			console.log("Barcode: " , barcode );
			console.log("done");
			this.hid.close();
		}
			
	}

	stopScanning() {
		this.hid.removeAllListeners('data');
		this.hid.close();
	}

}

let sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  
function removeUTF8(barcode) {
	console.log('Enter removeUTF8 function ')
	let utf8 = barcode.slice(0, 7);
	if (utf8 === '\\000026') {
		console.log('Enter removeUTF8 function Barcode before slice: ' , barcode)
		barcode = barcode.slice(7);
		console.log('Enter removeUTF8 function Barcode after slice: ' , barcode)
		return barcode;
	} else 
	{
		console.log('Return barcode: ' , barcode)
		return barcode;
	}

}

module.exports = BarcodeScanner;
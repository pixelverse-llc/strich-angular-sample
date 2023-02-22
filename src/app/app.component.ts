import { Component, NgZone, OnInit } from '@angular/core';
import { BarcodeReader, CodeDetection, Configuration, SdkError, StrichSDK } from "@pixelverse/strichjs-sdk";
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  errorMessage?: string;
  busy = false;
  initialized = false;
  codeDetection?: CodeDetection;
  barcodeReader?: BarcodeReader;

  constructor(private ngZone: NgZone) {
  }

  ngOnInit() {
    this.busy = true;
    StrichSDK.initialize(environment.licenseKey).then(() => {
      console.log(`SDK initialized`);
      this.initialized = true;
    }).catch(err => {
      this.errorMessage = 'Failed to initialize Strich SDK (HINT: have you provided a license key?)';
    }).finally(() => {
      this.busy = false;
    })
  }

  removeCodeDetection(): void {
    this.codeDetection = undefined;
  }

  startScanning(): void {

    if (!this.barcodeReader) {

      // BarcodeReader configuration
      const configuration: Configuration = {
        selector: '.barcode-reader',
        engine: {
          symbologies: ['code128'],
          numScanlines: 10,
          minScanlinesNeeded: 3,
          invertedCodes: true,
          duplicateInterval: 750
        },
        frameSource: {
          resolution: 'full-hd' // full-hd is recommended for more challenging codes
        },
        overlay: {
          showCameraSelector: true,
          showFlashlight: true,
          showDetections: true
        },
        feedback: {
          audio: true,
          vibration: true
        }
      };

      // BarcodeReader initialization
      try {
        const barcodeReader = new BarcodeReader(configuration);
        barcodeReader.initialize()
          .then(result => {
            this.barcodeReader = result;

            // register detection hook, run it in the Angular zone so change detection works
            this.barcodeReader.detected = (detections) => {
              this.ngZone.run(() => {
                this.codeDetection = detections[0];
              });
            };

            // start reading codes
            this.barcodeReader.start().then(() => {
            }).catch(err => {
              this.errorMessage = `BarcodeReader failed to start: ${err}`;
            });
          })
          .catch(err => {
            this.errorMessage = `BarcodeReader failed to initialize: ${err}`;
          })
          .finally(() => {
            this.busy = false;
          });
      } catch (err) {
        if (err instanceof SdkError) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'An unknown error occurred';
        }
      }
    }
  }
}

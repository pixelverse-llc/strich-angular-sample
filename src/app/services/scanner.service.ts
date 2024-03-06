import { Injectable } from '@angular/core';
import { CodeDetection, Configuration, SdkError, StrichSDK } from "@pixelverse/strichjs-sdk";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  sdkInitialized = new BehaviorSubject<boolean>(false);
  sdkInitializationError?: SdkError;
  lastCodeDetection = new BehaviorSubject<CodeDetection | undefined>(undefined);

  constructor() {
    if (StrichSDK.isInitialized()) {
      // services should only be initialized once, but we handle this case anyway
      this.sdkInitialized.next(true);
    } else {
      const licenseKey = '<your license key>';
      StrichSDK.initialize(licenseKey).then(() => {
        console.log(`STRICH SDK initialized successfully`);
        this.sdkInitialized.next(true);
      }).catch(err => {
        console.error(`Failed to initialize Strich SDK (HINT: have you provided a license key?): ${err}`);
        this.sdkInitializationError = err;
      });
    }
  }

  get configuration(): Configuration {

    // a sample configuration for reading Code 128 barcodes
    const configuration: Configuration = {
      selector: '.barcode-reader',
      engine: {
        symbologies: ['code128'],
        duplicateInterval: 1500
      },
      locator: {
        regionOfInterest: {
          // use a narrow region of interest, appropriate for 1D barcodes and full-screen reader
          left: 0.05, right: 0.05, top: 0.4, bottom: 0.4
        }
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

    if (!environment.production) {
      // @ts-ignore
      configuration['debug'] = true;
    }

    return configuration;
  }

  onCodeDetected(codeDetection: CodeDetection) {
    this.lastCodeDetection.next(codeDetection);
  }
}

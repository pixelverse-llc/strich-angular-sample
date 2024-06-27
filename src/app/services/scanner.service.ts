import { ElementRef, Injectable, NgZone } from '@angular/core';
import { BarcodeReader, CodeDetection, Configuration, SdkError, StrichSDK } from "@pixelverse/strichjs-sdk";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  sdkInitialized = new BehaviorSubject<boolean>(false);
  sdkInitializationError?: SdkError;
  barcodeReader?: BarcodeReader;
  detected = new Subject<CodeDetection[]>();
  pendingInitialization = false;
  pendingDestroy = false;

  constructor(private ngZone: NgZone) {
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

  async newBarcodeReader(hostElement: ElementRef): Promise<BarcodeReader> {
    if (this.barcodeReader) {
      throw new Error(`A BarcodeReader already exists. Be sure to release it before switching routes.`);
    }

    try {
      this.pendingInitialization = true;
      this.barcodeReader = await new BarcodeReader(this.getConfiguration(hostElement)).initialize();
      this.barcodeReader.detected = (detections) => this.detected.next(detections);
      await this.barcodeReader.start();
      return this.barcodeReader;
    } finally {
      this.pendingInitialization = false;
    }
  }

  async releaseBarcodeReader(): Promise<void> {
    if (this.barcodeReader) {
      this.pendingDestroy = true;
      try {
        await this.barcodeReader.destroy();
        this.barcodeReader = undefined;
      } catch (err) {
        console.error(`Failed to destroy() BarcodeReader, ignoring`, err);
        // ignore exception in destroy()
      } finally {
        this.pendingDestroy = false;
      }
    }
  }

  async stopScanning(): Promise<void> {
    if (this.barcodeReader) {
      await this.barcodeReader.stop();
    }
  }

  async startScanning(): Promise<void> {
    if (this.barcodeReader) {
      await this.barcodeReader.start();
    }
  }

  private getConfiguration(hostElement: ElementRef): Configuration {

    // a sample configuration for reading Code 128 barcodes
    return {
      selector: hostElement.nativeElement,
      engine: {
        symbologies: ['code128'],
        duplicateInterval: 1500
      },
      locator: {
        regionOfInterest: {
          // use a narrow region of interest, appropriate for 1D barcodes and full-screen reader
          left: 0.05, right: 0.05, top: 0.4, bottom: 0.4
        }
      }
    };
  }
}

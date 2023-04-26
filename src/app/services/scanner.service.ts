import { Injectable } from '@angular/core';
import { CodeDetection, Configuration } from "@pixelverse/strichjs-sdk";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  lastCodeDetection = new BehaviorSubject<CodeDetection | undefined>(undefined);

  constructor() {
  }

  get configuration(): Configuration {

    // a sample configuration for reading Code 128 barcodes
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

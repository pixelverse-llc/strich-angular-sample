import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import { BarcodeReader, CodeDetection, Configuration, SdkError } from "@pixelverse/strichjs-sdk";
import { Router } from "@angular/router";

import { ScannerService } from "../../services/scanner.service";

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements AfterViewInit, OnDestroy {

  errorMessage?: string;
  barcodeReader?: BarcodeReader;
  codeDetection?: CodeDetection;

  constructor(private ngZone: NgZone,
              private router: Router,
              public scanner: ScannerService) {
  }

  ngAfterViewInit() {

    // BarcodeReader initialization in AfterViewInit (ensures that host element is present and layouted)
    try {
      const barcodeReader = new BarcodeReader(this.scanner.configuration);
      barcodeReader.initialize()
        .then(result => {
          this.barcodeReader = result;

          // register detection hook, run it in the Angular zone so change detection works
          this.barcodeReader.detected = (detections) => {
            this.ngZone.run(() => {
              this.codeDetection = detections[0];

              // also keep track of detections (to show "last code detected" in home)
              this.scanner.onCodeDetected(detections[0]);
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
        });
    } catch (err) {
      if (err instanceof SdkError) {
        this.errorMessage = err.message;
      } else {
        this.errorMessage = 'An unknown error occurred';
      }
    }
  }

  ngOnDestroy() {
    // release BarcodeReader, freeing up camera
    this.barcodeReader?.destroy();
  }

  dismissDetection() {
    this.codeDetection = undefined;
  }

  finishScanning() {
    return this.router.navigate(['/home']);
  }

  goToSingleScanning() {
    return this.router.navigate(['/scan-single']);
  }
}

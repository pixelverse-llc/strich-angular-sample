import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ScannerService } from "../../services/scanner.service";
import { BarcodeReader, SdkError } from "@pixelverse/strichjs-sdk";

@Component({
  selector: 'app-scan-single',
  templateUrl: './scan-single.component.html',
  styleUrls: ['./scan-single.component.scss']
})
export class ScanSingleComponent implements AfterViewInit, OnDestroy {

  errorMessage?: string;
  barcodeReader?: BarcodeReader;

  constructor(private router: Router,
              private ngZone: NgZone,
              private scanner: ScannerService) {
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
              this.scanner.onCodeDetected(detections[0]);

              // single scan was requested: go back to home
              this.done();
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

  done() {
    this.router.navigate(['/home']);
  }
}

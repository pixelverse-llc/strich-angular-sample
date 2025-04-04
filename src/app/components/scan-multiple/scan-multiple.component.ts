import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { StrichScannerComponent } from "../strich-scanner/strich-scanner.component";
import { ScannerService } from "../../services/scanner.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-scan-multiple',
    imports: [
        StrichScannerComponent
    ],
    templateUrl: './scan-multiple.component.html',
    styleUrl: './scan-multiple.component.scss'
})
export class ScanMultipleComponent implements OnInit, OnDestroy {

  scannedCodes: string[] = [ '<1st code>', '<2nd code>', '<3rd code>', '<4th code>' ]
  numScannedCodes = 0;
  detectedSubscription?: Subscription;

  constructor(private router: Router,
              private changeDetector: ChangeDetectorRef,
              private scanner: ScannerService) {
  }

  ngOnInit() {
    this.detectedSubscription = this.scanner.detected.subscribe((detections) => {
      if (this.numScannedCodes < 4 && this.scannedCodes.indexOf(detections[0].data) === -1) {
        this.scannedCodes[this.numScannedCodes] = detections[0].data;
        this.numScannedCodes++;
        this.changeDetector.detectChanges(); // change in array contents is not detected
      }
    });
  }

  ngOnDestroy() {
    this.detectedSubscription?.unsubscribe();
  }

  finishScanning() {
    this.router.navigate(['/home'], {skipLocationChange: true});
  }
}

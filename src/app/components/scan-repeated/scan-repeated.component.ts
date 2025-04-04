import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StrichScannerComponent } from "../strich-scanner/strich-scanner.component";
import { Router } from "@angular/router";
import { ScannerService } from "../../services/scanner.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-scan-repeated',
    imports: [
        StrichScannerComponent
    ],
    templateUrl: './scan-repeated.component.html',
    styleUrl: './scan-repeated.component.scss'
})
export class ScanRepeatedComponent implements OnInit, OnDestroy {

  codesScanned = 0;
  data = '';
  detectedSubscription?: Subscription;

  @ViewChild('confirmScanDialog')
  confirmScanDialog!: ElementRef<HTMLDialogElement>;

  constructor(private router: Router,
              private changedDetector: ChangeDetectorRef,
              private scanner: ScannerService) {
  }

  ngOnInit() {
    this.detectedSubscription = this.scanner.detected.subscribe((detections) => {
      this.data = detections[0].data;
      this.codesScanned++;
      this.scanner.stopScanning();
      this.changedDetector.detectChanges();
      this.confirmScanDialog.nativeElement.showModal();
    });
  }

  ngOnDestroy() {
    this.detectedSubscription?.unsubscribe();
  }

  continueScanning() {
    this.confirmScanDialog.nativeElement.close();
    this.scanner.startScanning();
  }

  finishScanning() {
    return this.router.navigate(['/home'], { skipLocationChange: true });
  }
}

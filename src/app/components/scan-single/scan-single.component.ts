import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

import { ScannerService } from "../../services/scanner.service";
import { StrichScannerComponent } from "../strich-scanner/strich-scanner.component";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-scan-single',
  standalone: true,
  imports: [CommonModule, StrichScannerComponent],
  templateUrl: './scan-single.component.html',
  styleUrls: ['./scan-single.component.scss']
})
export class ScanSingleComponent implements OnInit, OnDestroy {

  detectedSubscription?: Subscription;

  constructor(private router: Router,
              private scanner: ScannerService) {
  }

  ngOnInit() {
    this.detectedSubscription = this.scanner.detected.subscribe((detection) => {
      window.alert(`Scanned code: ${detection[0].data}`);
      this.router.navigate(['/home']);
    });
  }

  ngOnDestroy() {
    this.detectedSubscription?.unsubscribe();
  }

  finishScanning() {
    this.router.navigate(['/home'], { skipLocationChange: true });
  }
}

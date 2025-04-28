import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

import { ScannerService } from "../../services/scanner.service";
import { CodeDetection, PopupScanner } from '@pixelverse/strichjs-sdk';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  popupScannerResult?: CodeDetection;

  @ViewChild('popupScannerResultDialog')
  popupScanResultDialog!: ElementRef<HTMLDialogElement>;

  constructor(public scanner: ScannerService) {
  }

  async scanWithPopup() {
    const detectedCodes = await PopupScanner.scan({ symbologies: ['code128', 'qr']});
    if (detectedCodes) {
      this.popupScannerResult = detectedCodes[0];
      this.popupScanResultDialog.nativeElement.showModal();
    }
  }

  popupScanDone() {
    this.popupScanResultDialog.nativeElement.close();
  }
}

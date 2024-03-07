import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { ScannerService } from "../../services/scanner.service";

/**
 * A Component encapsulating a BarcodeReader.
 *
 * The component's host element is provided to STRICH SDK as the host element for the BarcodeReader.
 * The component's lifecycle is forwarded to the BarcodeReader's initialize()/destroy() methods.
 */
@Component({
  selector: 'app-strich-scanner',
  standalone: true,
  templateUrl: './strich-scanner.component.html',
  styleUrl: './strich-scanner.component.scss',
})
export class StrichScannerComponent implements AfterViewInit, OnDestroy {

  constructor(private scannerService: ScannerService,
              private hostElementRef: ElementRef) {
  }

  /**
   * Initialize the BarcodeScanner in ngAfterViewInit (*not* ngOnInit, as we need the host element to be present
   * and have a size)
   */
  ngAfterViewInit() {
    return this.scannerService.newBarcodeReader(this.hostElementRef);
  }

  /**
   * Release the BarcodeScanner when this Component goes out of scope (user leaves route containing this Component)
   */
  ngOnDestroy() {
    return this.scannerService.releaseBarcodeReader();
  }
}

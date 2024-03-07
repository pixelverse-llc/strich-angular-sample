import { ScannerService } from "../services/scanner.service";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

/**
 * A functional route guard that prevents navigation if a BarcodeReader is initializing or destroying.
 */
export const scannerNotBusy = () => {
  const scannerService = inject(ScannerService);
  if (scannerService.pendingInitialization) {
    console.debug(`Rejecting navigation, BarcodeReader is pending initialization`);
    return false;
  }
  if (scannerService.pendingDestroy) {
    console.debug(`Rejecting navigation, BarcodeReader is pending destruction`);
    return false;
  }
  return true;
};

export const sdkInitialized = () => {
  const scannerService = inject(ScannerService);
  if (scannerService.sdkInitialized.value) {
    return true;
  } else {
    console.debug(`Rejecting navigation to route that requires an initialized SDK: going home`);
    return inject(Router).createUrlTree(['/home']);
  }
}

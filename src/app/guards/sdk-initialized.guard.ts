import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { ScannerService } from "../services/scanner.service";

/**
 * Prevent entry to a page that requires the SDK to be initialized.
 */
@Injectable({
  providedIn: 'root',
})
export class SdkInitializedGuard implements CanActivate {

  constructor(private router: Router,
              private scanner: ScannerService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.scanner.sdkInitialized.value) {
      return true;
    } else {
      console.log(`Attempt to access a route that requires an initialized SDK: going home`);
      return this.router.createUrlTree(['/home']);
    }
  }
}

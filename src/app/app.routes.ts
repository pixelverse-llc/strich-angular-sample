import { Routes } from '@angular/router';

import { scannerNotBusy, sdkInitialized } from "./guards/strich-scanning-guards";

import { HomeComponent } from "./components/home/home.component";
import { ScanSingleComponent } from "./components/scan-single/scan-single.component";
import { ScanMultipleComponent } from "./components/scan-multiple/scan-multiple.component";
import { ScanRepeatedComponent } from "./components/scan-repeated/scan-repeated.component";

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'scan-single', component: ScanSingleComponent, canActivate: [sdkInitialized], canDeactivate: [scannerNotBusy]},
  {path: 'scan-repeated', component: ScanRepeatedComponent, canActivate: [sdkInitialized], canDeactivate: [scannerNotBusy]},
  {path: 'scan-multiple', component: ScanMultipleComponent, canActivate: [sdkInitialized], canDeactivate: [scannerNotBusy]},

  // redirect everything else to home
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'}
];

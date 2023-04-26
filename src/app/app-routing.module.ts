import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { ScanComponent } from "./components/scan/scan.component";
import { ScanSingleComponent } from "./components/scan-single/scan-single.component";
import { SdkInitializedGuard } from "./guards/sdk-initialized.guard";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'scan', component: ScanComponent, canActivate: [SdkInitializedGuard]},
  {path: 'scan-single', component: ScanSingleComponent, canActivate: [SdkInitializedGuard]},

  // redirect everything else to home
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

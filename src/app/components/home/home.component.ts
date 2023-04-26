import { Component, OnInit } from '@angular/core';
import { StrichSDK } from "@pixelverse/strichjs-sdk";
import { environment } from "../../../environments/environment";
import { ScannerService } from "../../services/scanner.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sdkInitialized = false;
  errorMessage?: string;

  constructor(public scanner: ScannerService) {

  }

  ngOnInit(): void {

    if (StrichSDK.isInitialized()) {
      this.sdkInitialized = true;
    } else {
      StrichSDK.initialize(environment.licenseKey).then(() => {
        this.sdkInitialized = true;
      }).catch(err => {
        this.errorMessage = `Failed to initialize Strich SDK (HINT: have you provided a license key?):<br>${err}`;
      });
    }
  }

}

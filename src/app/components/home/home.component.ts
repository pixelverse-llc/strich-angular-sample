import { Component } from '@angular/core';
import { ScannerService } from "../../services/scanner.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(public scanner: ScannerService) {
  }

}

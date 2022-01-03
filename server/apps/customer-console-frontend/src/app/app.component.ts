import { PrimeNGConfig } from 'primeng/api';
import { Component } from '@angular/core';

@Component({
  selector: 'botaiml-videoflo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'customer-console-frontend';

  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}

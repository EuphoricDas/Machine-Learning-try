import { AuthenticationService } from '../../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit {

  constructor(
    public authService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

}

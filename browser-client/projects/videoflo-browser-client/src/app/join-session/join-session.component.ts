import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideofloComponent } from '../videoflo-component/videoflo.component';

@Component({
  selector: 'videoflo-join-session',
  templateUrl: './join-session.component.html'
})
export class JoinSessionComponent implements OnInit {
  // @ViewChild(VideofloComponent) videoFlo: VideofloComponent;

  isSessionDataAvailable = false;

  apiUrl: string;
  token: string;
  sessionId: string;
  participantId: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async (params) => {
      const joinData = JSON.parse(atob(decodeURIComponent(params.joinData)));

      this.apiUrl = joinData.apiUrl;

      this.token = joinData.token;

      this.sessionId = joinData.sessionId;
      this.participantId = joinData.participantId;

      this.isSessionDataAvailable = true;
      // this.videoFlo.start();
    });
  }

  onLeaveSession(resultState: unknown): void {
    if (resultState) {
      console.log(
        'Workflow Finished with status ' + JSON.stringify(resultState)
      );
    }

    this.router.navigate(['']);
  }

  onError(err: unknown): void {
    alert('Error: ' + JSON.stringify(err));
    this.router.navigate(['']);
  }
}

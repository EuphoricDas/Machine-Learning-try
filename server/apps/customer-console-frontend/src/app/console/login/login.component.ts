import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [MessageService]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private authenticationService: AuthenticationService,
    private builder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(['/console']);
    }
  }

  @ViewChild('email') emailInput: ElementRef;

  private returnUrl: string;

  form: FormGroup;
  submitted = false;

  ngOnInit() {
    document.body.classList.add('gray-bg');

    this.form = this.builder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  ngAfterViewInit() {
    this.emailInput.nativeElement.focus();
  }

  ngOnDestroy() {
    document.body.classList.remove('gray-bg');
  }

  get f() {
    return this.form.controls;
  }

  isSubmitting = false;

  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const ctrls = this.form.controls;

    try {
      this.isSubmitting = true;
      await this.authenticationService.login(ctrls.email.value, ctrls.password.value);
      // redirect to returnUrl from route parameters or default to '/'
      this.router.navigate([this.returnUrl || '/console']);

    } catch (error) {
      let msg = 'An error has occurred!';

      if (error.error.message) {
        msg = error.error.message;
      }
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: msg
      });
    } 
    finally {
      this.isSubmitting = false;
    }
  }
}

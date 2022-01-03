import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../console/shared/services/authentication.service';
import { mustMatch } from '../utils/mustMatch.validator';
import { AccountService } from './../api/services/account.service';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html'
})
export class CustomerRegistrationComponent implements OnInit {

  registrationForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.registrationForm = this.builder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      mobileNo: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.min(8)])),
      confirmPassword: new FormControl('', Validators.compose([Validators.required, Validators.min(8)])),
      acceptTerms: new FormControl(null, [Validators.required]),
    }, {
      validators: [mustMatch('password', 'confirmPassword')]
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  acceptTermsChanged(evt) {
    if (!evt.checked) {
      this.registrationForm.controls.acceptTerms.setValue(null);
    }
  }

  isSubmitting = false;

  async onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    try {
      this.isSubmitting = true;
      const authenticatedUser = await this.accountService.registerNewAccount({
        body: this.registrationForm.value
      }).toPromise();

      this.authenticationService.setUserToken(authenticatedUser);

      this.router.navigate(['/console']);
    } catch (e) {
      let msg = 'An error has occurred!';

      if (typeof (e.error) === 'string') {
        msg = e.error;
      } else if (e.error.message) {
        msg = e.error.message;
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

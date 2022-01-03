import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CallConsent } from '../../../api/models';

@Component({
  selector: 'videoflo-call-consent',
  templateUrl: './call-consent.component.html',
  styleUrls: ['./call-consent.component.css']
})
export class CallConsentComponent implements OnInit {

  @Input() consentConfig: CallConsent;

  @Output() onConsentAcquired = new EventEmitter<boolean>();

  consentForm: FormGroup;

  constructor() {
    this.consentForm = new FormGroup({
      agree: new FormControl('', Validators.requiredTrue)
    })
  }

  get f() {
    return this.consentForm.controls;
  }

  ngOnInit(): void {
  }

  onConsentFormSubmit() {
    if (this.consentForm.invalid) {
      this.consentForm.markAllAsTouched();
      return;
    }

    this.onConsentAcquired.emit(true);
  }
}

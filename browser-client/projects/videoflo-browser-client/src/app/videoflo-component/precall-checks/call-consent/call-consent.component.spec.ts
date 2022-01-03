import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallConsentComponent } from './call-consent.component';

describe('CallConsentComponent', () => {
  let component: CallConsentComponent;
  let fixture: ComponentFixture<CallConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallConsentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecallChecksComponent } from './precall-checks.component';

describe('PrecallChecksComponent', () => {
  let component: PrecallChecksComponent;
  let fixture: ComponentFixture<PrecallChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrecallChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrecallChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

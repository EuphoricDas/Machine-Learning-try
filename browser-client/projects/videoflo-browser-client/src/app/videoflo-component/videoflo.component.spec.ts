import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideofloComponent } from './videoflo.component';

describe('VideofloComponent', () => {
  let component: VideofloComponent;
  let fixture: ComponentFixture<VideofloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideofloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideofloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

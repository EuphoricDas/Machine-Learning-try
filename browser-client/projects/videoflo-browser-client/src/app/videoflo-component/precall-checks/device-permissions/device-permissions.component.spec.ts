import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePermissionsComponent } from './device-permissions.component';

describe('DevicePermissionsComponent', () => {
  let component: DevicePermissionsComponent;
  let fixture: ComponentFixture<DevicePermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicePermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

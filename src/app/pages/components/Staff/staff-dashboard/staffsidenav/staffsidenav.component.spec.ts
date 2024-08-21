import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffsidenavComponent } from './staffsidenav.component';

describe('StaffsidenavComponent', () => {
  let component: StaffsidenavComponent;
  let fixture: ComponentFixture<StaffsidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffsidenavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffsidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

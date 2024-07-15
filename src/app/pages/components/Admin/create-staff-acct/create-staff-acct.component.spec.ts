import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStaffAcctComponent } from './create-staff-acct.component';

describe('CreateStaffAcctComponent', () => {
  let component: CreateStaffAcctComponent;
  let fixture: ComponentFixture<CreateStaffAcctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStaffAcctComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateStaffAcctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

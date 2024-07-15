import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLComponent } from './staff-l.component';

describe('StaffLComponent', () => {
  let component: StaffLComponent;
  let fixture: ComponentFixture<StaffLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffLComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

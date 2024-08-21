import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffaddComponent } from './staffadd.component';

describe('StaffaddComponent', () => {
  let component: StaffaddComponent;
  let fixture: ComponentFixture<StaffaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

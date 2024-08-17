import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffclientaccComponent } from './staffclientacc.component';

describe('StaffclientaccComponent', () => {
  let component: StaffclientaccComponent;
  let fixture: ComponentFixture<StaffclientaccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffclientaccComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffclientaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

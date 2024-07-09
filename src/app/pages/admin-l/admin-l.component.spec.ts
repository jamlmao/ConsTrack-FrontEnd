import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLComponent } from './admin-l.component';

describe('AdminLComponent', () => {
  let component: AdminLComponent;
  let fixture: ComponentFixture<AdminLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

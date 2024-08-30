import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StafftaskComponent } from './stafftask.component';

describe('StafftaskComponent', () => {
  let component: StafftaskComponent;
  let fixture: ComponentFixture<StafftaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StafftaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StafftaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlasteringComponent } from './plastering.component';

describe('PlasteringComponent', () => {
  let component: PlasteringComponent;
  let fixture: ComponentFixture<PlasteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlasteringComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlasteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

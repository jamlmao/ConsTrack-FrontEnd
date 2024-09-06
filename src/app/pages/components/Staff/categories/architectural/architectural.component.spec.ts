import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitecturalComponent } from './architectural.component';

describe('ArchitecturalComponent', () => {
  let component: ArchitecturalComponent;
  let fixture: ComponentFixture<ArchitecturalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchitecturalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchitecturalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

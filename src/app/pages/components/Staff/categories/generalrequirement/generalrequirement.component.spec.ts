import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralrequirementComponent } from './generalrequirement.component';

describe('GeneralrequirementComponent', () => {
  let component: GeneralrequirementComponent;
  let fixture: ComponentFixture<GeneralrequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralrequirementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeneralrequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

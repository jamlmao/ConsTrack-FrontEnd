import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcreteworksComponent } from './concreteworks.component';

describe('ConcreteworksComponent', () => {
  let component: ConcreteworksComponent;
  let fixture: ComponentFixture<ConcreteworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcreteworksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConcreteworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

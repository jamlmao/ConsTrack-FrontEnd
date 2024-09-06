import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinsmithryComponent } from './tinsmithry.component';

describe('TinsmithryComponent', () => {
  let component: TinsmithryComponent;
  let fixture: ComponentFixture<TinsmithryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TinsmithryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TinsmithryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

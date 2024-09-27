import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowaComponent } from './sowa.component';

describe('SowaComponent', () => {
  let component: SowaComponent;
  let fixture: ComponentFixture<SowaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SowaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SowaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiComponent } from './archi.component';

describe('ArchiComponent', () => {
  let component: ArchiComponent;
  let fixture: ComponentFixture<ArchiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeilingworksComponent } from './ceilingworks.component';

describe('CeilingworksComponent', () => {
  let component: CeilingworksComponent;
  let fixture: ComponentFixture<CeilingworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CeilingworksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CeilingworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

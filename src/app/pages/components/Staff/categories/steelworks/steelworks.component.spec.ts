import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteelworksComponent } from './steelworks.component';

describe('SteelworksComponent', () => {
  let component: SteelworksComponent;
  let fixture: ComponentFixture<SteelworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteelworksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteelworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalworksComponent } from './metalworks.component';

describe('MetalworksComponent', () => {
  let component: MetalworksComponent;
  let fixture: ComponentFixture<MetalworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetalworksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetalworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

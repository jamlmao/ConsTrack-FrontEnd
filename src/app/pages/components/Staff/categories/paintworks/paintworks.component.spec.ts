import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintworksComponent } from './paintworks.component';

describe('PaintworksComponent', () => {
  let component: PaintworksComponent;
  let fixture: ComponentFixture<PaintworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintworksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

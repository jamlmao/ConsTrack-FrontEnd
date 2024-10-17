import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidemodalComponent } from './guidemodal.component';

describe('GuidemodalComponent', () => {
  let component: GuidemodalComponent;
  let fixture: ComponentFixture<GuidemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidemodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuidemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

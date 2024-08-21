import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StafftoolbarComponent } from './stafftoolbar.component';

describe('StafftoolbarComponent', () => {
  let component: StafftoolbarComponent;
  let fixture: ComponentFixture<StafftoolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StafftoolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StafftoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

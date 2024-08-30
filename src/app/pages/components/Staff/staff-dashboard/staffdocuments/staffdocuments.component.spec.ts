import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffdocumentsComponent } from './staffdocuments.component';

describe('StaffdocumentsComponent', () => {
  let component: StaffdocumentsComponent;
  let fixture: ComponentFixture<StaffdocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffdocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffdocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

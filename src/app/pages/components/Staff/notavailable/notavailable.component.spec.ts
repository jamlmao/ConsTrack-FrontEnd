import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotavailableComponent } from './notavailable.component';

describe('NotavailableComponent', () => {
  let component: NotavailableComponent;
  let fixture: ComponentFixture<NotavailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotavailableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

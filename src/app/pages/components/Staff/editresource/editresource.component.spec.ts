import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditresourceComponent } from './editresource.component';

describe('EditresourceComponent', () => {
  let component: EditresourceComponent;
  let fixture: ComponentFixture<EditresourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditresourceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

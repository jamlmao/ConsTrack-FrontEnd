import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsubcategComponent } from './editsubcateg.component';

describe('EditsubcategComponent', () => {
  let component: EditsubcategComponent;
  let fixture: ComponentFixture<EditsubcategComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditsubcategComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditsubcategComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

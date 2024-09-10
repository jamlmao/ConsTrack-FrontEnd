import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcetableComponent } from './resourcetable.component';

describe('ResourcetableComponent', () => {
  let component: ResourcetableComponent;
  let fixture: ComponentFixture<ResourcetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcetableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourcetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientprojectComponent } from './clientproject.component';

describe('ClientprojectComponent', () => {
  let component: ClientprojectComponent;
  let fixture: ComponentFixture<ClientprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientprojectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

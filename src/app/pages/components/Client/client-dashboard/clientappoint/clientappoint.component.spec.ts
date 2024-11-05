import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientappointComponent } from './clientappoint.component';

describe('ClientappointComponent', () => {
  let component: ClientappointComponent;
  let fixture: ComponentFixture<ClientappointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientappointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientappointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

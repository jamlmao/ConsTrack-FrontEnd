import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientupdatesComponent } from './clientupdates.component';

describe('ClientupdatesComponent', () => {
  let component: ClientupdatesComponent;
  let fixture: ComponentFixture<ClientupdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientupdatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientupdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

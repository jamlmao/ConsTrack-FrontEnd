import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsidenavComponent } from './clientsidenav.component';

describe('ClientsidenavComponent', () => {
  let component: ClientsidenavComponent;
  let fixture: ComponentFixture<ClientsidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsidenavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientsidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

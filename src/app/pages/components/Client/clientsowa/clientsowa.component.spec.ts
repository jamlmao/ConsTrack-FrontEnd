import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsowaComponent } from './clientsowa.component';

describe('ClientsowaComponent', () => {
  let component: ClientsowaComponent;
  let fixture: ComponentFixture<ClientsowaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsowaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientsowaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

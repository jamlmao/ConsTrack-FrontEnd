import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLComponent } from './client-l.component';

describe('ClientLComponent', () => {
  let component: ClientLComponent;
  let fixture: ComponentFixture<ClientLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

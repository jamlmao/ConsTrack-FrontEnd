import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienthistoryComponent } from './clienthistory.component';

describe('ClienthistoryComponent', () => {
  let component: ClienthistoryComponent;
  let fixture: ComponentFixture<ClienthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienthistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

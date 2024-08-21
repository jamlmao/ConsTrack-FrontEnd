import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienttoolbarComponent } from './clienttoolbar.component';

describe('ClienttoolbarComponent', () => {
  let component: ClienttoolbarComponent;
  let fixture: ComponentFixture<ClienttoolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienttoolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienttoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

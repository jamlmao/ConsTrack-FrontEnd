import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientguideComponent } from './clientguide.component';

describe('ClientguideComponent', () => {
  let component: ClientguideComponent;
  let fixture: ComponentFixture<ClientguideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientguideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

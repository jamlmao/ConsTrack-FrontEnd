import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientAcctComponent } from './create-client-acct.component';

describe('CreateClientAcctComponent', () => {
  let component: CreateClientAcctComponent;
  let fixture: ComponentFixture<CreateClientAcctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClientAcctComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateClientAcctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

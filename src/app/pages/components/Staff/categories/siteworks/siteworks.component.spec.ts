import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteworksComponent } from './siteworks.component';

describe('SiteworksComponent', () => {
  let component: SiteworksComponent;
  let fixture: ComponentFixture<SiteworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteworksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteportfolioComponent } from './websiteportfolio.component';

describe('WebsiteportfolioComponent', () => {
  let component: WebsiteportfolioComponent;
  let fixture: ComponentFixture<WebsiteportfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteportfolioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebsiteportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

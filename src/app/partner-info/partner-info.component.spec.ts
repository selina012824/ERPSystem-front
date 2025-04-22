import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInfoComponent } from './partner-info.component';

describe('PartnerInfoComponent', () => {
  let component: PartnerInfoComponent;
  let fixture: ComponentFixture<PartnerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

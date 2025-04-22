import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationFilterComponent } from './quotation-filter.component';

describe('QuotationFilterComponent', () => {
  let component: QuotationFilterComponent;
  let fixture: ComponentFixture<QuotationFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotationFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

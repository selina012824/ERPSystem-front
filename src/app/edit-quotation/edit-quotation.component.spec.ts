import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuotationComponent } from './edit-quotation.component';

describe('EditQuotationComponent', () => {
  let component: EditQuotationComponent;
  let fixture: ComponentFixture<EditQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQuotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

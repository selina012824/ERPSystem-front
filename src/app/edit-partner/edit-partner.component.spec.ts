import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartnerComponent } from './edit-partner.component';

describe('EditPartyComponent', () => {
  let component: EditPartnerComponent;
  let fixture: ComponentFixture<EditPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPartnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReWorkOrderComponent } from './add-re-work-order.component';

describe('AddReWorkOrderComponent', () => {
  let component: AddReWorkOrderComponent;
  let fixture: ComponentFixture<AddReWorkOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReWorkOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

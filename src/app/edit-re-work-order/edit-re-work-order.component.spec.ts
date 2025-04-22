import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReWorkOrderComponent } from './edit-re-work-order.component';

describe('EditReWorkOrderComponent', () => {
  let component: EditReWorkOrderComponent;
  let fixture: ComponentFixture<EditReWorkOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReWorkOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

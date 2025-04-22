import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReWorkOrderComponent } from './re-work-order.component';

describe('ReWorkOrderComponent', () => {
  let component: ReWorkOrderComponent;
  let fixture: ComponentFixture<ReWorkOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReWorkOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

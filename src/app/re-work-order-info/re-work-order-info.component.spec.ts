import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReWorkOrderInfoComponent } from './re-work-order-info.component';

describe('ReWorkOrderInfoComponent', () => {
  let component: ReWorkOrderInfoComponent;
  let fixture: ComponentFixture<ReWorkOrderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReWorkOrderInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReWorkOrderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

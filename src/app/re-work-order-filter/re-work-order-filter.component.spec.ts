import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReWorkOrderFilterComponent } from './re-work-order-filter.component';

describe('ReWorkOrderFilterComponent', () => {
  let component: ReWorkOrderFilterComponent;
  let fixture: ComponentFixture<ReWorkOrderFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReWorkOrderFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReWorkOrderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

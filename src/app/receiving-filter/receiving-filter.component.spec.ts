import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingFilterComponent } from './receiving-filter.component';

describe('ReceivingFilterComponent', () => {
  let component: ReceivingFilterComponent;
  let fixture: ComponentFixture<ReceivingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivingFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

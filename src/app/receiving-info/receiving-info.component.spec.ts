import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingInfoComponent } from './receiving-info.component';

describe('ReceivingInfoComponent', () => {
  let component: ReceivingInfoComponent;
  let fixture: ComponentFixture<ReceivingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivingInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

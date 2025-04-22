import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoFilterComponent } from './po-filter.component';

describe('PoFilterComponent', () => {
  let component: PoFilterComponent;
  let fixture: ComponentFixture<PoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

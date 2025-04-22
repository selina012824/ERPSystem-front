import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformPageComponent } from './transform-page.component';

describe('TransformPageComponent', () => {
  let component: TransformPageComponent;
  let fixture: ComponentFixture<TransformPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

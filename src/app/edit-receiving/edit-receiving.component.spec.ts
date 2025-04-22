import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReceivingComponent } from './edit-receiving.component';

describe('EditReceivingComponent', () => {
  let component: EditReceivingComponent;
  let fixture: ComponentFixture<EditReceivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReceivingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

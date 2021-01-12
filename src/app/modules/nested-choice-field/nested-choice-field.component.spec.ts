import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedChoiceFieldComponent } from './nested-choice-field.component';

describe('NestedChoiceFieldComponent', () => {
  let component: NestedChoiceFieldComponent;
  let fixture: ComponentFixture<NestedChoiceFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedChoiceFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedChoiceFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

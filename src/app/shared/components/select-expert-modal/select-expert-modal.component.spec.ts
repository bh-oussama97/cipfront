import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectExpertModalComponent } from './select-expert-modal.component';

describe('SelectExpertModalComponent', () => {
  let component: SelectExpertModalComponent;
  let fixture: ComponentFixture<SelectExpertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectExpertModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectExpertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

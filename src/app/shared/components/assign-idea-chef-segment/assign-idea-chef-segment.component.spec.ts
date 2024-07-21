import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignIdeaChefSegmentComponent } from './assign-idea-chef-segment.component';

describe('AssignIdeaChefSegmentComponent', () => {
  let component: AssignIdeaChefSegmentComponent;
  let fixture: ComponentFixture<AssignIdeaChefSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignIdeaChefSegmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignIdeaChefSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

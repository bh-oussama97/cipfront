import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantsListComponent } from './plants-list.component';

describe('PlantsListComponent', () => {
  let component: PlantsListComponent;
  let fixture: ComponentFixture<PlantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

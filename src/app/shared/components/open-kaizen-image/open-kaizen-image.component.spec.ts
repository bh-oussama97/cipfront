import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenKaizenImageComponent } from './open-kaizen-image.component';

describe('OpenKaizenImageComponent', () => {
  let component: OpenKaizenImageComponent;
  let fixture: ComponentFixture<OpenKaizenImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenKaizenImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenKaizenImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

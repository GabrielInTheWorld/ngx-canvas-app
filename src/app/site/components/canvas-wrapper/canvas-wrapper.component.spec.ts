import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasWrapperComponent } from './canvas-wrapper.component';

describe('CanvasWrapperComponent', () => {
  let component: CanvasWrapperComponent;
  let fixture: ComponentFixture<CanvasWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

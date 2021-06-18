import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorCanvasComponent } from './cursor-canvas.component';

describe('CursorCanvasComponent', () => {
  let component: CursorCanvasComponent;
  let fixture: ComponentFixture<CursorCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursorCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursorCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

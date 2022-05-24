import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorPlaneComponent } from './cursor-plane.component';

describe('CursorPlaneComponent', () => {
  let component: CursorPlaneComponent;
  let fixture: ComponentFixture<CursorPlaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursorPlaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursorPlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPlaneComponent } from './preview-plane.component';

describe('PreviewPlaneComponent', () => {
  let component: PreviewPlaneComponent;
  let fixture: ComponentFixture<PreviewPlaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewPlaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorTileComponent } from './color-tile.component';

describe('ColorTileComponent', () => {
  let component: ColorTileComponent;
  let fixture: ComponentFixture<ColorTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

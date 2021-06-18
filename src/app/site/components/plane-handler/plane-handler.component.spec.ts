import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaneHandlerComponent } from './plane-handler.component';

describe('PlaneHandlerComponent', () => {
  let component: PlaneHandlerComponent;
  let fixture: ComponentFixture<PlaneHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaneHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaneHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

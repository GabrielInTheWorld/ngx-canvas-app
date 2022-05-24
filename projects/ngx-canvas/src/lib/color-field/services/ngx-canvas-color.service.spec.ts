import { TestBed } from '@angular/core/testing';

import { NgxCanvasColorService } from './ngx-canvas-color.service';

describe('NgxCanvasColorService', () => {
  let service: NgxCanvasColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCanvasColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

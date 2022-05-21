import { TestBed } from '@angular/core/testing';

import { NgxCanvasService } from './ngx-canvas.service';

describe('NgxCanvasService', () => {
  let service: NgxCanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

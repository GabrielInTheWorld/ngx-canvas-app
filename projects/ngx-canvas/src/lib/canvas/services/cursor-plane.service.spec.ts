import { TestBed } from '@angular/core/testing';

import { CursorPlaneService } from './cursor-plane.service';

describe('CursorPlaneService', () => {
  let service: CursorPlaneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CursorPlaneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

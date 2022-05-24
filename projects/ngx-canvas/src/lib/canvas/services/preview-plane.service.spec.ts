import { TestBed } from '@angular/core/testing';

import { PreviewPlaneService } from './preview-plane.service';

describe('PreviewPlaneService', () => {
  let service: PreviewPlaneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviewPlaneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

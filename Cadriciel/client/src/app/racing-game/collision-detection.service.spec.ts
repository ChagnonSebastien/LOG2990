import { TestBed, inject } from '@angular/core/testing';

import { CollisionDetectionService } from './collision-detection.service';

describe('CollisionDetectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollisionDetectionService]
    });
  });

  it('should be created', inject([CollisionDetectionService], (service: CollisionDetectionService) => {
    expect(service).toBeTruthy();
  }));
});

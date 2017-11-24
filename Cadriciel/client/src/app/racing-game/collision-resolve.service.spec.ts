import { TestBed, inject } from '@angular/core/testing';

import { CollisionResolveService } from './collision-resolve.service';

describe('CollisionResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollisionResolveService]
    });
  });

  it('should be created', inject([CollisionResolveService], (service: CollisionResolveService) => {
    expect(service).toBeTruthy();
  }));
});

import { TrackValidationService } from './track-validation.service';
import { AdminModule } from './../../admin/admin.module';
import { TestBed, inject } from '@angular/core/testing';

describe('TrackValidationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AdminModule
            ],
            providers: [TrackValidationService]
        });
    });

    it('should be created', inject([TrackValidationService], (service: TrackValidationService) => {
        expect(service).toBeTruthy();
    }));
});

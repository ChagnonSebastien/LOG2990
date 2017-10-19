import { TestBed, inject } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { TrackService } from './track.service';

describe('TrackService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [TrackService]
        });
    });

    it('should be created', inject([TrackService], (service: TrackService) => {
        expect(service).toBeTruthy();
    }));
});

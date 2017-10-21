import { TestBed, inject } from '@angular/core/testing';
import { RacingGameModule } from '../racing-game.module';
import { TrackService } from './track.service';

describe('TrackService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RacingGameModule
            ],
            providers: [TrackService]
        });
    });

    it('should be created', inject([TrackService], (service: TrackService) => {
        expect(service).toBeTruthy();
    }));
});

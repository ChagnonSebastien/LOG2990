import { TestBed, inject } from '@angular/core/testing';
import { GameInitializationModule } from './game-initialization.module';
import { TrackService } from './track.service';

describe('TrackService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                GameInitializationModule
            ],
            providers: [TrackService]
        });
    });

    it('should be created', inject([TrackService], (service: TrackService) => {
        expect(service).toBeTruthy();
    }));
});

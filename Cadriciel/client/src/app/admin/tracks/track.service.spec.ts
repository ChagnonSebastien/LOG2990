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

    // deleteTrack

    it('sshould delete a track with id 4', inject([TrackService], (service: TrackService) => {
        service.deleteTrack(4).subscribe(res => {
            expect(res.trackId).toMatch('4');
        });
    }));

    //changetracktype

    //changetrackdescription

    //changetrackname
});

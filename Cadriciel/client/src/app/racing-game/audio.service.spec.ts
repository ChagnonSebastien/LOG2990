import { RaceEventService } from './events/race-event.service';
import { AudioService } from './audio.service';
import { TestBed } from '@angular/core/testing';

let audioService: AudioService;

describe('test AudioService', function () {

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [ RaceEventService ]
        });
        audioService = new AudioService(TestBed.get(RaceEventService));
    });

    it('construction test', () => {
        expect(audioService).toBeDefined();
    });
});

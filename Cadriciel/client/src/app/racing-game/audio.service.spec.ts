import { RaceService } from './events/race.service';
import { AudioService } from './audio.service';
import { TestBed } from '@angular/core/testing';

let audioService: AudioService;

describe('test AudioService', function () {

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [ RaceService ]
        });
        audioService = new AudioService(TestBed.get(RaceService));
    });

    it('construction test', () => {
        expect(audioService).toBeDefined();
    });
});

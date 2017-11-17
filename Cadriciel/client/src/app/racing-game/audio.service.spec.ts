import { RaceService } from './race.service';
import { AudioService } from './audio.service';

describe('test AudioService', function () {
    const raceService = new RaceService();
    const audioService = new AudioService(raceService);

    it('construction test', () => {
        expect(audioService).toBeDefined();
    });
});

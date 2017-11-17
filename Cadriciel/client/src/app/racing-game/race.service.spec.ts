import { RaceService } from './race.service';

describe('test RaceService', function () {
    const raceService = new RaceService();

    it('construction test', () => {
        expect(raceService).toBeDefined();
    });
});

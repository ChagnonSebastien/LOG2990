import { CountdownDecreaseEventService } from './events/countdown-decrease-event';
import { CommandsService } from './events/commands.service';
import { RaceService } from './events/race.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { RacingSceneService } from './racing-scene.service';

describe('CountdownService', function () {
    const countdownService = new CountdownService(
        new AudioService(new RaceService()), new CommandsService(), new CountdownDecreaseEventService(),
        new RacingSceneService());

    it('construction test', () => {
        expect(countdownService).toBeDefined();
        expect(countdownService['count'] === 6);
    });

    it('starts countdown', () => {
        countdownService.startCountdown();
        expect(countdownService['count'] !== 6);
    });
});

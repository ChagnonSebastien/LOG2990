import { CountdownService } from './countdown.service';
import { Observable } from 'rxjs/Observable';

describe('test CountdownService', function () {
    const countdownService = new CountdownService();

    it('construction test', () => {
        expect(countdownService).toBeDefined();
    });

    it('starts countdown', () => {
        let countdown: Observable<number> = null;
        const count = 60;
        countdown = countdownService.startCountdown(countdown, count);
        expect(countdown !== null).toBeTruthy();
    });
});
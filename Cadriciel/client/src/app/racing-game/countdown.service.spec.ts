import { CountdownService } from './countdown.service';
import { Observable } from 'rxjs/Observable';

describe('test CountdownService', function () {
    const countdownService = new CountdownService();

    it('construction test', () => {
        expect(countdownService).toBeDefined();
        expect(countdownService['count'] === 6);
    });

    it('create 3D countdown', (done) => {
        countdownService.createCountdown().then(result => {
            expect(countdownService.countdownMesh).toBeDefined();
            done();
        });
    });

    it('starts countdown', () => {
        let countdown: Observable<number> = null;
        countdown = countdownService.startCountdown(countdown);
        expect(countdown !== null).toBeTruthy();
        expect(countdownService['count'] !== 6);
    });
});

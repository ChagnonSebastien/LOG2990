import { CountdownService } from './countdown.service';

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
        countdownService.startCountdown();
        expect(countdownService['timer']).toBeDefined();
        expect(countdownService['count'] !== 6);
    });
});

import { expect } from 'chai';

import { Countdown } from './countdown';

import { INITIAL_COUNTDOWN_VALUE } from '../config';

let countdown: Countdown;

describe('#Countdown', () => {
    beforeEach(() => {
        countdown = new Countdown();
    });

    it('should initialize the initialCountdownValue to the one set in the config', () => {
        expect(countdown.initialCountdownValue).to.equal(INITIAL_COUNTDOWN_VALUE);
    });

    it('should initialize the count to the INITIAL_COUNTDOWN_VALUE set in the config', () => {
        expect(countdown.count.value).to.equal(INITIAL_COUNTDOWN_VALUE);
    });

    describe('startCountdown()', () => {
        it('should start decrementing the count every second', (done) => {
            let initialCount = INITIAL_COUNTDOWN_VALUE;
            let numberOfEmitsCaptured = 0;
            countdown.count.subscribe((count) => {
                expect(count).to.equal(initialCount);
                initialCount--;
                if (numberOfEmitsCaptured > 0) {
                    expect(countdown.stopCountdown()).to.be.true;
                    done();
                }
                numberOfEmitsCaptured++;
            });
            expect(countdown.startCountdown()).to.be.true;
        });

        it('should not start another countdown if one already exists', () => {
            expect(countdown.startCountdown()).to.be.true;
            expect(countdown.startCountdown()).to.be.false;
        });
    });

    describe('stopCountdown()', () => {
        it('should stop decrementing the count if the countdown started', () => {
            expect(countdown.startCountdown()).to.be.true;
            expect(countdown.stopCountdown()).to.be.true;
        });

        it('should not stop the countdown if it has not started', () => {
            expect(countdown.stopCountdown()).to.be.false;
        });
    });

    describe('resetCountdown()', () => {
        it('should reset the countdown to the initialCountdownValue specified', () => {
            countdown.resetCountdown();
            expect(countdown.count.value).to.equal(countdown.initialCountdownValue);

            countdown.initialCountdownValue = 123456789;
            countdown.resetCountdown();
            expect(countdown.count.value).to.equal(countdown.initialCountdownValue);
        });
    });

    it('should reset the count when it reaches 0', (done) => {
        let numberOfEmitsCaptured = 0;
        countdown.count.next(0);
        countdown.count.subscribe((count) => {
            if (numberOfEmitsCaptured > 0) {
                expect(countdown.count.value)
                    .to.equal(countdown.initialCountdownValue);
                expect(countdown.stopCountdown()).to.be.true;
                done();
            }
            numberOfEmitsCaptured++;
        });
        countdown.startCountdown();
    });
});

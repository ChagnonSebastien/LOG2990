import { expect } from 'chai';
import { UpdateTrack } from './updatetrack';

// let arrayBeyondFive: number[] = [8, 12, 5, 7, 2, 4, 19, 15, 3];
// let arrayBelowFive: number[] = [13, 9];

describe('UpdateTrack', () => {
    describe('updateRating', () => {
        it('should calcul a new rating value, to find 4 ', () => {
            const newRating = UpdateTrack.updateRating(3, 4, 5) ;
            expect(newRating).to.equal(4.25);
        });

        it('should calcul a new rating value, to find 5 ', () => {
            const newRating = UpdateTrack.updateRating(0, -1, 5) ;
            expect(newRating).to.equal(5);
        });
    });
});

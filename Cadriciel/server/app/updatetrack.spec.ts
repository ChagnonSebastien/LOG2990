import { expect } from 'chai';
import { UpdateTrack } from './updatetrack';

const arrayBeyondFive: number[] = [12, 5, 7, 9, 4, 19, 15, 3];
const arrayBelowFive: number[] = [13, 9];

describe('UpdateTrack', () => {
    describe('updateRating', () => {
        it('should calcul a new rating value, to find 4.25 ', () => {
            const newRating = UpdateTrack.updateRating(3, 4, 5) ;
            expect(newRating).to.equal(4.25);
        });

        it('should calcul a new rating value, to find 5 ', () => {
            const newRating = UpdateTrack.updateRating(0, -1, 5);
            expect(newRating).to.equal(5);
        });
    });
    describe('updateBesTimes', () => {
        it('should insert 1 in  the array whose lengh is less than 5 ', () => {
            const newArray = UpdateTrack.updateBestTimes(arrayBelowFive, 1);
            expect(newArray.length).to.equal(3);
            expect(newArray[0]).to.equal(1);
            expect(newArray[1]).to.equal(9);
            expect(newArray[2]).to.equal(13);
        });

        it('should order the array elements and should not insert 12 in array', () => {
            const newArray = UpdateTrack.updateBestTimes(arrayBeyondFive, 12);
            expect(newArray.length).to.equal(5);
            expect(newArray[0]).to.equal(3);
            expect(newArray[1]).to.equal(4);
            expect(newArray[2]).to.equal(5);
            expect(newArray[3]).to.equal(7);
            expect(newArray[4]).to.equal(9);
        });
        it('should insert 2 to index 0 in the array whose lengh is 5', () => {
            const newArray = UpdateTrack.updateBestTimes(arrayBeyondFive, 2);
            expect(newArray.length).to.equal(5);
            expect(newArray[0]).to.equal(2);
            expect(newArray[4]).to.equal(7);
        });
        it('should insert 6 to index 4 in the array', () => {
            const newArray = UpdateTrack.updateBestTimes(arrayBeyondFive, 6);
            expect(newArray[3]).to.equal(6);
        });
    });
});

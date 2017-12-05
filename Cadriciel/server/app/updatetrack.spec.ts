import { expect } from 'chai';
import { UpdateTrack } from './updatetrack';

const arrayBeyondFive: { playerName: string, time: number }[] = [
    { playerName: 'Antoine', time: 12},
    { playerName: 'Bernard', time: 5},
    { playerName: 'Constant', time: 7},
    { playerName: 'Dan', time: 9},
    { playerName: 'Elise', time: 4},
    { playerName: 'Flore', time: 19},
    { playerName: 'Gregoire', time: 15},
    { playerName: 'Henri', time: 3}
    ];

const arrayBelowFive: { playerName: string, time: number }[] = [
    { playerName: 'ABC', time: 13},
    { playerName: 'DEF', time: 9}
    ];

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
        it('should insert  playerName: Sebast and time: 1  in  the array whose lengh is less than 5 ', () => {
            const newData = { playerName: 'Sebast', time: 1 };
            const newArray = UpdateTrack.updateBestTimes(arrayBelowFive, newData);

            expect(newArray.length).to.equal(3);
            expect(newArray[0].playerName).to.equal('Sebast');
            expect(newArray[0].time).to.equal(1);
            expect(newArray[1].time).to.equal( 9 );
            expect(newArray[2].playerName).to.equal('ABC');
        });

        it('should order the array elements and should not insert playerName: Josias, time: 12 in array', () => {
            const newData = { playerName: 'Josias', time: 12 };
            const newArray = UpdateTrack.updateBestTimes(arrayBeyondFive, newData);

            expect(newArray.length).to.equal(5);
            expect(newArray[0].playerName).to.equal('Henri');
            expect(newArray[1].time).to.equal( 4 );
            expect(newArray[2].playerName).to.equal('Bernard');
            expect(newArray[3].time).to.equal( 7 );
            expect(newArray[4].playerName).to.equal('Dan');
        });

        it('should insert playerName: Matthieu, time: 2 to index 0 in the array whose lengh is 5', () => {
            const newData = { playerName: 'Matthieu', time: 2 };
            const newArray = UpdateTrack.updateBestTimes(arrayBeyondFive, newData);

            expect(newArray.length).to.equal(5);
            expect(newArray[0].playerName).to.equal('Matthieu');
            expect(newArray[0].time).to.equal( 2 );
            expect(newArray[4].playerName).to.equal('Constant');
        });
        it('should insert playerName: Chaim, time: 6 to index 3 in the array', () => {
            const newData = { playerName: 'Chaim', time: 6 };
            const newArray = UpdateTrack.updateBestTimes(arrayBeyondFive, newData);

            expect(newArray.length).to.equal(5);
            expect(newArray[3].playerName).to.equal('Chaim');
            expect(newArray[3].time).to.equal(6);
        });
    });
});

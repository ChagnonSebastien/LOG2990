import { MAX_NUMBER_OF_TOP_TIMES } from './config';

export module UpdateTrack {

    export function updateRating(numberOfTimesPlayed: number, oldRating: number, newRating: number): number {
        return (numberOfTimesPlayed * oldRating + newRating) / (numberOfTimesPlayed + 1);
    }

    export function updateBestTimes(arrayBestTimes: number[], newtime: number): number[] {
        if (arrayBestTimes.length < MAX_NUMBER_OF_TOP_TIMES) {
            arrayBestTimes.push(newtime);
            arrayBestTimes.sort((a, b) => {
                return a - b;
            });
            return arrayBestTimes;

        } else {
            arrayBestTimes.sort((a, b) => {
                return a - b;
            });
            arrayBestTimes = arrayBestTimes.slice(0, MAX_NUMBER_OF_TOP_TIMES);
            if (newtime < arrayBestTimes[arrayBestTimes.length - 1]) {
                arrayBestTimes[arrayBestTimes.length - 1] = newtime;
            }
            arrayBestTimes.sort((a, b) => {
                return a - b;
            });
            return arrayBestTimes;
        }
    }
}

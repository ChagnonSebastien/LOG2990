import { MAX_NUMBER_OF_TOP_TIMES } from './config';

export module UpdateTrack {

    export function updateRating(numberOfTimesPlayed: number, oldRating: number, newRating: number): number {
        return (numberOfTimesPlayed * oldRating + newRating) / (numberOfTimesPlayed + 1);
    }

    export function updateBestTimes(arrayBestTimes: { playerName: string, time: number }[],
        newData: { playerName: string, time: number }): { playerName: string, time: number }[] {

        if (arrayBestTimes.length < MAX_NUMBER_OF_TOP_TIMES) {
            arrayBestTimes.push(newData);
            arrayBestTimes.sort((a, b) => {
                return a.time - b.time;
            });

        } else {
            arrayBestTimes.sort((a, b) => {
                return a.time - b.time;
            });
            arrayBestTimes = arrayBestTimes.slice(0, MAX_NUMBER_OF_TOP_TIMES);
            if (newData.time < arrayBestTimes[arrayBestTimes.length - 1].time) {
                arrayBestTimes[arrayBestTimes.length - 1] = newData;
            }
            arrayBestTimes.sort((a, b) => {
                return a.time - b.time;
            });
        }
        return arrayBestTimes;
    }
}

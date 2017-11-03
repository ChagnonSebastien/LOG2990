export module UpdateTrack {

    export function updateRating (numberOfTimesPlayed: number, oldRating: number, newRating: number): number {
        return (numberOfTimesPlayed * oldRating + newRating ) / (numberOfTimesPlayed + 1);
    }

   export function updateBestTimes (arrayBestTimes: number[], newtime: number ) {
        const fifthBestTimes = 5;
       if (arrayBestTimes.length !== fifthBestTimes ) {
           arrayBestTimes.push(newtime);
           return arrayBestTimes;
       } else {
            arrayBestTimes.sort((a, b) => {
                    return a - b;
            });
                arrayBestTimes = arrayBestTimes.slice(0, fifthBestTimes);
                for ( let time = 0; time < arrayBestTimes.length - 1; time++) {
                if (newtime < arrayBestTimes[time]) {
                    arrayBestTimes[time + 1] = arrayBestTimes[time];
                    arrayBestTimes[time] = newtime;
                    return arrayBestTimes;
                }
            }
        }
   }
}

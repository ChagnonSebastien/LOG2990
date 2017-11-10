export module UpdateTrack {

    export function updateRating (numberOfTimesPlayed: number, oldRating: number, newRating: number): number {
        return (numberOfTimesPlayed * oldRating + newRating ) / (numberOfTimesPlayed + 1);
    }

   export function updateBestTimes (arrayBestTimes: number[], newtime: number ): number[] {
        const fifthBestTimes = 5;

        if (arrayBestTimes.length < fifthBestTimes ) {
            arrayBestTimes.push(newtime);
            arrayBestTimes.sort((a, b) => {
                return a - b;
            });
           return arrayBestTimes;

       } else {
            arrayBestTimes.sort((a, b) => {
                    return a - b;
            });
            arrayBestTimes = arrayBestTimes.slice(0, fifthBestTimes);
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

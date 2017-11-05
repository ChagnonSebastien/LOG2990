export module UpdateTrack {

    export function updateRating (numberOfTimesPlayed: number, oldRating: number, newRating: number): number {
        return (numberOfTimesPlayed * oldRating + newRating ) / (numberOfTimesPlayed + 1);
    }

   export function updateBestTimes (arrayBestTimes: number[], newtime: number ): number[] {
        const fifthBestTimes = 5;
        let counterIndex = 0;
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
            console.log( 'sort de updateBestTimes', arrayBestTimes);
            arrayBestTimes = arrayBestTimes.slice(0, fifthBestTimes);
            if (newtime < arrayBestTimes[arrayBestTimes.length - 1]) {
                arrayBestTimes[arrayBestTimes.length - 1] = newtime;
            }
            for ( let index = 0; index < arrayBestTimes.length - 1; index++) {
                counterIndex++;
                if (newtime < arrayBestTimes[index]) {
                    for (let i = 1; i < arrayBestTimes.length - index; i++ ) {
                    arrayBestTimes[arrayBestTimes.length - i] = arrayBestTimes[arrayBestTimes.length - i - 1];
                    }
                arrayBestTimes[index] = newtime;
                return arrayBestTimes;
                } else if (counterIndex === 4) {
                    return arrayBestTimes;
                }
            }
        }
   }
}

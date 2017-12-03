export module UpdateTrack {

    export function updateRating (numberOfTimesPlayed: number, oldRating: number, newRating: number): number {
        return (numberOfTimesPlayed * oldRating + newRating ) / (numberOfTimesPlayed + 1);
    }

   export function updateBestTimes (arrayBestTimes: { playerName: string, time: number }[],
                                    newData: { playerName: string, time: number } ):
                                    { playerName: string, time: number }[] {
        const fifthBestTimes = 5;

        if (arrayBestTimes.length < fifthBestTimes ) {
            arrayBestTimes.push(newData);
            sort(arrayBestTimes);

       } else {
            sort(arrayBestTimes);
            arrayBestTimes = arrayBestTimes.slice(0, fifthBestTimes);
            if (newData.time < arrayBestTimes[arrayBestTimes.length - 1].time) {
                arrayBestTimes[arrayBestTimes.length - 1] = newData;
            }
            sort(arrayBestTimes);
        }
        return arrayBestTimes;
   }

    function sort(array: { playerName: string, time: number }[]) {
        let tempElement: { playerName: string, time: number };

        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - 1; j++) {
                if (array[j].time > array[j + 1].time) {
                    tempElement = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = tempElement;
                }
            }
        }
    }
}

import { Track } from './track';

describe('Track', () => {
    const track = new Track(1, 'a', 'b', 'c');

    it('should be created', function() {
        expect(track).toBeDefined();
    });

    it('should add intersections in track.TrackIntersections', () => {
        track.addIntersections([1, 6]);
        expect(track.trackIntersections[0].x).toEqual(1);
        expect(track.trackIntersections[0].y).toEqual(6);
    });

    it('should add puddles in track.puddles', () => {
        track.addPuddles([2, 3]);
        expect(track.puddles[0].distance).toEqual(2);
        expect(track.puddles[0].offset).toEqual(3);
    });

    it('should add potholes in track.potholes', () => {
        track.addPotholes([8, 4]);
        expect(track.potholes[0].distance).toEqual(8);
        expect(track.potholes[0].offset).toEqual(4);
    });

    it('should add boosters in track.boosters', () => {
        track.addBoosters([9, 1]);
        expect(track.boosters[0].distance).toEqual(9);
        expect(track.boosters[0].offset).toEqual(1);
    });
});

import { LineCalculationService } from './line-calculation.service';
import { Track } from './track';
import * as THREE from 'three';

describe('Track', () => {
    const track = new Track(
        'name',
        'desc',
        'diff',
        [new THREE.Vector2(0, 100), new THREE.Vector2(0, 0), new THREE.Vector2(100, 0)],
        [],
        [],
        [],
        -1,
        0,
        []
    );

    it('should be created', function () {
        expect(track).toBeDefined();
    });

    describe('distanceToPoint()', function () {
        it('should return the right distance if the point is aligned with it\'s closest segment', () => {
            expect(track.distanceToPoint(new THREE.Vector2(50, -50), new LineCalculationService())).toEqual(50);
        });

        it('should return the right distance if the point is not aligned with it\'s closest segment', () => {
            expect(track.distanceToPoint(new THREE.Vector2(-8, -6), new LineCalculationService())).toEqual(10);
        });
    });

    describe('centerOfFirstSegment()', function () {
        it('should return the the exact location between intersection 0 and 1', () => {
            const center = track.centerOfFirstSegment();
            expect(center.position.x).toEqual(0);
            expect(center.position.y).toEqual(50);
        });

        it('should return the the right orientation between intersection 0 and 1', () => {
            const center = track.centerOfFirstSegment();
            expect(center.rotation).toEqual(Math.PI / 2);
        });
    });
});

import { MathUtilities } from './math.utilities';
import * as THREE from 'three';

fdescribe('MathUtilities Module', () => {
    it('should return a positive modulo ', () => {
        const result = MathUtilities.negativeSafeModulo(-4, 5);
        expect(result).toEqual(1);
    });

    it('Returns the distance between two points ', () => {
        const result = MathUtilities.distanceBetweenTwoPoints(new THREE.Vector2(0, 0), new THREE.Vector2(0, 5));
        expect(result).toEqual(5);
    });

});

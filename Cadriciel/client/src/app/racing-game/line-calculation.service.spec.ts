import { TestBed } from '@angular/core/testing';
import { LineCalculationService } from './line-calculation.service';
import * as THREE from 'three';

let lineCalculationService: LineCalculationService;

describe('LineCalculationService', () => {
    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [LineCalculationService]
        });
        lineCalculationService = TestBed.get(LineCalculationService);
    });

    describe('getNearestPointOnLineWithoutClamping()', () => {
        it('should work if the line is vertical', () => {
                const point = new THREE.Vector2(3, 3);
                const line = { point1: new THREE.Vector2(1, 0), point2: new THREE.Vector2(1, 100) };
                const result = lineCalculationService.getNearestPointOnLineWithoutClamping(point, line);
                expect(result.x).toEqual(1);
                expect(result.y).toEqual(3);
        });

        it('should work if the line is angular', () => {
            const point = new THREE.Vector2(2, -2);
                const line = { point1: new THREE.Vector2(7, 7), point2: new THREE.Vector2(3, 3) };
                const result = lineCalculationService.getNearestPointOnLineWithoutClamping(point, line);
                expect(result.x).toEqual(0);
                expect(result.y).toEqual(0);
        });

        it('should work if the line is horizontal', () => {
            const point = new THREE.Vector2(3, 3);
                const line = { point1: new THREE.Vector2(0, 0), point2: new THREE.Vector2(3, 0) };
                const result = lineCalculationService.getNearestPointOnLineWithoutClamping(point, line);
                expect(result.x).toEqual(3);
                expect(result.y).toEqual(0);
        });
    });

    describe('getNearestPointOnLineWithClamping()', () => {
        it('should work if the line is vertical and the point is alinged with the line', () => {
                const point = new THREE.Vector2(3, 3);
                const line = { point1: new THREE.Vector2(1, 0), point2: new THREE.Vector2(1, 100) };
                const result = lineCalculationService.getNearestPointOnLineWithClamping(point, line);
                expect(result.x).toEqual(1);
                expect(result.y).toEqual(3);
        });

        it('should work if the line is angular and the point is alinged with the line', () => {
            const point = new THREE.Vector2(0, 7);
                const line = { point1: new THREE.Vector2(7, 7), point2: new THREE.Vector2(3, 3) };
                const result = lineCalculationService.getNearestPointOnLineWithClamping(point, line);
                expect(result.x).toEqual(3.5);
                expect(result.y).toEqual(3.5);
        });

        it('should work if the line is horizontal and the point is alinged with the line', () => {
            const point = new THREE.Vector2(3, 3);
                const line = { point1: new THREE.Vector2(0, 0), point2: new THREE.Vector2(4, 0) };
                const result = lineCalculationService.getNearestPointOnLineWithClamping(point, line);
                expect(result.x).toEqual(3);
                expect(result.y).toEqual(0);
        });

        it('should work if the line is vertical and the point is not alinged with the line', () => {
                const point = new THREE.Vector2(3, -3);
                const line = { point1: new THREE.Vector2(1, 0), point2: new THREE.Vector2(1, 100) };
                const result = lineCalculationService.getNearestPointOnLineWithClamping(point, line);
                expect(result.x).toEqual(1);
                expect(result.y).toEqual(0);
        });

        it('should work if the line is angular and the point is not alinged with the line', () => {
            const point = new THREE.Vector2(0, -66);
                const line = { point1: new THREE.Vector2(7, 7), point2: new THREE.Vector2(3, 3) };
                const result = lineCalculationService.getNearestPointOnLineWithClamping(point, line);
                expect(result.x).toEqual(3);
                expect(result.y).toEqual(3);
        });

        it('should work if the line is horizontal and the point is not alinged with the line', () => {
            const point = new THREE.Vector2(5, 3);
                const line = { point1: new THREE.Vector2(0, 0), point2: new THREE.Vector2(3, 0) };
                const result = lineCalculationService.getNearestPointOnLineWithClamping(point, line);
                expect(result.x).toEqual(3);
                expect(result.y).toEqual(0);
        });
    });

    describe('distance()', () => {
        it('should return the distance between two different points', () => {
                const point1 = new THREE.Vector2(-1, 1);
                const point2 = new THREE.Vector2(2, 5);
                expect(lineCalculationService.distance(point1, point2)).toEqual(5);
        });

        it('should return 0 when given two times the same point', () => {
                const point1 = new THREE.Vector2(1, 1);
                const point2 = new THREE.Vector2(1, 1);
                expect(lineCalculationService.distance(point1, point2)).toEqual(0);
        });
    });

    describe('getLineParameters()', () => {
        it('should work with a straight line in the x axis', () => {
                const line = { point1: new THREE.Vector2(-1, -5.2), point2: new THREE.Vector2(100, -5.2) };
                expect(lineCalculationService.getLineParameters(line).a).toEqual(0);
                expect(lineCalculationService.getLineParameters(line).c / lineCalculationService.getLineParameters(line).b).toEqual(5.2);
        });

        it('should work with a angular line', () => {
                const line = { point1: new THREE.Vector2(1, 0), point2: new THREE.Vector2(0, 1) };
                expect(lineCalculationService.getLineParameters(line).c / lineCalculationService.getLineParameters(line).b).toEqual(-1);
                expect(lineCalculationService.getLineParameters(line).c / lineCalculationService.getLineParameters(line).b).toEqual(-1);
        });

        it('should work with a straight line in the y axis', () => {
                const line = { point1: new THREE.Vector2(5, 0), point2: new THREE.Vector2(5, 900) };
                expect(lineCalculationService.getLineParameters(line).b).toEqual(0);
                expect(lineCalculationService.getLineParameters(line).c / lineCalculationService.getLineParameters(line).a).toEqual(-5);
        });
    });

    describe('twoLineIntersection()', () => {
        it('a line in a straight axis and the other in an angular axis', () => {
            const line1 = lineCalculationService.getLineParameters({point1: new THREE.Vector2(4, 4), point2: new THREE.Vector2(5, 4)});
            const line2 = lineCalculationService.getLineParameters({point1: new THREE.Vector2(1, 8), point2: new THREE.Vector2(0, 0)});
            const result = lineCalculationService.twoLineIntersection(line1, line2);
            expect(result.x).toEqual(0.5);
            expect(result.y).toEqual(4);
        });

        it('two lines in an angular axis', () => {
            const line1 = lineCalculationService.getLineParameters({point1: new THREE.Vector2(1, 8), point2: new THREE.Vector2(5, 4)});
            const line2 = lineCalculationService.getLineParameters({point1: new THREE.Vector2(1, 8), point2: new THREE.Vector2(0, 0)});
            const result = lineCalculationService.twoLineIntersection(line1, line2);
            expect(result.x).toEqual(1);
            expect(result.y).toEqual(8);
        });

        it('two lines in a straight axis', () => {
            const line1 = lineCalculationService.getLineParameters({point1: new THREE.Vector2(4, 4), point2: new THREE.Vector2(5, 4)});
            const line2 = lineCalculationService.getLineParameters({point1: new THREE.Vector2(1, 8), point2: new THREE.Vector2(1, 0)});
            const result = lineCalculationService.twoLineIntersection(line1, line2);
            expect(result.x).toEqual(1);
            expect(result.y).toEqual(4);
        });
    });

    describe('solveLineEquationWithY()', () => {
        it('should work for a angular line', () => {
            const y = -5;
            const lineParameters = { a: 1, b: -4, c: 1 };
            expect(lineCalculationService.solveLineEquationWithY(y, lineParameters)).toEqual(-21);
        });

        it('should work for a line in the x axis', () => {
            const y = 10;
            const lineParameters = { a: 0, b: -2, c: 1 };
            expect(lineCalculationService.solveLineEquationWithY(y, lineParameters)).toBeDefined();
        });

        it('should work for a line in the y axis', () => {
            const y = 5;
            const lineParameters = { a: 56, b: 0, c: 1 };
            expect(lineCalculationService.solveLineEquationWithY(y, lineParameters)).toEqual(-1 / 56);
        });
    });

    describe('solveLineEquationWithX()', () => {
        it('should work for a angular line', () => {
            const x = -5;
            const lineParameters = { a: 1, b: -4, c: 1 };
            expect(lineCalculationService.solveLineEquationWithX(x, lineParameters)).toEqual(-1);
        });

        it('should work for a line in the x axis', () => {
            const x = 10;
            const lineParameters = { a: 0, b: -2, c: 1 };
            expect(lineCalculationService.solveLineEquationWithX(x, lineParameters)).toEqual(1 / 2);
        });

        it('should work for a line in the y axis', () => {
            const x = 5;
            const lineParameters = { a: 56, b: 0, c: 1 };
            expect(lineCalculationService.solveLineEquationWithX(x, lineParameters)).toBeDefined();
        });
    });

});

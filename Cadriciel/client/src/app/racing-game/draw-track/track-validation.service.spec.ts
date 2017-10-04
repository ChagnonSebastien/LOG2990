import { Index } from './../../../../../server/app/routes/index';
import { TrackValidationService } from './track-validation.service';
import { AdminModule } from './../../admin/admin.module';
import { TestBed, inject } from '@angular/core/testing';

describe('TrackValidationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AdminModule
            ],
            providers: [TrackValidationService]
        });
    });

    it('should be created', inject([TrackValidationService], (service: TrackValidationService) => {
        expect(service).toBeTruthy();
    }));

    describe('The \'distance\' method', () => {
        it('should return the distance between two different points',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point1 = {x: -1, y: 1};
            const point2 = {x: 2, y: 5};
            expect(service.distance(point1, point2)).toEqual(5);
        }));

        it('should return 0 when given two times the same point',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point1 = {x: 1, y: 1};
            const point2 = {x: 1, y: 1};
            expect(service.distance(point1, point2)).toEqual(0);
        }));
    });

    describe('The \'getLineParameters\' method', () => {
        it('works with a straight line in the x axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line = {point1: {x: -1, y: -5.2}, point2: {x: 100, y: -5.2}};
            expect(service.getLineParameters(line).a).toEqual(0);
            expect(service.getLineParameters(line).c / service.getLineParameters(line).b).toEqual(5.2);
        }));

        it('works with a angular line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line = {point1: {x: 1, y: 0}, point2: {x: 0, y: 1}};
            expect(service.getLineParameters(line).c / service.getLineParameters(line).b).toEqual(-1);
            expect(service.getLineParameters(line).c / service.getLineParameters(line).b).toEqual(-1);
        }));

        it('works with a straight line in the y axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line = {point1: {x: 5, y: 0}, point2: {x: 5, y: 900}};
            expect(service.getLineParameters(line).b).toEqual(0);
            expect(service.getLineParameters(line).c / service.getLineParameters(line).a).toEqual(-5);
        }));
    });

    describe('The \'getAllEndToEndDistances\' method', () => {
        it('works',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = {point1: {x: -2, y: -4}, point2: {x: -2, y: 1}};
            const line2 = {point1: {x: 10, y: 1}, point2: {x: 10, y: 36}};
            expect(service.getAllEndToEndDistances(line1, line2)).toContain(13);
            expect(service.getAllEndToEndDistances(line1, line2)).toContain(37);
            expect(service.getAllEndToEndDistances(line1, line2)).toContain(12);
        }));
    });

    describe('The \'minimum\' method', () => {
        it('works',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const array = [45, 30, 10, 23, 30, 10];
            expect(service.minimum(array)).toEqual(10);
        }));
    });

    describe('The \'solveLineEquationWithY\' method', () => {
        it('works for a angular line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const y = -5;
            const lineParameters = {a: 1, b: -4, c: 1};
            expect(service.solveLineEquationWithY(y, lineParameters)).toEqual(-21);
        }));

        it('works for a line in the x axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const y = 10;
            const lineParameters = {a: 0, b: -2, c: 1};
            expect(service.solveLineEquationWithY(y, lineParameters)).toBeDefined();
        }));

        it('works for a line in the y axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const y = 5;
            const lineParameters = {a: 56, b: 0, c: 1};
            expect(service.solveLineEquationWithY(y, lineParameters)).toEqual(-1 / 56);
        }));
    });

    describe('The \'solveLineEquationWithX\' method', () => {
        it('works for a angular line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const x = -5;
            const lineParameters = {a: 1, b: -4, c: 1};
            expect(service.solveLineEquationWithX(x, lineParameters)).toEqual(-1);
        }));

        it('works for a line in the x axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const x = 10;
            const lineParameters = {a: 0, b: -2, c: 1};
            expect(service.solveLineEquationWithX(x, lineParameters)).toEqual(1 / 2);
        }));

        it('works for a line in the y axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const x = 5;
            const lineParameters = {a: 56, b: 0, c: 1};
            expect(service.solveLineEquationWithX(x, lineParameters)).toBeDefined();
        }));
    });

    describe('The \'findOptimalPoint\' method', () => {
        it('if the optimal point is on the second segment for a horizontal second line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const clampedPoint = {x: 3, y: 3};
            const line1 = {point1: {x: 0, y: 0}, point2: {x: 3, y: 3}};
            const optimalPoint = {x: 3, y: 7};
            const line2 = {point1: {x: -2, y: 7}, point2: {x: 3, y: 7}};
            expect(service.findOptimalPoint(clampedPoint, line1, optimalPoint, line2)).toEqual(4);
        }));

        it('if the optimal point is on the second segment for a vertical seccond line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const clampedPoint = {x: 3, y: 3};
            const line1 = {point1: {x: 0, y: 0}, point2: {x: 3, y: 3}};
            const optimalPoint = {x: 3, y: 3};
            const line2 = {point1: {x: 3, y: 1}, point2: {x: 3, y: 7}};
            expect(service.findOptimalPoint(clampedPoint, line1, optimalPoint, line2)).toEqual(0);
        }));

        it('if the optimal point is not on the second segment for a hozintal second line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const clampedPoint = {x: 3, y: 3};
            const line1 = {point1: {x: 0, y: 0}, point2: {x: 3, y: 3}};
            const optimalPoint = {x: 3, y: 7};
            const line2 = {point1: {x: -2, y: 7}, point2: {x: 0, y: 7}};
            expect(service.findOptimalPoint(clampedPoint, line1, optimalPoint, line2)).toEqual(5);
        }));

        it('if the optimal point is not on the second segment for a vertical second line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const clampedPoint = {x: 3, y: 3};
            const line1 = {point1: {x: 0, y: 0}, point2: {x: 3, y: 3}};
            const optimalPoint = {x: 3, y: 3};
            const line2 = {point1: {x: 3, y: 4}, point2: {x: 3, y: 7}};
            expect(service.findOptimalPoint(clampedPoint, line1, optimalPoint, line2)).toEqual(1);
        }));
    });

    describe('The \'getNearestPointOnLine\' method', () => {
        it('if the line is vertical',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point = {x: 3, y: 3};
            const line = {point1: {x: 1, y: 0}, point2: {x: 1, y: 100}};
            expect(service.getNearestPointOnLine(point, line)).toEqual({x: 1, y: 3});
        }));

        it('if the line is angular',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point = {x: 2, y: -2};
            const line = {point1: {x: 7, y: 7}, point2: {x: 3, y: 3}};
            expect(service.getNearestPointOnLine(point, line)).toEqual({x: -0, y: 0});
        }));

        it('if the line is horizontal',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point = {x: 3, y: 3};
            const line = {point1: {x: 0, y: 0}, point2: {x: 3, y: 0}};
            expect(service.getNearestPointOnLine(point, line)).toEqual({x: 3, y: -0});
        }));
    });

    describe('The \'clampAndGetOptimalPoint\' method', () => {
        it('if the optimal point is on the second segment for a horizontal second line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const clampedPoint = {x: 3, y: 3};
            const line1 = {point1: {x: 0, y: 0}, point2: {x: 3, y: 3}};
            const line2 = {point1: {x: -2, y: 7}, point2: {x: 3, y: 7}};
            expect(service.clampAndGetOptimalPoint(clampedPoint, line1, line2)).toEqual(4);
        }));

        it('if the optimal point is on the second segment for a vertical seccond line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const clampedPoint = {x: 3, y: 3};
            const line1 = {point1: {x: 0, y: 0}, point2: {x: 3, y: 3}};
            const line2 = {point1: {x: 3, y: 1}, point2: {x: 3, y: 7}};
            expect(service.clampAndGetOptimalPoint(clampedPoint, line1, line2)).toEqual(0);
        }));

        it('if the optimal point is not on the second segment for a hozintal second line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const clampedPoint = {x: 3, y: 3};
            const line1 = {point1: {x: 0, y: 0}, point2: {x: 3, y: 3}};
            const line2 = {point1: {x: -2, y: 7}, point2: {x: 0, y: 7}};
            expect(service.clampAndGetOptimalPoint(clampedPoint, line1, line2)).toEqual(5);
        }));

        it('if the optimal point is not on the second segment for a vertical second line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const clampedPoint = {x: 3, y: 3};
            const line1 = {point1: {x: 0, y: 0}, point2: {x: 3, y: 3}};
            const line2 = {point1: {x: 3, y: 4}, point2: {x: 3, y: 7}};
            expect(service.clampAndGetOptimalPoint(clampedPoint, line1, line2)).toEqual(1);
        }));
    });

    describe('The \'checkForClamp\' method', () => {
        it('if the intersection is on both segments',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = {point1: {x: 1000, y: 474}, point2: {x: -2344, y: 63}};
            const line2 = {point1: {x: 1000, y: 0}, point2: {x: -2344, y: 1324}};
            expect(service.checkForClamp(service.twoLineIntersection(line1, line2), line1, line2).length).toEqual(0);
        }));

        it('if the intersection is only on the second segment and the perpendicular of the second line on the clamped point touches it',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = {point1: {x: 0, y: 0}, point2: {x: -1, y: -1}};
            const line2 = {point1: {x: 0, y: 10}, point2: {x: 10, y: 0}};
            const lineParameters1 = service.getLineParameters(line1);
            const lineParameters2 = service.getLineParameters(line2);
            expect(service.checkForClamp(service.twoLineIntersection(lineParameters1, lineParameters2), line1, line2).length).toEqual(1);
            expect(service.checkForClamp(service.twoLineIntersection(lineParameters1, lineParameters2), line1, line2)[0]).
                toEqual(Math.sqrt(200) / 2);
        }));

        it('if the intersection is only on the second segment and' +
            'the perpendicular of the second line on the clamped point doesn\'t touches it',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = {point1: {x: 0, y: 0}, point2: {x: -1, y: -1}};
            const line2 = {point1: {x: 6, y: 8}, point2: {x: 20, y: 8}};
            const lineParameters1 = service.getLineParameters(line1);
            const lineParameters2 = service.getLineParameters(line2);
            expect(service.checkForClamp(service.twoLineIntersection(lineParameters1, lineParameters2), line1, line2).length).toEqual(1);
            expect(service.checkForClamp(service.twoLineIntersection(lineParameters1, lineParameters2), line1, line2).indexOf(10)).
                toBeGreaterThan(-1);
        }));
    });

    describe('The \'distanceToLine\' method', () => {
        it('for a line in the x axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point = {x: 0, y: 0};
            const line = {point1: {x: 6, y: 8}, point2: {x: 20, y: 8}};
            expect(service.distanceToLine(point, line)).toEqual(8);
        }));

        it('for a line in the y axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point = {x: 2, y: 12370};
            const line = {point1: {x: -1, y: 4}, point2: {x: -1, y: 8}};
            expect(service.distanceToLine(point, line)).toEqual(3);
        }));

        it('for an angular line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point = {x: 10, y: 5};
            const line = {point1: {x: 6, y: 8}, point2: {x: 9, y: 12}};
            expect(service.distanceToLine(point, line)).toEqual(5);
        }));
    });

    describe('The \'twoLineIntersection\' method', () => {
        it('a line in a straight axis and the other in an angular axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = service.getLineParameters({point1: {x: 4, y: 4}, point2: {x: 5, y: 4}});
            const line2 = service.getLineParameters({point1: {x: 1, y: 8}, point2: {x: 0, y: 0}});
            expect(service.twoLineIntersection(line1, line2)).toEqual({x: 0.5, y: 4});
        }));

        it('two lines in an angular axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = service.getLineParameters({point1: {x: 1, y: 8}, point2: {x: 5, y: 4}});
            const line2 = service.getLineParameters({point1: {x: 1, y: 8}, point2: {x: 0, y: 0}});
            expect(service.twoLineIntersection(line1, line2)).toEqual({x: 1, y: 8});
        }));

        it('two lines in a straight axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = service.getLineParameters({point1: {x: 4, y: 4}, point2: {x: 5, y: 4}});
            const line2 = service.getLineParameters({point1: {x: 1, y: 8}, point2: {x: 1, y: 0}});
            expect(service.twoLineIntersection(line1, line2)).toEqual({x: 1, y: 4});
        }));
    });

    describe('The \'getAngle\' method', () => {
        it('works for Angle 0',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = {point1: {x: 4, y: 4}, point2: {x: 5, y: 4}};
            expect(service.getAngle(line1)).toEqual(0);
        }));

        it('works for Angle PI',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = {point1: {x: 4, y: 4}, point2: {x: -3, y: 4}};
            expect(service.getAngle(line1)).toEqual(Math.PI);
        }));

        it('works for Angle PI/6',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = {point1: {x: 0, y: 0}, point2: {x: Math.sqrt(3) / 2, y: 1 / 2}};
            expect(service.getAngle(line1)).toBeCloseTo(Math.PI / 6);
        }));

        it('works for Angle 5PI/3',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = {point1: {x: 0, y: 0}, point2: {x: 1 / 2, y: -Math.sqrt(3) / 2}};
            expect(service.getAngle(line1)).toEqual(-Math.PI / 3);
        }));

        it('works for Angle 3PI/4',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line1 = {point1: {x: 0, y: 0}, point2: {x: -Math.sqrt(2) / 2, y: Math.sqrt(2) / 2}};
            expect(service.getAngle(line1)).toEqual(3 * Math.PI / 4);
        }));
    });
});

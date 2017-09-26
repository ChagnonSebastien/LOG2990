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

    describe('The \'line\' method', () => {
        it('works with a straight line in the x axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line = {point1: {x: -1, y: 1}, point2: {x: 100, y: 1}};
            expect(service.getLineParameters(line).a).toEqual(0);
            expect(service.getLineParameters(line).b).toEqual(1);
        }));

        it('works with a angular line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line = {point1: {x: -100, y: 0}, point2: {x: 100, y: 900}};
            expect(service.getLineParameters(line).a).toEqual(4.5);
            expect(service.getLineParameters(line).b).toEqual(450);
        }));

        it('works with a straight line in the y axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const line = {point1: {x: 5, y: 0}, point2: {x: 5, y: 900}};
            expect(service.getLineParameters(line).a).toEqual(Infinity);
            expect(service.getLineParameters(line).b).toEqual(-Infinity);
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

    describe('The \'solveLineEquation\' method', () => {
        it('works for a angular line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const x = 5;
            const lineParameters = {a: 1, b: -4};
            expect(service.solveLineEquation(x, lineParameters)).toEqual(1);
        }));

        it('works for a line in the y axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const x = 10;
            const lineParameters = {a: 0, b: -4};
            expect(service.solveLineEquation(x, lineParameters)).toEqual(-4);
        }));

        it('works for a line in the x axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const x = 5;
            const lineParameters = {a: Infinity, b: -Infinity};
            expect(service.solveLineEquation(x, lineParameters)).toEqual(NaN);
        }));
    });

    describe('The \'solveYIntercept\' method', () => {
        it('works for a angular line',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point = {x: 5, y: 2};
            const slope = 2;
            expect(service.solveYIntercept(point, slope)).toEqual(-8);
        }));

        it('works for a line in the y axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point = {x: 5, y: 2};
            const slope = 0;
            expect(service.solveYIntercept(point, slope)).toEqual(2);
        }));

        it('works for a line in the x axis',
        inject([TrackValidationService], (service: TrackValidationService) => {
            const point = {x: 5, y: 2};
            const slope = Infinity;
            expect(service.solveYIntercept(point, slope)).toEqual(-Infinity);
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
});

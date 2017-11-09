import { DiamondSquareAlgorithmService } from './diamond-square-algorithm.service';
import { TestBed } from '@angular/core/testing';

let diamondSquareAlgorithm: DiamondSquareAlgorithmService;

describe('DiamondSquareAlgorithmService', () => {
    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [DiamondSquareAlgorithmService]
        });
        diamondSquareAlgorithm = TestBed.get(DiamondSquareAlgorithmService);
    });

    it('should be created', () => {
        expect(diamondSquareAlgorithm).toBeTruthy();
    });

    describe('generate()', () => {
        let heightTable: number[][];

        beforeAll(() => {
            heightTable = diamondSquareAlgorithm.generate(9);
        });

        it ('should be the right size', function() {
            expect(heightTable.length).toEqual(513);
            for (let i = 0; i < heightTable.length; i++) {
                expect(heightTable[i].length).toEqual(513);
            }
        });

        it ('should be filled', function() {
            for (let i = 0; i < heightTable.length; i++) {
                for (let j = 0; j < heightTable[i].length; j++) {
                    expect(heightTable[i][j]).toBeDefined();
                }
            }
        });

        it ('should not have a slope more than 2 more than 0.1%', function() {
            let total = 0;
            let mistakes = 0;
            for (let i = 0; i < heightTable.length - 1; i++) {
                for (let j = 0; j < heightTable[i].length; j++) {
                    if (Math.abs(heightTable[i][j] - heightTable[i + 1][j]) > 4) {
                        mistakes++;
                    }
                    total++;
                }
            }
            expect(mistakes / total).toBeLessThanOrEqual(0.001);
        });
    });

});


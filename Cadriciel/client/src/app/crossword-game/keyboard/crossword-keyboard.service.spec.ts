import { TestBed } from '@angular/core/testing';

import { CrosswordKeyboardService } from './crossword-keyboard.service';

let keyboardService: CrosswordKeyboardService;

describe('#CrosswordKeyboardService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordKeyboardService]
        });
        keyboardService = TestBed.get(CrosswordKeyboardService);
    });

    it('should construct', () => {
        expect(keyboardService).toBeDefined();
    });

    describe('handleInput()', () => {
        describe('letterInputAlerts()', () => {
            it('should alert letterInputAlerts() subscribers when a letter is inputed', (done) => {
                keyboardService.letterInputAlerts()
                    .subscribe((letterInput) => {
                        expect(letterInput.letter).toEqual('a');
                        expect(letterInput.i).toEqual(0);
                        expect(letterInput.j).toEqual(0);
                        done();
                    });

                const charCodeOfA = 'A'.charCodeAt(0);
                keyboardService.handleInput(charCodeOfA, 0, 0);
            });
        });

        describe('backspaceAlerts()', () => {
            it('should alert backspaceAlerts() subscribers when a backspace is inputed', (done) => {
                keyboardService.backspaceAlerts().subscribe((coordinates) => {
                    expect(coordinates.i).toEqual(0);
                    expect(coordinates.j).toEqual(0);
                    done();
                });
                const charCodeOfBackspace = 8;
                keyboardService.handleInput(charCodeOfBackspace, 0, 0);
            });
        });

        describe('arrowAlerts()', () => {
            it('should alert arrowAlerts() subscribers when an arrow key is inputed', (done) => {
                keyboardService.arrowAlerts().subscribe((arrowInput) => {
                    expect(arrowInput.charCode).toEqual(37);
                    expect(arrowInput.i).toEqual(0);
                    expect(arrowInput.j).toEqual(0);
                    done();
                });
                const charCodeOfLeftArrow = 37;
                keyboardService.handleInput(charCodeOfLeftArrow, 0, 0);
            });
        });

        it('should return true when the input is a letter', () => {
            const keyCodeofA = 'A'.charCodeAt(0);
            expect(keyboardService.handleInput(keyCodeofA, 0, 0)).toBeTruthy();

            const keyCodeofZ = 'Z'.charCodeAt(0);
            expect(keyboardService.handleInput(keyCodeofZ, 0, 0)).toBeTruthy();
        });

        it('should return true when the input is a backspace', () => {
            const keyCodeofBackspace = 8;
            expect(keyboardService.handleInput(keyCodeofBackspace, 0, 0)).toBeTruthy();
        });

        it('should return true when the input is an arrow', () => {
            // 37 to 40 are arrow keys
            for (let i = 37; i < 41; i++) {
                expect(keyboardService.handleInput(i, 0, 0)).toBeTruthy();
            }
        });

        it('should return false when the input is not a letter, backspace or arrow', () => {
            expect(keyboardService.handleInput(0, 0, 0)).toBeFalsy();
            expect(keyboardService.handleInput(64, 0, 0)).toBeFalsy();
            expect(keyboardService.handleInput(91, 0, 0)).toBeFalsy();
        });
    });

    describe('isLeftArrow()', () => {
        it('should return true when the keyCode is 37', () => {
            expect(keyboardService.isLeftArrow(37)).toBeTruthy();
        });

        it('should return false when the keyCode is not 37', () => {
            expect(keyboardService.isLeftArrow(38)).toBeFalsy();
        });
    });

    describe('isUpArrow()', () => {
        it('should return true when the keyCode is 38', () => {
            expect(keyboardService.isUpArrow(38)).toBeTruthy();
        });

        it('should return false when the keyCode is not 38', () => {
            expect(keyboardService.isUpArrow(37)).toBeFalsy();
        });
    });
});

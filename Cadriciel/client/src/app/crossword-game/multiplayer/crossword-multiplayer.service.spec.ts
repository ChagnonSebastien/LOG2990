import { TestBed } from '@angular/core/testing';

import { CrosswordMultiplayerService } from './crossword-multiplayer.service';
import { CrosswordSocketService } from '../socket/crossword-socket.service';
import { CrosswordPlayerService } from '../player/crossword-player.service';

import { MultiplayerCrosswordGame } from '../../../../../commun/crossword/multiplayer-crossword-game';
import { Crossword } from '../../../../../commun/crossword/crossword';
import { Word } from '../../../../../commun/word';

let multiplayerService: CrosswordMultiplayerService;

describe('#CrosswordMultiplayerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordMultiplayerService,
                CrosswordSocketService,
                CrosswordPlayerService
            ]
        });
        multiplayerService = TestBed.get(CrosswordMultiplayerService);
    });

    it('should construct', () => {
        expect(multiplayerService).toBeDefined();
    });

    describe('createGame()', () => {
        it('should create a new multiplayer game if you are not already a host of another one', () => {
            multiplayerService['socketService'].socket.disconnect();
            expect(multiplayerService.createGame('easy', 'classic')).toBeTruthy();
        });

        it('should not create a new multiplayer game if you are already a host', () => {
            multiplayerService['socketService'].socket.disconnect();
            expect(multiplayerService.createGame('easy', 'classic')).toBeTruthy();
            expect(multiplayerService.createGame('easy', 'classic')).toBeFalsy();
        });
    });

    describe('gameStartAlerts()', () => {
        it('should provide an observable that alerts when a multiplayer game starts', (done) => {
            multiplayerService.gameStartAlerts()
                .subscribe((game: MultiplayerCrosswordGame) => {
                    expect(game).toBeDefined();
                    expect(game.id).toEqual('0');
                    expect(game.difficulty).toEqual('easy');
                    expect(game.mode).toEqual('classic');
                    expect(game.hostUsername).toEqual('fakeHost');
                    done();
                });
            multiplayerService['gameStartSubject']
                .next(new MultiplayerCrosswordGame(
                    '0', 'easy', 'classic', 'fakeHost', new Crossword()
                ));
        });
    });

    describe('opponentHintSelectionAlerts()', () => {
        it('should provide an observable that alerts when the opponent selects a hint', (done) => {
            multiplayerService.opponentHintSelectionAlerts()
                .subscribe((hintSelection: { 'previous': string, 'current': Word }) => {
                    expect(hintSelection.previous).toBeUndefined();
                    expect(hintSelection.current.word).toEqual('fakeselection');
                    done();
                });
            multiplayerService['opponentHintSelection'].next({
                'previous': undefined,
                'current': new Word(0, 0, 'fakeselection', true)
            });
        });
    });

    describe('opponentFoundWordAlerts()', () => {
        it('should provide an observable that alerts when the opponent finds a word', (done) => {
            multiplayerService.opponentFoundWordAlerts()
                .subscribe((foundWord: Word) => {
                    expect(foundWord.word).toEqual('fakefoundword');
                    done();
                });
            multiplayerService['opponentFoundWord'].next(new Word(
                0, 0, 'fakefoundword', true
            ));
        });
    });

    describe('opponentDeselectedAllAlerts()', () => {
        it('should provide an observable that alerts when the opponent cancels hint selection', (done) => {
            multiplayerService.opponentDeselectedAllAlerts()
                .subscribe((unselect) => {
                    expect(unselect).toBeTruthy();
                    done();
                });
            multiplayerService['opponentDeselection'].next(true);
        });
    });

    describe('emitSelectedHint', () => {
        it('should emit the selected hint to the opponent', () => {
            if (!multiplayerService['socketService'].socket.connected) {
                expect(multiplayerService.emitSelectHint({
                    'previous': undefined,
                    'current': new Word(0, 0, 'fakeselection', true)
                })).toBeFalsy();
            } else {
                expect(multiplayerService.emitSelectHint({
                    'previous': undefined,
                    'current': new Word(0, 0, 'fakeselection', true)
                })).toBeTruthy();
            }
        });
    });

    describe('emitFoundWord()', () => {
        it('should emit the found word to the opponent', () => {
            if (!multiplayerService['socketService'].socket.connected) {
                expect(multiplayerService.emitFoundWord(new Word(
                    0, 0, 'fakeword', true
                ))).toBeFalsy();
            } else {
                expect(multiplayerService.emitFoundWord(new Word(
                    0, 0, 'fakeword', true
                ))).toBeTruthy();
            }
        });
    });

    describe('emitDeselectAll()', () => {
        it('should emit to the opponent that you have canceled your selection', () => {
            if (!multiplayerService['socketService'].socket.connected) {
                expect(multiplayerService.emitDeselectAll()).toBeFalsy();
            } else {
                expect(multiplayerService.emitDeselectAll()).toBeTruthy();
            }
        });
    });

    describe('emitNewCountdown()', () => {
        it('should emit to the server the new initial countdown: cheat mode functionality', () => {
            if (!multiplayerService['socketService'].socket.connected) {
                expect(multiplayerService.emitNewCountdown(10)).toBeFalsy();
            } else {
                expect(multiplayerService.emitNewCountdown(10)).toBeTruthy();
            }
        });
    });

    describe('socket listeners', () => {
        it('should listen for games start', () => {
            expect(multiplayerService.listeningOnSockets).toBeTruthy();
        });

        it('should listen for opponent hint selections', () => {
            expect(multiplayerService.listeningOnSockets).toBeTruthy();
        });

        it('should listen for opponent found words', () => {
            expect(multiplayerService.listeningOnSockets).toBeTruthy();
        });

        it('should listen for opponent deselect words', () => {
            expect(multiplayerService.listeningOnSockets).toBeTruthy();
        });

        it('should listen for server clock countdown', () => {
            expect(multiplayerService.listeningOnSockets).toBeTruthy();
        });
    });
});

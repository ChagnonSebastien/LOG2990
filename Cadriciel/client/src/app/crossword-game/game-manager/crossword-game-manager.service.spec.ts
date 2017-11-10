import { TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { CrosswordGameManagerService } from './crossword-game-manager.service';
import { CrosswordKeyboardService } from '../keyboard/crossword-keyboard.service';
import { CrosswordService } from '../crossword/crossword.service';
import { CrosswordSocketService } from '../socket/crossword-socket.service';
import { CrosswordHintsService } from '../hints/crossword-hints.service';
import { CrosswordGridService } from '../grid/crossword-grid.service';
import { CrosswordPointsService } from '../points/crossword-points.service';
import { CrosswordWordsService } from '../words/crossword-words.service';
import { CrosswordPlayerService } from '../player/crossword-player.service';
import { CrosswordMultiplayerService } from '../multiplayer/crossword-multiplayer.service';
import { CrosswordCountdownService } from '../countdown/crossword-countdown.service';
import { CrosswordCheatService } from '../cheat/crossword-cheat.service';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';
import { LexiconService } from '../lexicon/lexicon.service';

import { Word } from '../../../../../commun/word';
import { CrosswordSquare } from '../shared-classes/crossword-square';

let gameManagerService: CrosswordGameManagerService;

describe('#CrosswordGameManagerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CrosswordCheatService,
                CrosswordConfigurationService,
                CrosswordCountdownService,
                CrosswordGameManagerService,
                CrosswordGridService,
                CrosswordGridService,
                CrosswordHintsService,
                CrosswordMultiplayerService,
                CrosswordPointsService,
                CrosswordService,
                CrosswordWordsService,
                CrosswordKeyboardService,
                CrosswordSocketService,
                CrosswordPlayerService,
                LexiconService
            ]
        });
        gameManagerService = TestBed.get(CrosswordGameManagerService);
    });

    describe('endGame()', () => {
        it('should set game in progress to false', () => {
            gameManagerService.endGame();
            expect(gameManagerService.gameInProgress).toBeFalsy();
        });

        it('should set game completed to false', () => {
            gameManagerService.endGame();
            expect(gameManagerService.gameCompleted).toBeFalsy();
        });
    });

    describe('deselectAll()', () => {
        it('should deselect all hints on the grid of both players when the game is in progress', () => {
            gameManagerService['gridService'].grid = Array(10).fill(undefined).map((row) => {
                return Array(10).fill(undefined).map((square) => {
                    return new CrosswordSquare('a');
                });
            });
            gameManagerService.gameInProgress = true;
            expect(gameManagerService.deselectAll()).toBeTruthy();
        });

        it('should not deselect anything when no game is in progress', () => {
            gameManagerService.gameInProgress = false;
            expect(gameManagerService.deselectAll()).toBeFalsy();
        });
    });

    describe('reactive behaviour', () => {
        describe('reacting to start game alerts', () => {
            it('should create a solo game when the configuration is solo', () => {

            });

            it('should creat a multiplayer game when the configuration is multiplayer', () => {

            });
        });

        describe('reacting to game completed alerts', () => {
            it('should end the game', () => {

            });
        });

        describe('reacting to selected word alerts', () => {
            it('should select the word on the grid', () => {

            });

            it('should tell the opponent it selected a word if in multiplayer mode', () => {

            });
        });

        describe('reacting to word found alerts', () => {
            it('should mark the hint as found', () => {

            });

            it('should tell the opponent the word was found if in multiplayer mode', () => {

            });
        });

        describe('reacting to multiplayer game start alerts', () => {
            it('should start the game with the same grid as the opponent', () => {

            });
        });

        describe('reacting to opponent hint selection alerts', () => {
            it('should mark the hint as selected by the opponent on the grid', () => {

            });

            it('should mark the hint as selected by the opponent in the hints', () => {

            });
        });

        describe('reacting to opponent found word alerts', () => {
            it('should mark the word as found by the opponent on the grid', () => {

            });

            it('should mark the word as found by the opponent in the hints', () => {

            });
        });

        describe('reacting to countdown reached zero alerts', () => {
            it('should mutate the grid in a solo game with dynamic mode', () => {

            });
        });

        describe('reacting to initial countdown changed alerts', () => {
            it('should set the initial countdown to the new one', () => {

            });

            it('should reset the counter', () => {

            });
        });

        describe('reacting to opponent deselect all alerts', () => {
            it('should mark the grid as deselected by the opponent', () => {

            });

            it('should mark all hints deselected by the opponent', () => {

            });
        });

        describe('reacting to server clock alerts', () => {
            it('should synchronize the countdown with the count alerted by the server', () => {

            });
        });
    });
});

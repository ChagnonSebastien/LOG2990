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

import { CrosswordSquare } from '../shared-classes/crossword-square';

import { MockCrosswordService } from './mocks/mock-crossword.service';
import { MockLexiconService } from './mocks/mock-lexicon.service';
import { MockSocketService } from './mocks/mock-socket.service';
import { CrosswordMutationService } from '../mutation/crossword-mutation.service';

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
                CrosswordHintsService,
                CrosswordMultiplayerService,
                CrosswordMutationService,
                CrosswordPointsService,
                { provide: CrosswordService, useClass: MockCrosswordService },
                CrosswordWordsService,
                CrosswordKeyboardService,
                { provide: CrosswordSocketService, useClass: MockSocketService },
                CrosswordPlayerService,
                { provide: LexiconService, useClass: MockLexiconService },
                CrosswordMutationService
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
});

import { Injectable } from '@angular/core';

import { CrosswordService } from '../crossword/crossword.service';
import { CrosswordHintsService } from '../hints/crossword-hints.service';
import { CrosswordGridService } from '../grid/crossword-grid.service';
import { CrosswordPointsService } from '../points/crossword-points.service';
import { CrosswordWordsService } from '../words/crossword-words.service';
import { CrosswordMultiplayerService } from '../multiplayer/crossword-multiplayer.service';
import { CrosswordCountdownService } from '../countdown/crossword-countdown.service';
import { CrosswordCheatService } from '../cheat/crossword-cheat.service';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';

import { Word } from '../../../../../commun/word';

@Injectable()
export class CrosswordGameManagerService {
    public gameInProgress: boolean;
    public gameCompleted: boolean;
    private multiplayerMode: boolean;

    constructor(
        private crosswordService: CrosswordService,
        private hintsService: CrosswordHintsService,
        private gridService: CrosswordGridService,
        private pointsService: CrosswordPointsService,
        private wordsService: CrosswordWordsService,
        private multiplayerService: CrosswordMultiplayerService,
        private countdownService: CrosswordCountdownService,
        private cheatService: CrosswordCheatService,
        private configurationService: CrosswordConfigurationService
    ) {
        this.gameInProgress = false;
        this.gameCompleted = false;
        this.dispatchGameEvents();
    }

    private dispatchGameEvents(): void {
        this.listenForStartGame();
        this.listenForWordSelections();
        this.listenForWordFoundAlerts();
        this.listenForMultiplayerGameStart();
        this.listenForOpponentWordSelections();
        this.listenForOpponentFoundWords();
        this.listenForCountdownReachedZero();
        this.listenForCheatModeCountdownChanges();
        this.listenForOpponentDeselectedAll();
        this.listenForGameCompletion();
        this.listenForOpponentLeft();
        this.listenForServerClock();
    }

    private async newSoloGame(level: string): Promise<void> {
        await this.crosswordService.getCrossword(level).then((crossword) => {
            this.constructGame(crossword.crossword, crossword.wordsWithIndex, crossword.listOfWords);
        });
    }

    public endGame(): void {
        this.gameInProgress = false;
        this.gameCompleted = false;
        this.multiplayerService.emitLeavingGame();
    }

    private newMultiplayerGame(level: string, mode: string): void {
        this.multiplayerMode = true;
        this.multiplayerService.createGame(level, mode);
    }

    private constructGame(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>): void {
        this.wordsService.newGame(wordsWithIndex);
        this.gridService.newGame(grid, wordsWithIndex);
        this.hintsService.newGame(wordsWithIndex);
        this.pointsService.newGame();
        this.countdownService.newGame();
    }

    public deselectAll(): boolean {
        if (this.gameInProgress) {
            this.multiplayerService.emitDeselectAll();
            return this.hintsService.deselectHint()
                && this.gridService.deselectWord();
        }
        return false;
    }

    private listenForStartGame(): void {
        this.configurationService.startGameAlerts()
            .subscribe(async (configuration) => {
                if (configuration.type === 'solo') {
                    await this.newSoloGame(configuration.level);
                    this.gameInProgress = true;
                } else if (configuration.type === 'multiplayer') {
                    await this.newMultiplayerGame(configuration.level, configuration.mode);
                }
            });
    }

    private listenForGameCompletion(): void {
        this.pointsService.gameCompletedAlerts()
            .subscribe((end: boolean) => {
                this.gameCompleted = end;
            });
    }

    private listenForWordSelections(): void {
        this.hintsService.selectedWordAlerts()
            .subscribe((hintSelection) => {
                if (this.multiplayerMode) {
                    this.multiplayerService.emitSelectHint(hintSelection);
                }

                this.gridService.deselectWord();
                this.gridService.selectWord(hintSelection.current);
            });
    }

    private listenForWordFoundAlerts(): void {
        this.gridService.wordFoundAlerts()
            .subscribe((foundWord) => {
                if (this.multiplayerMode) {
                    this.multiplayerService.emitFoundWord(foundWord);
                } else if (this.configurationService.isDynamic()) {
                    this.countdownService.resetCountdown();
                }
                this.hintsService.markHintAsFound(foundWord.word);
                this.pointsService.addToFoundWords(foundWord.word);
            });
    }

    private listenForMultiplayerGameStart(): void {
        this.multiplayerService.gameStartAlerts()
            .subscribe((game) => {
                this.constructGame(
                    game.crossword.crossword,
                    game.crossword.wordsWithIndex,
                    game.crossword.listOfWords
                );
                this.countdownService.stopCountdown();
                this.gameInProgress = true;
                this.multiplayerMode = true;
            });
    }

    private listenForOpponentWordSelections(): void {
        this.multiplayerService.opponentHintSelectionAlerts()
            .subscribe((hintSelection) => {
                this.hintsService.opponentSelectedWord = hintSelection.current.word;
                this.gridService.unselectWordOpponent();
                this.gridService.selectWordOpponent(hintSelection.current);
            });
    }

    private listenForOpponentFoundWords(): void {
        this.multiplayerService.opponentFoundWordAlerts()
            .subscribe((foundWord) => {
                this.hintsService.markHintAsFoundByOpponent(foundWord.word);
                this.gridService.markWordAsFoundByOpponent(foundWord);
                this.pointsService.addToOpponentFoundWords(foundWord.word);
            });
    }

    private listenForCountdownReachedZero(): void {
        this.countdownService.countdownReachedZeroAlerts()
            .subscribe((zero) => {
            });
    }

    private listenForCheatModeCountdownChanges(): void {
        this.cheatService.initialCountdownChangedAlerts()
            .subscribe((newCountdown) => {
                if (!this.multiplayerMode) {
                    this.countdownService.initialCount = newCountdown;
                    this.countdownService.resetCountdown();
                } else {
                    this.multiplayerService.emitNewCountdown(newCountdown);
                }
            });
    }

    private listenForOpponentDeselectedAll(): void {
        this.multiplayerService.opponentDeselectedAllAlerts()
            .subscribe((unselect) => {
                if (this.gameInProgress) {
                    this.hintsService.opponentSelectedWord = undefined;
                    this.gridService.unselectWordOpponent();
                }
            });
    }

    private listenForOpponentLeft(): void {
        this.multiplayerService.opponentLeftAlerts()
            .subscribe((left) => {
                alert('Your opponent left the game');
                this.endGame();
            });
    }

    private listenForServerClock(): void {
        this.multiplayerService.serverClockAlerts()
            .subscribe((count) => {
                this.countdownService.count = count;
            });
    }
}

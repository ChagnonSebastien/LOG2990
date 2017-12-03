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
import { CrosswordPlayerService } from '../player/crossword-player.service';
import { CrosswordLobbyService } from '../lobby/crossword-lobby.service';
import { CrosswordMutationService } from '../mutation/crossword-mutation.service';

import { Word } from '../../../../../commun/word';
import { Crossword } from '../../../../../commun/crossword/crossword';

@Injectable()
export class CrosswordGameManagerService {
    public gameInProgress: boolean;
    public gameCompleted: boolean;

    constructor(
        private crosswordService: CrosswordService, // Stateless
        private hintsService: CrosswordHintsService, // Stateful, reset on newGame()
        private gridService: CrosswordGridService, // Stateful, reset on newGame()
        private pointsService: CrosswordPointsService, // Stateful, reset on newGame()
        private wordsService: CrosswordWordsService, // Stateful, reset on newGame()
        private multiplayerService: CrosswordMultiplayerService, // Stateful, no need to reset
        private countdownService: CrosswordCountdownService, // Stateful, reset on newGame()
        private cheatService: CrosswordCheatService, // Stateful, no need to reset
        private configurationService: CrosswordConfigurationService, // Stateful, no need to reset
        private playerService: CrosswordPlayerService, // Stateful, reset on isHost = false
        private mutationService: CrosswordMutationService // Stateful, no need to reset
    ) {
        this.gameInProgress = false;
        this.gameCompleted = false;
        this.dispatchGameEvents();
    }

    private dispatchGameEvents(): void {
        this.listenForCreateGame();
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
        this.listenForOpponentRestarted();
        this.listenForMutation();
        this.synchronizeWithServerClock();
    }

    private async newSoloGame(level: string): Promise<void> {
        await this.crosswordService.getCrossword(level).then((crossword) => {
            this.constructGame(crossword.crossword, crossword.wordsWithIndex, crossword.listOfWords);
        });
    }

    public endGame(): void {
        if (this.configurationService.isMultiplayer()) {
            this.multiplayerService.emitLeavingGame();
        }
        this.hintsService.endGame();
        this.gridService.endGame();
        this.pointsService.endGame();
        this.wordsService.endGame();
        this.countdownService.endGame();
        this.gameInProgress = false;
        this.gameCompleted = false;
        this.playerService.isHost = false;
    }

    public restartGame() {
        if (this.configurationService.isMultiplayer()) {
            this.multiplayerService.emitRestartGame(
                this.configurationService.level,
                this.configurationService.mode
            );
        } else {
            this.newSoloGame(this.configurationService.level);
        }
        this.gameCompleted = false;
    }

    private newMultiplayerGame(level: string, mode: string): void {
        this.multiplayerService.createGame(level, mode);
    }

    private constructGame(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>): void {
        this.hintsService.newGame(wordsWithIndex);
        this.gridService.newGame(grid, wordsWithIndex);
        this.pointsService.newGame();
        this.wordsService.newGame(wordsWithIndex);
        if (this.configurationService.isDynamic() && !this.configurationService.isMultiplayer()) {
            this.mutationService.updateMutation();
            this.countdownService.newGame();
        }
    }

    public deselectAll(): boolean {
        if (this.gameInProgress) {
            this.multiplayerService.emitDeselectAll();
            return this.hintsService.deselectHint()
                && this.gridService.deselectWord();
        }
        return false;
    }

    private listenForCreateGame(): void {
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
                this.countdownService.endGame();
                this.gameCompleted = true;
            });
    }

    private listenForWordSelections(): void {
        this.hintsService.selectedWordAlerts()
            .subscribe((hintSelection) => {
                if (this.configurationService.isMultiplayer()) {
                    this.multiplayerService.emitSelectHint(hintSelection);
                }

                this.gridService.deselectWord();
                this.gridService.selectWord(hintSelection.current);
            });
    }

    private listenForWordFoundAlerts(): void {
        this.gridService.wordFoundAlerts()
            .subscribe((foundWord) => {
                this.hintsService.markHintAsFound(foundWord.word);
                this.pointsService.addToFoundWords(foundWord.word);
                if (this.configurationService.isMultiplayer()) {
                    this.multiplayerService.emitFoundWord(foundWord);
                } else if (this.configurationService.isDynamic()) {
                    this.mutationService.updateMutation();
                    this.countdownService.resetCountdown();
                }
            });
    }

    private listenForMultiplayerGameStart(): void {
        this.multiplayerService.gameStartSubject.asObservable()
            .subscribe((game) => {
                this.constructGame(
                    game.crossword.crossword,
                    game.crossword.wordsWithIndex,
                    game.crossword.listOfWords
                );
                this.gameInProgress = true;
            });
    }

    private listenForOpponentWordSelections(): void {
        this.multiplayerService.opponentHintSelection.asObservable()
            .subscribe((hintSelection) => {
                this.hintsService.opponentSelectedWord = hintSelection.current.word;
                this.gridService.unselectWordOpponent();
                this.gridService.selectWordOpponent(hintSelection.current);
            });
    }

    private listenForOpponentFoundWords(): void {
        this.multiplayerService.opponentFoundWord.asObservable()
            .subscribe((foundWord) => {
                this.hintsService.markHintAsFoundByOpponent(foundWord.word);
                this.gridService.markWordAsFoundByOpponent(foundWord);
                this.pointsService.addToOpponentFoundWords(foundWord.word);
            });
    }

    private listenForCountdownReachedZero(): void {
        this.countdownService.countdownReachedZeroAlerts()
            .subscribe((zero) => {
                if (this.configurationService.isDynamic() && !this.configurationService.isMultiplayer()) {
                    this.mutationService.mutate();
                }
            });
    }

    private listenForCheatModeCountdownChanges(): void {
        this.cheatService.initialCountdownChanges.asObservable()
            .subscribe((newCountdown) => {
                if (this.configurationService.isDynamic()) {
                    if (this.configurationService.isMultiplayer()) {
                        this.multiplayerService.emitNewCountdown(newCountdown);
                    } else {
                        this.countdownService.initialCount = newCountdown;
                        this.countdownService.resetCountdown();
                    }
                }
            });
    }

    private listenForOpponentDeselectedAll(): void {
        this.multiplayerService.opponentDeselection.asObservable()
            .subscribe((unselect) => {
                if (this.gameInProgress) {
                    this.hintsService.opponentSelectedWord = undefined;
                    this.gridService.unselectWordOpponent();
                }
            });
    }

    private listenForOpponentLeft(): void {
        this.multiplayerService.opponentLeft.asObservable()
            .subscribe((left) => {
                alert('Your opponent left the game');
                this.endGame();
            });
    }

    private listenForOpponentRestarted(): void {
        this.multiplayerService.opponentRestarted.asObservable()
            .subscribe((restarted) => {
                this.gameCompleted = false;
            });
    }

    private synchronizeWithServerClock(): void {
        this.multiplayerService.serverClock.asObservable()
            .subscribe((count) => {
                if (this.configurationService.isMultiplayer()) {
                    if (count === 0) {
                        this.mutationService.mutateMultiplayer();
                    }
                    this.countdownService.count = count;
                }
            });
    }

    private listenForMutation(): void {
        this.multiplayerService.mutation
            .asObservable()
            .subscribe(async (crossword: Crossword) => {
                console.log('GAME MANAGER CALLBACK', crossword);
                await this.mutationService.updateMultiplayerMutation(crossword);
                // this.mutationService.mutateMultiplayer();
            });
    }
}

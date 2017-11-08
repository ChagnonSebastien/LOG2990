import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { CrosswordService } from './crossword.service';
import { CrosswordHintsService } from './crossword-hints/crossword-hints.service';
import { CrosswordGridService } from './crossword-grid/crossword-grid.service';
import { CrosswordPointsService } from './crossword-points/crossword-points.service';
import { CrosswordWordsService } from './crossword-words.service';
import { CrosswordMultiplayerService } from './crossword-multiplayer.service';
import { CrosswordCountdownService } from './crossword-countdown.service';
import { CrosswordCheatService } from './crossword-cheat.service';
import { CrosswordConfigurationService } from './crossword-menu/crossword-configuration.service';

import { Word } from '../../../../commun/word';

@Injectable()
export class CrosswordGameService {
    public gameInProgress: boolean;
    public gameCompleted: boolean;
    private multiplayerMode: boolean;
    private gameStartSubject: Subject<any>;

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
        this.gameStartSubject = new Subject();
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
    }

    public async newSoloGame(level: string) {
        await this.crosswordService.getCrossword(level).then((crossword) => {
            this.constructGame(crossword.crossword, crossword.wordsWithIndex, crossword.listOfWords);
        });
    }

    public endGame() {
        this.gameInProgress = false;
        this.gameCompleted = false;
    }

    public async newMultiplayerGame(level: string, mode: string) {
        this.multiplayerMode = true;
        this.multiplayerService.createGame(level, mode);
    }

    private constructGame(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>) {
        this.wordsService.newGame(wordsWithIndex);
        this.gridService.newGame(grid, wordsWithIndex);
        this.hintsService.newGame(wordsWithIndex);
        this.pointsService.newGame();
        this.countdownService.newGame();
    }

    public unselectAll() {
        if (this.gameInProgress) {
            this.hintsService.unselectHint();
            this.gridService.unselectWord();
            this.multiplayerService.emitUnselectAll();
        }
    }

    private listenForStartGame() {
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

    private listenForGameCompletion() {
        this.pointsService.gameCompletedAlerts()
            .subscribe((end: boolean) => {
                this.gameCompleted = end;
            });
    }

    public gameStartAlerts(): Observable<any> {
        return this.gameStartSubject.asObservable();
    }

    private listenForWordSelections() {
        this.hintsService.selectedWordAlerts()
            .subscribe((hintSelection) => {
                if (this.multiplayerMode) {
                    this.multiplayerService.emitSelectHint(hintSelection);
                }

                this.gridService.unselectWord();
                this.gridService.selectWord(hintSelection.current);
            });
    }

    private listenForWordFoundAlerts() {
        this.gridService.wordFoundAlerts()
            .subscribe((foundWord) => {
                if (this.multiplayerMode) {
                    this.multiplayerService.emitFoundWord(foundWord);
                }
                this.hintsService.markHintAsFound(foundWord.word);
                this.pointsService.addToFoundWords(foundWord.word);
            });
    }

    private listenForMultiplayerGameStart() {
        this.multiplayerService.gameStartAlerts()
            .subscribe((game) => {
                this.constructGame(
                    game.crossword.crossword,
                    game.crossword.wordsWithIndex,
                    game.crossword.listOfWords
                );
                this.gameInProgress = true;
                this.multiplayerMode = true;
            });
    }

    private listenForOpponentWordSelections() {
        this.multiplayerService.opponentHintSelectionAlerts()
            .subscribe((hintSelection) => {
                console.log('GAME SERVICE CAPTURED OPPONENT SELECTION', hintSelection);
                this.hintsService.opponentSelectedWord = hintSelection.current.word;
                this.gridService.unselectWordOpponent();
                this.gridService.selectWordOpponent(hintSelection.current);
            });
    }

    private listenForOpponentFoundWords() {
        this.multiplayerService.opponentFoundWordAlerts()
            .subscribe((foundWord) => {
                console.log('OPPONENT FOUND A WORD', foundWord);
                this.hintsService.markHintAsFoundByOpponent(foundWord.word);
                this.gridService.markWordAsFoundByOpponent(foundWord);
                this.pointsService.addToOpponentFoundWords(foundWord.word);
            });
    }

    private listenForCountdownReachedZero() {
        this.countdownService.countdownReachedZeroAlerts()
            .subscribe((zero) => {
                console.log('COUNTDOWN REACHED ZERO');
            });
    }

    private listenForCheatModeCountdownChanges() {
        this.cheatService.initialCountdownChangedAlerts()
            .subscribe((newCountdown) => {
                console.log('NEW COUNTDOWN', newCountdown);
                this.countdownService.stopCountdown();
                this.countdownService.initialCount = newCountdown;
                this.countdownService.resetCountdown();
                this.countdownService.startCountdown();
            });
    }

    private listenForOpponentDeselectedAll() {
        this.multiplayerService.opponentUnselectedAllAlerts()
            .subscribe((unselect) => {
                if (this.gameInProgress) {
                    this.hintsService.opponentSelectedWord = undefined;
                    this.gridService.unselectWordOpponent();
                }
            });
    }
}

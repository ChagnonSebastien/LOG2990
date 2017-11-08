import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { CrosswordService } from './crossword.service';
import { CrosswordHintsService } from './crossword-hints/crossword-hints.service';
import { CrosswordGridService } from './crossword-grid/crossword-grid.service';
import { CrosswordPointsService } from './crossword-points/crossword-points.service';
import { CrosswordWordsService } from './crossword-words.service';
import { CrosswordMultiplayerService } from './crossword-multiplayer.service';

import { Word } from '../../../../commun/word';

@Injectable()
export class CrosswordGameService {
    private multiplayerMode: boolean;
    private gameStartSubject: Subject<any>;

    constructor(
        private crosswordService: CrosswordService,
        private hintsService: CrosswordHintsService,
        private gridService: CrosswordGridService,
        private pointsService: CrosswordPointsService,
        private wordsService: CrosswordWordsService,
        private multiplayerService: CrosswordMultiplayerService
    ) {
        this.gameStartSubject = new Subject();
        this.listenForWordSelections();
        this.listenForWordFoundAlerts();
        this.listenForMultiplayerGameStart();
        this.listenForOpponentWordSelections();
        this.listenForOpponentFoundWords();
    }

    public async newSoloGame(level: string) {
        await this.crosswordService.getCrossword(level).then((crossword) => {
            this.constructGame(crossword.crossword, crossword.wordsWithIndex, crossword.listOfWords);
        });
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

                if (hintSelection.previous) {
                    const wordWithIndex = this.wordsService
                        .getWordWithIndex(hintSelection.previous);
                    this.gridService.unselectWord(wordWithIndex);
                }
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
                this.gameStartSubject.next(true);
                this.multiplayerMode = true;
            });
    }

    private listenForOpponentWordSelections() {
        this.multiplayerService.opponentHintSelectionAlerts()
            .subscribe((hintSelection) => {
                console.log('GAME SERVICE CAPTURED OPPONENT SELECTION', hintSelection);
                this.hintsService.opponentSelectedWord = hintSelection.current.word;
                if (hintSelection.previous) {
                    const previous = this.wordsService.getWordWithIndex(hintSelection.previous);
                    this.gridService.unselectWordOpponent(previous);
                }
                this.gridService.selectWordOpponent(hintSelection.current);
            });
    }

    private listenForOpponentFoundWords() {
        this.multiplayerService.opponentFoundWordAlerts()
            .subscribe((foundWord) => {
                console.log('OPPONENT FOUND A WORD', foundWord);
                this.hintsService.markHintAsFoundByOpponent(foundWord.word);
                this.gridService.markWordAsFoundByOpponent(foundWord);
                /* if (foundWord.word === this.hintsService.selectedWord) {
                    this.hintsService.unselectHint();
                }
                this.hintsService.opponentSelectedWord = undefined;
                this.hintsService.markHintAsFoundByOpponent(foundWord.word);
                this.gridService.markWordAsFoundByOpponent(foundWord);*/
            });
    }
}

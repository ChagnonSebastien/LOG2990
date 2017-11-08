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
    }

    public async newSoloGame(level: string) {
        this.multiplayerMode = false;
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
            .subscribe((wordSelection) => {
                if (wordSelection.previous) {
                    const wordWithIndex = this.wordsService
                        .getWordWithIndex(wordSelection.previous);
                    this.gridService.unselectWord(wordWithIndex);
                }
                this.gridService.selectWord(wordSelection.current);
            });
    }

    private listenForWordFoundAlerts() {
        this.gridService.wordFoundAlerts()
            .subscribe((foundWord) => {
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
                console.log()
                this.gameStartSubject.next(true);
            });
    }
}

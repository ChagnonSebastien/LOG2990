import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CrosswordSocketService } from '../socket/crossword-socket.service';
import { CrosswordPlayerService } from '../player/crossword-player.service';

import { CrosswordGameInfo } from '../../../../../commun/crossword/crossword-game-info';
import { Word } from '../../../../../commun/word';

@Injectable()
export class CrosswordMultiplayerService {
    private gameStartSubject: Subject<any>;
    private opponentHintSelection: Subject<any>;
    private opponentFoundWord: Subject<any>;
    private opponentUnselection: Subject<any>;
    private serverClock: Subject<number>;

    constructor(
        private socketService: CrosswordSocketService,
        private playerService: CrosswordPlayerService
    ) {
        this.initializeObservableSubjects();
        this.listenToSocketRequests();
    }

    private initializeObservableSubjects(): void {
        this.gameStartSubject = new Subject();
        this.opponentHintSelection = new Subject();
        this.opponentFoundWord = new Subject();
        this.opponentUnselection = new Subject();
        this.serverClock = new Subject();
    }

    private listenToSocketRequests(): void {
        this.listenForGameStart();
        this.listenForOpponentHintSelections();
        this.listenForOpponentFoundWords();
        this.listenForOpponentUnselectAll();
        this.listenForServerCountdown();
    }

    public gameStartAlerts(): Observable<any> {
        return this.gameStartSubject.asObservable();
    }

    public opponentHintSelectionAlerts(): Observable<any> {
        return this.opponentHintSelection.asObservable();
    }

    public opponentFoundWordAlerts(): Observable<any> {
        return this.opponentFoundWord.asObservable();
    }

    public opponentUnselectedAllAlerts(): Observable<any> {
        return this.opponentUnselection.asObservable();
    }

    public serverClockAlerts(): Observable<any> {
        return this.serverClock.asObservable();
    }

    public createGame(difficulty: string, mode: string) {
        this.socketService.socket.emit(
            'create game', difficulty, mode, this.playerService.username
        );
    }

    public emitSelectHint(
        hintSelection: { 'previous': string, 'current': Word }
    ) {
        this.socketService.socket.emit('selected hint', hintSelection);
    }

    public emitFoundWord(word: Word) {
        this.socketService.socket.emit('found word', word);
    }

    public emitUnselectAll() {
        this.socketService.socket.emit('unselect all');
    }

    public emitNewCountdown(newCountdown: number) {
        this.socketService.socket.emit('new countdown', newCountdown);
    }

    private listenForGameStart() {
        this.socketService.socket.on('game started', (game) => {
            console.log('GAME STARTED', game);
            this.gameStartSubject.next(game);
        });
    }

    private listenForOpponentHintSelections() {
        this.socketService.socket.on('opponent selected a hint', (hintSelection) => {
            console.log('OPPONENT SELECTED', hintSelection);
            this.opponentHintSelection.next(hintSelection);
        });
    }

    private listenForOpponentFoundWords() {
        this.socketService.socket.on('opponent found a word', (foundWord) => {
            console.log('OPPONENT FOUND', foundWord);
            this.opponentFoundWord.next(foundWord);
        });
    }

    private listenForOpponentUnselectAll() {
        this.socketService.socket.on('opponent unselected all', () => {
            this.opponentUnselection.next(true);
        });
    }

    private listenForServerCountdown() {
        this.socketService.socket.on('current countdown', (count: number) => {
            this.serverClock.next(count);
        });
    }
}

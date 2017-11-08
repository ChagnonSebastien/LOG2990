import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CrosswordSocketService } from './crossword-socket.service';
import { CrosswordPlayerService } from './crossword-player.service';

import { Player } from '../../../../commun/crossword/player';
import { CrosswordGameInfo } from '../../../../commun/crossword/crossword-game-info';
import { MultiplayerCrosswordGame } from '../../../../commun/crossword/multiplayer-crossword-game';
import { Word } from '../../../../commun/word';

@Injectable()
export class CrosswordMultiplayerService {
    public games: Array<CrosswordGameInfo>;
    private gameStartSubject: Subject<any>;
    private opponentHintSelection: Subject<any>;
    private opponentFoundWord: Subject<any>;
    private opponentUnselection: Subject<any>;

    constructor(
        private socketService: CrosswordSocketService,
        private playerService: CrosswordPlayerService
    ) {
        this.gameStartSubject = new Subject();
        this.opponentHintSelection = new Subject();
        this.opponentFoundWord = new Subject();
        this.opponentUnselection = new Subject();
        this.getGames();
        setInterval(this.getGames.bind(this), 1000);
        this.listenForActiveGames();
        this.listenForGameStart();
        this.listenForOpponentHintSelections();
        this.listenForOpponentFoundWords();
        this.listenForOpponentUnselectAll();
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

    public createGame(difficulty: string, mode: string) {
        this.socketService.socket.emit(
            'create game', difficulty, mode, this.playerService.username
        );
    }

    public joinGame(gameId: string) {
        this.socketService.socket.emit(
            'join game', gameId, this.playerService.username
        );
    }

    public getGames() {
        this.socketService.socket.emit('get games');
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

    private listenForActiveGames() {
        this.socketService.socket.on('sent all games', (games) => {
            this.games = games;
        });
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

    /*constructor(private socketService: CrosswordSocketService) {
        this.socketService.requestSocket().then(socket => {
            this.socket = socket;

            this.socket.on('player 2 joined', data => {
                this.game = data;
            });

            this.socket.on('game created', data => {
                this.game.id = data;
            });

            this.socket.on('opponent left', data => {
                alert('Your opponent left the game');
                this.leaveGame();
            });
        });
    }

    public getGame(): MultiplayerCrosswordGame {
        return this.game;
    }

    public createGame(type: string, difficulty: string, mode: string, player1: Player) {
        this.socket.emit('createGame', type, difficulty, mode, player1);
    }
    public leaveGame() {
        this.socket.emit('leaveGame', this.game.id);
    }

    public getGames(): Promise<ClientGameInfo[]> {
        this.socket.emit('getGames');
        const gamesPromise = new Promise<ClientGameInfo[]>(
            (res, rej) => this.socket.on('sent all games', data => res(data)));
        return gamesPromise;
    }

    public joinGame(gameId: string, player: Player) {
        this.socket.emit('joinGame', gameId, player);
    }

    public connectionStatus() {
        return this.socket !== undefined;
    }*/
}

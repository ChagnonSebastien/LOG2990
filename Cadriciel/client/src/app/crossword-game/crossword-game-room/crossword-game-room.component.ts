import { Component, OnInit } from '@angular/core';
import {MultiplayerService} from '../services/crossword-multiplayer.service';
import { Game } from '../../../../../commun/crossword/game';
@Component({
  selector: 'app-crossword-game-room',
  templateUrl: './crossword-game-room.component.html',
  styleUrls: ['./crossword-game-room.component.css']
})
export class CrosswordGameRoomComponent implements OnInit {
  public games: Game[] = [];
  constructor(private multiplayerService: MultiplayerService) { }

  public ngOnInit() {
    this.multiplayerService.getGames().then(games => {
      this.games = games;
    });
  }

  public joinGame(gameId: string) {
    const username = (<HTMLInputElement>document.getElementById('usernameInput')).value;
    this.multiplayerService.joinGame(gameId, username);
  }

}

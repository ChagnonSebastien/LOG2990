import { Component, OnInit } from '@angular/core';
import {MultiplayerService} from '../crossword-multiplayer.service';
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
      console.log(this.games);
    });
  }

  public joinGame(gameId: string) {
    const username = (<HTMLInputElement>document.getElementById('usernameInput')).value;
    this.multiplayerService.joinGame(gameId, username);
  }

}
interface Game {
  id: string;
  difficulty: string;
  mode: string;
  username1: string;
  username2: string;
  socketId1: string;
  socketId2: string;
}

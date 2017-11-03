import { Component, OnInit, Input } from '@angular/core';
import {GameManagerService} from '../crossword-game-manager.service';
import { Game } from '../../../../../commun/crossword/game';

@Component({
  selector: 'app-crossword-room',
  templateUrl: './crossword-room.component.html',
  styleUrls: ['./crossword-room.component.css']
})
export class CrosswordRoomComponent implements OnInit {

  public games: Game[] = [];
  @Input() public username: string;

  constructor(private gameManagerService: GameManagerService) { }

  public ngOnInit() {
    this.gameManagerService.getGames().then(games => {
      this.games = games;
    });
  }

  public joinGame(gameId: string) {
    this.gameManagerService.joinGame(gameId, this.username);
  }

}

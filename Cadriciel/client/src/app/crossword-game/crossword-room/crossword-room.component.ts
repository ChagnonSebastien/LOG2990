import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameManagerServicePlayer2 } from '../crossword-game-manager-player2.service';
import { PlayerManagerService } from '../crossword-player-manager.service';
import { ClientGameInfo } from '../../../../../commun/crossword/clientGameInfo';

@Component({
  selector: 'app-crossword-room',
  templateUrl: './crossword-room.component.html',
  styleUrls: ['./crossword-room.component.css']
})
export class CrosswordRoomComponent implements OnInit {

  public username: string;
  public gamesListInfo: ClientGameInfo[] = [];
  @Output()
  private startGameEmitter: EventEmitter<any> = new EventEmitter();
  constructor(private gameManagerServicePlayer2: GameManagerServicePlayer2, private playerManagerService: PlayerManagerService) {
    this.username = '';
  }

  public ngOnInit() {
    this.gameManagerServicePlayer2.getGames().then(games => {
      this.gamesListInfo = games;
      this.startGameOnPlayer2Joined();
    });
  }

  public joinGame(gameId: string) {
    this.setPlayerUsername();
    this.gameManagerServicePlayer2.joinGame(gameId, this.playerManagerService.getPlayer());
  }

  public setPlayerUsername(): void {
    this.playerManagerService.getPlayer().setUsername(this.username);
  }

  private startGameOnPlayer2Joined() {
    this.gameManagerServicePlayer2.playerTwoAlerts()
      .subscribe((result) => {
        console.log(result);
        this.startGameEmitter.emit();
      });
  }

}

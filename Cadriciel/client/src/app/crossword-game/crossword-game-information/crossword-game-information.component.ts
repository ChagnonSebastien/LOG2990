import { Component, OnInit } from '@angular/core';
import {CrosswordGameInfoService} from '../services/crossword-game-info.service';
import { Game } from '../../../../../commun/crossword/game';

@Component({
  selector: 'app-crossword-game-information',
  templateUrl: './crossword-game-information.component.html',
  styleUrls: ['./crossword-game-information.component.css']
})
export class CrosswordGameInformationComponent implements OnInit {
  public game: Game;
  constructor(private crosswordGameInfoService: CrosswordGameInfoService) {
    this.game = {
      id: '',
      difficulty: '',
      mode: '',
      option:  '',
      username1: '',
      username2: '',
      socketId1: '',
      socketId2: '',
      crossword: [[]],
      listOfWords: []
  };
   }
  public ngOnInit() {
    this. getGameInfo();
  }
  public getGameInfo(): void {
    this.crosswordGameInfoService.getGameSettings().then(game => this.game = game);
  }
}

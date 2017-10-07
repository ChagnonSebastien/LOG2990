import { Component, OnInit } from '@angular/core';
import {CrosswordGameInfoService} from '../crossword-game-info.service';

@Component({
  selector: 'app-crossword-game-information',
  templateUrl: './crossword-game-information.component.html',
  styleUrls: ['./crossword-game-information.component.css']
})
export class CrosswordGameInformationComponent implements OnInit {
  public option: string = null;
  public mode: string = null;
  public level: string = null;

  constructor(private crosswordGameInfoService: CrosswordGameInfoService) { }

  public ngOnInit() {
    this.getOption();
  }

  public getOption(): void {
    this.crosswordGameInfoService.getOption().then(option => this.option = option);
    this.crosswordGameInfoService.getMode().then(mode => this.option = mode);
    this.crosswordGameInfoService.getLevel().then(level => this.option = level);

  }
}

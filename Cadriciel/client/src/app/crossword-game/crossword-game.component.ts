import { Component, OnInit } from '@angular/core';
import {CrosswordGameInfoService} from './crossword-game-info.service';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css'],
    providers: [CrosswordGameInfoService]
})
export class CrosswordGameComponent implements OnInit {
    public option: string = null;
    public mode: string = null;
    public level: string = null;

    constructor(private crosswordGameInfoService: CrosswordGameInfoService) { }

    public ngOnInit() {
    }

    public setOption(chosenOption: string): void {
        this.option = chosenOption;
        this.mode = null;
        this.level = null;
    }

    public setMode(chosenMode: string): void {
        this.mode = chosenMode;
    }

    public setLevel(chosenLevel: string): void {
        this.level = chosenLevel;
    }

    public isSolo(): boolean {
        return this.option === 'SOLO';
    }

    public saveOptions(): void {
        this.crosswordGameInfoService.option = this.option;
        this.crosswordGameInfoService.mode = this.mode;
        this.crosswordGameInfoService.level = this.level;

    }
}

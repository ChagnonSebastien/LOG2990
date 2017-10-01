import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent implements OnInit {
    public option: string = null;
    public mode: string = null;
    public level: string = null;

    constructor() { }

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

}

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent implements OnInit {
    option: string = null;
    mode: string = null;
    level: string = null;

    constructor() { }

    ngOnInit() {
    }

    setOption(chosenOption: string): void {
        this.option = chosenOption;
        this.mode = null;
        this.level = null;
    }

    setMode(chosenMode: string): void {
        this.mode = chosenMode;
    }

    setLevel(chosenLevel: string): void {
        this.level = chosenLevel;
    }

    isSolo(): boolean {
        return this.option == "SOLO";
    }

}

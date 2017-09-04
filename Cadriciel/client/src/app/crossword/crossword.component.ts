import { Component } from '@angular/core';

enum OPTION {
    SOLO,
    MULTIPLAYER
}

enum MODE {
    CLASSIC,
    DYNAMIC
}

enum LEVEL {
    EASY,
    NORMAL,
    HARD
}

@Component({
  selector: 'app-crossword-component',
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.css']
})

export class CrosswordComponent {
    option: string;
    mode: string;
    level: string;

    setOption(option: number):void {
        this.option = OPTION[option];
        console.log(this.option);
    }

    setMode(mode: number): void {
        this.mode = MODE[mode];
    }

    setLevel(level: number): void {
        this.level = LEVEL[level];
    }
}

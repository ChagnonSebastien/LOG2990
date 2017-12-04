import { Component } from '@angular/core';

import { CrosswordCountdownService } from './crossword-countdown.service';

@Component({
    selector: 'app-crossword-countdown',
    templateUrl: './crossword-countdown.component.html'
})
export class CrosswordCountdownComponent {
    constructor(public countdownService: CrosswordCountdownService) { }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordConfigurationService } from './crossword-menu/crossword-configuration.service';
import { CrosswordPointsService } from './crossword-points/crossword-points.service';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent {
    constructor(
        public crosswordGameService: CrosswordGameService,
        public configurationService: CrosswordConfigurationService,
    ) { }
}


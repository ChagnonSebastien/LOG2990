import { Component } from '@angular/core';

import { CrosswordPointsService } from './crossword-points.service';
import { CrosswordConfigurationService } from '../crossword-menu/crossword-configuration.service';

@Component({
    selector: 'app-crossword-points',
    templateUrl: './crossword-points.component.html',
    styleUrls: ['./crossword-points.component.css']
})
export class CrosswordPointsComponent {
    constructor(
        public pointsService: CrosswordPointsService,
        public configurationService: CrosswordConfigurationService
    ) { }
}

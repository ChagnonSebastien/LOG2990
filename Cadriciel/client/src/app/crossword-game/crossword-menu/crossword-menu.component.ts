import { Component } from '@angular/core';
import { PlayerManagerService } from '../crossword-player-manager.service';
import { CrosswordConfigurationService } from './crossword-configuration.service';

@Component({
    selector: 'app-crossword-menu',
    templateUrl: './crossword-menu.component.html',
    styleUrls: ['./crossword-menu.component.css'],
})
export class CrosswordMenuComponent {
    constructor(private configurationService: CrosswordConfigurationService) { }
}

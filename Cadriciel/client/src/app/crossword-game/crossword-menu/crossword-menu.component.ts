import { Component } from '@angular/core';
import { CrosswordConfigurationService } from './crossword-configuration.service';

@Component({
    selector: 'app-crossword-menu',
    templateUrl: './crossword-menu.component.html',
    styleUrls: ['./crossword-menu.component.css'],
})
export class CrosswordMenuComponent {
    constructor(private configurationService: CrosswordConfigurationService) { }
}

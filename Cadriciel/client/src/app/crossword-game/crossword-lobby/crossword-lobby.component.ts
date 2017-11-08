import { Component } from '@angular/core';

import { CrosswordPlayerService } from '../crossword-player.service';
import { CrosswordMultiplayerService } from '../crossword-multiplayer.service';
import { CrosswordConfigurationService } from '../crossword-menu/crossword-configuration.service';

@Component({
    selector: 'app-crossword-lobby',
    templateUrl: './crossword-lobby.component.html',
    styleUrls: ['./crossword-lobby.component.css']
})
export class CrosswordLobbyComponent {
    constructor(
        public multiplayerService: CrosswordMultiplayerService,
        public playerService: CrosswordPlayerService,
        private configurationService: CrosswordConfigurationService
    ) { }

    public copyJoinedGameConfiguration(level: string, mode: string) {
        this.configurationService.type = 'multiplayer';
        this.configurationService.level = level;
        this.configurationService.mode = mode;
    }
}

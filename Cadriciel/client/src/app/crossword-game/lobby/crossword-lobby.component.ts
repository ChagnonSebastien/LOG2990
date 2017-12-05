import { Component } from '@angular/core';

import { CrosswordLobbyService } from './crossword-lobby.service';
import { CrosswordPlayerService } from '../player/crossword-player.service';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';

import { Type } from '../configuration/type';

@Component({
    selector: 'app-crossword-lobby',
    templateUrl: './crossword-lobby.component.html',
    styleUrls: ['./crossword-lobby.component.css']
})
export class CrosswordLobbyComponent {
    constructor(
        public lobbyService: CrosswordLobbyService,
        public playerService: CrosswordPlayerService,
        private configurationService: CrosswordConfigurationService
    ) { }

    public copyJoinedGameConfiguration(level: string, mode: string) {
        this.configurationService.type = Type.MULTIPLAYER;
        this.configurationService.level = level;
        this.configurationService.mode = mode;
    }
}

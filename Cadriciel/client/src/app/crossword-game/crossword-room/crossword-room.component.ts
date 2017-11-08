import { Component } from '@angular/core';
import { CrosswordMultiplayerService } from '../crossword-multiplayer.service';

@Component({
    selector: 'app-crossword-room',
    templateUrl: './crossword-room.component.html',
    styleUrls: ['./crossword-room.component.css']
})
export class CrosswordRoomComponent {
    constructor(public multiplayerService: CrosswordMultiplayerService) { }
}

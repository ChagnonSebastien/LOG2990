import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CrosswordGameInterfaceComponent } from '../crossword-game-interface/crossword-game-interface.component';
import { CrosswordGameComponent } from '../crossword-game.component';
import { CrosswordGameRoomComponent } from '../crossword-game-room/crossword-game-room.component';
import { CrosswordMenuComponent } from './crossword-menu.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crossword-menu', component: CrosswordMenuComponent },
        { path: 'crossword-game', component: CrosswordGameComponent },
        { path: 'crossword-test', component: CrosswordGameInterfaceComponent },
        { path: 'crossword-game-room', component: CrosswordGameRoomComponent }
    ])],
    exports: [RouterModule]
})
export class CrosswordGameRoutingModule { }

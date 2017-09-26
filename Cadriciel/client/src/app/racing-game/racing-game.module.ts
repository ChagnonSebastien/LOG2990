import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RacingGameComponent } from './racing-game.component';
import { RacingHeaderComponent } from './racing-header/racing-header.component';
import { TrackComponent } from './track/track.component';
import { TracksComponent } from './tracks/tracks.component';
import {CrosswordGameInterfaceComponent} from './crossword-game-interface.component';


// Unused
import { InGameComponent } from './in-game/in-game.component';
import { TrackEditorComponent } from './track-editor/track-editor.component';
import { TrackAdminComponent } from './track-admin/track-admin.component';
import { TrackInfoComponent } from './track-info/track-info.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        RacingGameComponent,
        RacingHeaderComponent,
        TrackComponent,
        TracksComponent,
        InGameComponent,
        TrackEditorComponent,
        TrackAdminComponent,
        TrackInfoComponent,
    ],
    exports: [
        RacingGameComponent,
        RacingHeaderComponent,
        TrackComponent,
        TracksComponent,
    ],
    providers: []
})
export class RacingGameModule { }

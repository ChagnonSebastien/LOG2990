import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RacingGameComponent } from './racing-game.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        RacingGameComponent
    ],
    exports: [
        RacingGameComponent
    ],
    providers: []
})
export class RacingGameModule { }
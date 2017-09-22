import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubeComponent } from './cube.component';

import { RenderService } from './render.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        CubeComponent,
    ],
    exports: [
        CubeComponent
    ],
    providers: [RenderService]
})
export class CubeModule { }

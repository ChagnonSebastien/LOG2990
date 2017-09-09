import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CubeComponent } from './cube.component';

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
    providers: []
})
export class CubeModule { }
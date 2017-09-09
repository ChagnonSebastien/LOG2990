import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CubeComponent } from './cube/cube.component';
import { HomeComponent } from './home.component';

import { BasicService } from './basic.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        HomeComponent,
        CubeComponent,
    ],
    exports: [
        HomeComponent,
        CubeComponent
    ],
    providers: [BasicService]
})
export class HomeModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Home module */
import { HomeComponent } from './home.component';

import { BasicService } from './basic.service';

/* Feature modules */
import { CubeModule } from './cube/cube.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CubeModule
    ],
    declarations: [
        HomeComponent,
    ],
    exports: [
        HomeComponent,
    ],
    providers: [
        BasicService,
    ]
})
export class HomeModule { }
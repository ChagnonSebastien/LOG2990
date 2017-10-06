import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Home module */
import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        HomeComponent
    ],
    exports: [
        HomeComponent
    ],
    providers: []
})
export class HomeModule { }

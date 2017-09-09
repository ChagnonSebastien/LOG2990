import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Home module */
import { AdminComponent } from './admin.component';

/* Feature modules */

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        AdminComponent,
    ],
    exports: [
        AdminComponent,
    ],
    providers: [
    ]
})
export class AdminModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Home module */
import { AdminComponent } from './admin.component';

import { AuthenticationService } from './authentication.service';

/* Feature modules */

/* Routing module */
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule
    ],
    declarations: [
        AdminComponent,
    ],
    exports: [
        AdminComponent,
    ],
    providers: [
        AuthenticationService
    ]
})
export class AdminModule { }
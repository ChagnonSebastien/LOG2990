import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Admin module */
import { AdminComponent } from './admin.component';
import { TracksComponent } from './tracks/tracks.component';

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
        TracksComponent,
    ],
    exports: [
        AdminComponent,
        TracksComponent,
    ],
    providers: [
        AuthenticationService
    ]
})
export class AdminModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CubeComponent } from './cube/cube.component';
import { CrosswordComponent } from './crossword/crossword.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent},
    { path: 'crossword', component: CrosswordComponent },
    { path: 'cube', component: CubeComponent },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}

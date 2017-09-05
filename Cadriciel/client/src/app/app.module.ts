import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CubeComponent } from './home/cube/cube.component';

import {RenderService} from './home/cube/render.service';
import {BasicService} from './basic.service';
import { HomeComponent } from './home/home.component';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { CrosswordGameComponent } from './crossword-game/crossword-game.component';
import {AppRoutingModule} from './app-routing.module';
import {APP_BASE_HREF} from '@angular/common';
import { InGameComponent } from './racing-game/in-game/in-game.component';
import { RacingHeaderComponent } from './racing-game/racing-header/racing-header.component';
import { TrackEditorComponent } from './racing-game/racing-header/track-editor/track-editor.component';
import { AdministrationComponent } from './racing-game/racing-header/administration/administration.component';
import { TracksComponent } from './racing-game/racing-header/tracks/tracks.component';
import { TrackAdminComponent } from './racing-game/racing-header/tracks/track-admin/track-admin.component';
import { TrackInfoComponent } from './racing-game/racing-header/tracks/track-info/track-info.component';
import { TrackComponent } from './racing-game/track/track.component';


@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    HomeComponent,
    RacingGameComponent,
    CrosswordGameComponent,
    InGameComponent,
    RacingHeaderComponent,
    TrackEditorComponent,
    AdministrationComponent,
    TracksComponent,
    TrackAdminComponent,
    TrackInfoComponent,
    TrackComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue : '/' },
    RenderService,
    BasicService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

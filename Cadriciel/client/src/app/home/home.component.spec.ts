import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { CubeComponent } from './cube/cube.component';
import { RenderService } from './cube/render.service';
import { BasicService } from './basic.service';
import { ConnectionBackend, Http, HttpModule, RequestOptions } from '@angular/http';
import {DrawTrackComponent} from "../racing-game/draw-track/draw-track.component";
import {DrawTrackService} from "../racing-game/draw-track/draw-track.service";

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent, CubeComponent, DrawTrackComponent],
            providers: [RenderService, BasicService, DrawTrackService],
            imports: [HttpModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { CubeComponent } from './cube/cube.component';
import { RenderService } from './cube/render.service';
import { BasicService } from '../basic.service';
import { ConnectionBackend, Http, HttpModule, RequestOptions } from '@angular/http';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent, CubeComponent],
            providers: [RenderService, BasicService],
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

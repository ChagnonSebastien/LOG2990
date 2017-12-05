import { TestBed } from '@angular/core/testing';
import { DrawTrackRenderService } from './draw-track-render.service';

let renderService: DrawTrackRenderService;

describe('Draw Track Render', () => {

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [DrawTrackRenderService]
        });
        renderService = TestBed.get(DrawTrackRenderService);
    });

    it('Render creation', () => {
        expect(renderService).toBeDefined();
    });

    it('Clear intersections, segments', () => {
        renderService.clear();
        expect(renderService['intersections']).toEqual([]);
        expect(renderService['segments']).toEqual([]);
        expect(renderService.trackClosed).toEqual(false);
    });
});

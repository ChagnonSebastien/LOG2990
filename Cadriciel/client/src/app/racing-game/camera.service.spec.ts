import { CommandsService } from './events/commands.service';
import { TestBed } from '@angular/core/testing';
import { CameraService } from './camera.service';

let cameraService: CameraService;

describe('CameraService', function () {
    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [CameraService, CommandsService]
        });
        cameraService = TestBed.get(CameraService);
    });

    it('should be created', done => {
        expect(cameraService).toBeTruthy();
        done();
    });
});

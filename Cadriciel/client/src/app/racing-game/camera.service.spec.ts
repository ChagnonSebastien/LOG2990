import { CameraService } from './camera.service';

describe('test drawTrackService', function () {
    let cameraService: CameraService;
    beforeEach(() => {
        cameraService = new CameraService();
    });

    it('construction test', done => {
        expect(cameraService).toBeTruthy();
        done();
    });
});

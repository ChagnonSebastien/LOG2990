import { TestBed } from '@angular/core/testing';
import { CameraService } from './camera.service';

let cameraService: CameraService;

fdescribe('CameraService', function () {
    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [CameraService]
        });
        cameraService = TestBed.get(CameraService);
    });

    it('should be created', done => {
        expect(cameraService).toBeTruthy();
        done();
    });

    /*
    public getCamera(): THREE.Camera {
        return this.currentView === View.PERSPECTIVE ? this.perspectiveCamera : this.orthographicCamera;
    } */
    it('Returns camera', () => {
        const camera = cameraService.getCamera();
        expect(camera).toBeDefined();
    });
});

import { Injectable } from '@angular/core';
import * as THREE from 'three';

// standard position of camera
const perspectiveHeight = 2;
const orthographicHeight = 2;
const maximumPerspectiveDistance = 4;
const CAMERA_POSITION = new THREE.Vector3(0, 0, 100);
const perchPosition = new THREE.Vector3(10, 50, -75);

const fieldOfView = 70;
const nearClippingPane = 1;
const farClippingPane = 1000;

enum View { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {
    private sceneScale;

    private currentView;

    public perspectiveCamera;

    public orthographicCamera;

    public offsetX = 5;

    public offsetY = 5;

    public offsetZ = 5;

    public viewSize = 100;

    public initialiseCamera(container: HTMLElement): void {
        this.orthographicCamera = this.setOrthographicCamera(container);
        this.perspectiveCamera = this.setPerspectiveCamera(container);
        this.currentView = View.PERSPECTIVE;
        this.defaultCamerasPosition();
    }

    public setOrthographicCamera(container: HTMLElement): THREE.OrthographicCamera {
        const aspectRatio = this.getAspectRatio(container.clientWidth,
            container.clientHeight);
        const camera = new THREE.OrthographicCamera(
            - aspectRatio * this.viewSize / 2,
            aspectRatio * this.viewSize / 2,
            aspectRatio * this.viewSize / 2,
            - aspectRatio * this.viewSize / 2,
            -1000,
            1000
        );
        return camera;
    }

    public setPerspectiveCamera(container: HTMLElement): THREE.PerspectiveCamera {
        const aspectRatio = this.getAspectRatio(container.clientWidth,
            container.clientHeight);
        const camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            nearClippingPane,
            farClippingPane
        );
        return camera;
    }

    public getCamera(): THREE.Camera {
        return this.currentView === View.PERSPECTIVE ? this.perspectiveCamera : this.orthographicCamera;
    }

    private defaultCamerasPosition() {
        this.orthographicCamera.position.x = CAMERA_POSITION.x;
        this.orthographicCamera.position.y = CAMERA_POSITION.y;
        this.orthographicCamera.position.z = CAMERA_POSITION.z;
        this.perspectiveCamera.position.x = CAMERA_POSITION.x;
        this.perspectiveCamera.position.y = CAMERA_POSITION.y;
        this.perspectiveCamera.position.z = CAMERA_POSITION.z;
    }

    public getAspectRatio(width: number, height: number) {
        if (height !== 0) {
            return width / height;
        }
    }

    public setPositionPerspectiveCamera(object: any) {
        this.perspectiveCamera.position.x = object.position.x + perchPosition.x;
        this.perspectiveCamera.position.y = object.position.y + perchPosition.y;
        this.perspectiveCamera.position.z = object.position.z + perchPosition.z;
        this.perspectiveCamera.updateProjectionMatrix();
    }

    public setPositionOrthographicCamera(object: any) {
        this.orthographicCamera.position.x = object.position.x + this.offsetX;
        this.orthographicCamera.position.y = object.position.y + this.offsetY;
        this.orthographicCamera.position.z = object.position.z + this.offsetZ;
        this.orthographicCamera.updateProjectionMatrix();
    }

    public selectCamera(event: any): void {
        if (event.keyCode !== 67) { // 67 corresponding to 'C' in ASCII
            return;
        }

        this.currentView = this.currentView === View.PERSPECTIVE ? View.ORTHOGRAPHIC : View.PERSPECTIVE;

    }

    public cameraOnMoveWithObject(object: any) {
        this.setPositionPerspectiveCamera(object);
        this.perspectiveCamera.lookAt(object.position);
        this.perspectiveCamera.updateProjectionMatrix();
        this.setOrthographicCamera(object);
        this.orthographicCamera.lookAt(object.position);
        this.orthographicCamera.updateProjectionMatrix();
    }
}

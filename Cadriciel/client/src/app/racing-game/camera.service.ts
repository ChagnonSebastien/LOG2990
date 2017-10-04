import { Injectable } from '@angular/core';
import * as THREE from 'three';

// standard position of camera
const CAMERA_POSITION = new THREE.Vector3(0, 0, 1000);
const OFFSET = 500;
const perchPosition = new THREE.Vector3(-50, 100, 0);

@Injectable()
export class CameraService {
    private camera;

    private fieldOfView = 70;

    private nearClippingPane = 1;

    private farClippingPane = 1000;

    private perspectiveCamera;

    private orthographicCamera;

    public container: HTMLElement;

    public initialiseCamera(container: HTMLElement): void {
        this.orthographicCamera = this.setOrthographicCamera(container);
        this.perspectiveCamera = this.setPerspectiveCamera(container);
        this.camera = this.setPerspectiveCamera(container);
        this.orthographicCamera.position.set(CAMERA_POSITION);
        this.perspectiveCamera.position.set(CAMERA_POSITION);
        this.camera.position.x = CAMERA_POSITION.x;
        this.camera.position.y = CAMERA_POSITION.y;
        this.camera.position.z = CAMERA_POSITION.z;
        console.log(this.camera);
    }

    public setPerspectiveCamera(container: HTMLElement): THREE.PerspectiveCamera {
        const aspectRatio = this.getAspectRatio(container.clientWidth,
            container.clientHeight);
        const camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );

        return camera;
    }

    public getCamera(): any {
        return this.camera;
    }

    public setOrthographicCamera(container: HTMLElement): THREE.OrthographicCamera {
        const camera = new THREE.OrthographicCamera(
            - container.clientWidth / 2,
            container.clientWidth / 2,
            container.clientHeight / 2,
            - container.clientHeight / 2,
            0,
            50
        );
        return camera;
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
        this.orthographicCamera.position.x = object.position.x + OFFSET;
        this.orthographicCamera.position.y = object.position.y + OFFSET;
        this.orthographicCamera.position.z = object.position.z + OFFSET;
    }

    public selectCamera(event: any): void {
        // 67 corresponding to 'C' in ASCII
        if (this.camera.isOrthographicCamera && event.keyCode === 67) {
            this.camera = this.perspectiveCamera;
        } else if (this.camera.isPerspectiveCamera && event.keyCode === 67) {
            this.camera = this.orthographicCamera;
        }
    }

    public cameraOnMoveWithObject (object: any) {
        // this.perspectiveCamera.position.set(newCameraPosition);
        this.setPositionPerspectiveCamera(object);
        this.perspectiveCamera.lookAt(object.position);
        this.perspectiveCamera.updateProjectionMatrix();
        // this.orthographicCamera.position.set(newCameraPosition);
        this.setOrthographicCamera(object);
        this.perspectiveCamera.lookAt(object.position);
        this.orthographicCamera.updateProjectionMatrix();

        if (this.camera.isOrthographicCamera) {
            this.camera = this.orthographicCamera;
        } else if (this.camera.isPerspectiveCamera) {
            this.camera = this.perspectiveCamera;
        }
    }
}

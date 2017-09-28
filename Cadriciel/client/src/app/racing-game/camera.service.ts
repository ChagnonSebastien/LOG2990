import { Injectable } from '@angular/core';
import * as THREE from 'three';

// standard position of camera
const CAMERA_POSITION = new THREE.Vector3(0, 0, 400);

@Injectable()
export class CameraService {
    private camera;

    // private cameraZ = 400;

    private fieldOfView = 70;

    private nearClippingPane = 1;

    private farClippingPane = 1000;

    // private perspectiveCamera: THREE.PerspectiveCamera;

    // private orthographicCamera: THREE.OrthographicCamera;

    // private isPerspectiveCamera = false; // isOrthographicCamera

    public container: HTMLElement;

    public initialiseCamera(): void {
        this.camera = this.setOrthographicCamera();
        this.camera.position.set(CAMERA_POSITION);
    }

    public setPerspectiveCamera(): THREE.PerspectiveCamera {
        const aspectRatio = this.getAspectRatio(this.container.clientWidth,
            this.container.clientHeight);
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );

        return this.camera;
    }

    public setOrthographicCamera(): THREE.OrthographicCamera {
        this.camera = new THREE.OrthographicCamera(
            - this.container.clientWidth / 2,
            this.container.clientWidth / 2,
            this.container.clientHeight / 2,
            - this.container.clientHeight / 2,
            0,
            50
        );

        return this.camera;
    }

    public getAspectRatio(width: number, height: number) {
        return width / height;
    }

    public selectCamera(event: any): void {
        if (this.camera.isOrthographicCamera && event.keyCode === 67) {
            this.camera = this.setPerspectiveCamera();
        } else if (this.camera.isPerspectiveCamera && event.keyCode === 67) {
            this.camera = this.setOrthographicCamera();
        }
    }

    public cameraOnMoveWithObject (object: any) {
        const newCameraPosition = new THREE.Vector3(
            this.camera.position.x + object.position.x,
            this.camera.position.y + object.position.y,
            this.camera.position.z + object.position.z
        );
        this.camera.position.set(newCameraPosition);
        this.camera.lookAt(object.position);
        this.camera.updateProjectionMatrix();
    }
}

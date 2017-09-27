import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class CameraService {
    private camera;

    private cameraZ = 400;

    private fieldOfView = 70;

    private nearClippingPane = 1;

    private farClippingPane = 1000;

    private perspectiveCamera: THREE.PerspectiveCamera;

    private orthographicCamera: THREE.OrthographicCamera;

    private isPerspectiveCamera = false;

    public container: HTMLElement;

    public initialiseCamera(): void {
        this.perspectiveCamera = this.setPerspectiveCamera();
        this.orthographicCamera = this.setOrthographicCamera();
    }

    private setPerspectiveCamera(): THREE.PerspectiveCamera {
        const aspectRatio = this.getAspectRatio(this.container.clientWidth,
            this.container.clientHeight);
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );

        this.camera.position.z = this.cameraZ;

        return this.camera;
    }

    private setOrthographicCamera(): THREE.OrthographicCamera {
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

    private selectCamera(event: any): void {
        if (this.isPerspectiveCamera && event.keyCode === 67) {
            this.camera = this.orthographicCamera;
            this.isPerspectiveCamera = false;
        } else if (!this.isPerspectiveCamera && event.keyCode === 67) {
            this.camera = this.perspectiveCamera;
            this.isPerspectiveCamera = true;
        }
    }

    private cameraOnMoveWithObject (object: any) {
        this.camera.lookAt(object.position);
    }
}

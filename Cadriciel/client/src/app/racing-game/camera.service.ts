import { Injectable } from '@angular/core';
import * as THREE from 'three';

// standard position of camera
const perspectiveHeight = 2;
const orthographicHeight = 0;
const maximumPerspectiveDistance = 4;
const CAMERA_POSITION = new THREE.Vector3(0, 0, 100);
const perchPosition = new THREE.Vector3(10, 50, -75);

const orthographicFieldOfView = 10;
const orthographicNearClippingPane = 1;
const orthographicFarClippingPane = 1000;

const perspectiveFieldOfView = 70;
const perspectiveNearClippingPane = -1000;
const perspectiveFarClippingPane = 1000;

enum View { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {
    private sceneScale: number;

    private currentView = View.PERSPECTIVE;

    private perspectiveCamera: THREE.PerspectiveCamera;

    private orthographicCamera: THREE.OrthographicCamera;

    private objectToFollow: THREE.Mesh;

    public initializeCameras(container: HTMLElement, objectToFollow: THREE.Mesh): void {
        this.objectToFollow = objectToFollow;

        const aspectRatio = container.clientWidth / container.clientHeight;
        this.perspectiveCamera = this.instansiatePerspectiveCamera(aspectRatio);
        this.orthographicCamera = this.instansiateOrthographicCamera(aspectRatio);

        this.initializeCamerasPositions();
    }

    private instansiatePerspectiveCamera(aspectRatio: number): THREE.PerspectiveCamera {
        return new THREE.PerspectiveCamera(
            perspectiveFieldOfView,
            aspectRatio,
            perspectiveNearClippingPane,
            perspectiveFarClippingPane
        );
    }

    private instansiateOrthographicCamera(aspectRatio: number): THREE.OrthographicCamera {
        return new THREE.OrthographicCamera(
            this.sceneScale * orthographicFieldOfView / -2,
            this.sceneScale * orthographicFieldOfView / 2,
            this.sceneScale * orthographicFieldOfView / aspectRatio / 2,
            this.sceneScale * orthographicFieldOfView / aspectRatio / -2,
            orthographicNearClippingPane,
            orthographicFarClippingPane
        );
    }

    private initializeCamerasPositions() {
        this.perspectiveCamera.position.x = this.objectToFollow.position.x;
        this.perspectiveCamera.position.y = this.objectToFollow.position.y;
        this.perspectiveCamera.position.z = orthographicHeight;

        this.orthographicCamera.position.x = this.objectToFollow.position.x + (
            Math.cos(this.objectToFollow.rotation.z) * maximumPerspectiveDistance
        );
        this.orthographicCamera.position.y = this.objectToFollow.position.y + (
            Math.sin(this.objectToFollow.rotation.z) * maximumPerspectiveDistance
        );
        this.orthographicCamera.position.z = perspectiveHeight;
    }

    public getCamera(): THREE.Camera {
        return this.currentView === View.PERSPECTIVE ? this.perspectiveCamera : this.orthographicCamera;
    }

    private setPositionPerspectiveCamera(object: any) {
        this.perspectiveCamera.position.x = object.position.x + perchPosition.x;
        this.perspectiveCamera.position.y = object.position.y + perchPosition.y;
        this.perspectiveCamera.position.z = object.position.z + perchPosition.z;
        this.perspectiveCamera.updateProjectionMatrix();
    }

    private setPositionOrthographicCamera(object: any) {
        this.orthographicCamera.position.x = object.position.x;
        this.orthographicCamera.position.y = object.position.y;
        this.orthographicCamera.position.z = object.position.z + orthographicHeight;
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
        this.instansiateOrthographicCamera(object);
        this.orthographicCamera.lookAt(object.position);
        this.orthographicCamera.updateProjectionMatrix();
    }
}

import { Injectable } from '@angular/core';
import * as THREE from 'three';

// standard position of camera

const orthographicHeight = 10;
const orthographicFieldOfView = 10;
const orthographicNearClippingPane = 0;
const orthographicFarClippingPane = 2000;

const perspectiveHeight = 2;
const maximumPerspectiveDistance = 4;
const perspectiveFieldOfView = 70;
const perspectiveNearClippingPane = 0.01;
const perspectiveFarClippingPane = 4000;

const initialZoomLevel = 1;
const zoomChange = 0.05;

enum View { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {
    private sceneScale: number;

    private currentView = View.PERSPECTIVE;

    private perspectiveCamera: THREE.PerspectiveCamera;

    private orthographicCamera: THREE.OrthographicCamera;

    private objectToFollow: THREE.Mesh;

    private zoomLevel = initialZoomLevel;

    public initializeCameras(container: HTMLElement, objectToFollow: THREE.Mesh, sceneScale: number): void {
        this.objectToFollow = objectToFollow;
        this.sceneScale = sceneScale;

        const aspectRatio = container.clientWidth / container.clientHeight;
        this.perspectiveCamera = this.instansiatePerspectiveCamera(aspectRatio);
        this.orthographicCamera = this.instansiateOrthographicCamera(aspectRatio);

        this.initializeCamerasPositions();
    }

    private instansiatePerspectiveCamera(aspectRatio: number): THREE.PerspectiveCamera {
        return new THREE.PerspectiveCamera(
            perspectiveFieldOfView,
            aspectRatio,
            perspectiveNearClippingPane * this.sceneScale,
            perspectiveFarClippingPane * this.sceneScale
        );
    }

    private instansiateOrthographicCamera(aspectRatio: number): THREE.OrthographicCamera {
        const orthographicCamera = new THREE.OrthographicCamera(
            this.sceneScale * orthographicFieldOfView / -2,
            this.sceneScale * orthographicFieldOfView / 2,
            this.sceneScale * orthographicFieldOfView / aspectRatio / 2,
            this.sceneScale * orthographicFieldOfView / aspectRatio / -2,
            orthographicNearClippingPane * this.sceneScale,
            orthographicFarClippingPane * this.sceneScale
        );
        orthographicCamera.rotation.x = Math.PI / -2;
        return orthographicCamera;
    }

    private initializeCamerasPositions() {
        this.orthographicCamera.position.x = this.objectToFollow.position.x;
        this.orthographicCamera.position.y = orthographicHeight * this.sceneScale;
        this.orthographicCamera.position.z = this.objectToFollow.position.z;

        this.perspectiveCamera.position.x = this.objectToFollow.position.x + (
            Math.sin(this.objectToFollow.rotation.y) * maximumPerspectiveDistance * this.sceneScale
        );
        this.perspectiveCamera.position.y = this.objectToFollow.position.y + perspectiveHeight * this.sceneScale;
        this.perspectiveCamera.position.z = this.objectToFollow.position.z + (
            Math.cos(this.objectToFollow.rotation.y) * maximumPerspectiveDistance * this.sceneScale
        );
    }

    public getCamera(): THREE.Camera {
        return this.currentView === View.PERSPECTIVE ? this.perspectiveCamera : this.orthographicCamera;
    }

    public cameraOnMoveWithObject() {
        this.updatePerspectiveCameraPosition();
        this.updateOrthographicCameraPosition();
    }

    private updatePerspectiveCameraPosition() {
        const referencePosition = new THREE.Vector2(
            this.perspectiveCamera.position.x - this.objectToFollow.position.x,
            this.perspectiveCamera.position.z - this.objectToFollow.position.z
        );

        if ( referencePosition.length() > maximumPerspectiveDistance * this.sceneScale ) {
            referencePosition.clampLength(0, maximumPerspectiveDistance * this.sceneScale);

            this.perspectiveCamera.position.x = this.objectToFollow.position.x + referencePosition.x;
            this.perspectiveCamera.position.z = this.objectToFollow.position.z + referencePosition.y;
        }

        this.perspectiveCamera.lookAt(this.objectToFollow.position);
    }

    private updateOrthographicCameraPosition() {
        this.orthographicCamera.position.x = this.objectToFollow.position.x;
        this.orthographicCamera.position.z = this.objectToFollow.position.z;

        this.orthographicCamera.rotation.z = this.objectToFollow.rotation.y;
        this.perspectiveCamera.lookAt(this.objectToFollow.position);
    }

    public swapCamera(event: any): void {
        if (event.keyCode !== 67) { // 67 corresponding to 'C' in ASCII
            return;
        }

        this.currentView = this.currentView === View.PERSPECTIVE ? View.ORTHOGRAPHIC : View.PERSPECTIVE;
    }

    public zoomCamera(event: any): void {
        // 107 corresponding to '+' in ASCII
        // 109 corresponding to '-' in ASCII
        if (event.keyCode === 107) {
            this.zoomLevel += zoomChange;
        } else if (event.keyCode === 109) {
            this.zoomLevel -= zoomChange;
        }

        this.perspectiveCamera.zoom = this.zoomLevel;
        this.perspectiveCamera.updateProjectionMatrix();

        this.orthographicCamera.zoom = this.zoomLevel;
        this.orthographicCamera.updateProjectionMatrix();
    }

    public onResize(aspectRatio: number) {
        this.perspectiveCamera.aspect = aspectRatio;
        this.perspectiveCamera.updateProjectionMatrix();

        this.orthographicCamera.left = this.sceneScale * orthographicFieldOfView / -2;
        this.orthographicCamera.right = this.sceneScale * orthographicFieldOfView / 2;
        this.orthographicCamera.top = this.sceneScale * orthographicFieldOfView / aspectRatio / 2;
        this.orthographicCamera.bottom = this.sceneScale * orthographicFieldOfView / aspectRatio / -2;
        this.orthographicCamera.updateProjectionMatrix();
    }
}

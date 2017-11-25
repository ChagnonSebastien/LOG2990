import { CommandsService, CommandEvent, PlayerCommand } from './events/commands.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import * as SETTINGS from './settings';

// standard position of camera

const orthographicHeight = 256 - 64;
const orthographicFieldOfView = 80;
const orthographicNearClippingPane = 0;
const orthographicFarClippingPane = 256;

const perspectiveHeight = 8;
const maximumPerspectiveDistance = 16;
const perspectiveFieldOfView = 70;
const perspectiveNearClippingPane = 1;
const perspectiveFarClippingPane = 4000;

const initialZoomLevel = 1;
const zoomChange = 0.05;

enum View { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {
    private currentView: View;

    private perspectiveCamera: THREE.PerspectiveCamera;

    private orthographicCamera: THREE.OrthographicCamera;

    private objectToFollow: THREE.Mesh;

    private zoomLevel: number;

    constructor(commandService: CommandsService) {
        this.currentView = View.PERSPECTIVE;
        this.zoomLevel = initialZoomLevel;

        commandService.getCommandKeyUpObservable().subscribe((event: CommandEvent) => {
            switch (event.getCommand()) {
                case PlayerCommand.ZOOM_IN:
                    this.zoomLevel += zoomChange;
                    this.updateZoom();
                break;
                case PlayerCommand.ZOOM_OUT:
                    this.zoomLevel -= zoomChange;
                    this.updateZoom();
                break;
                case PlayerCommand.TOOGLE_CAMERA_VIEW:
                this.currentView = this.currentView === View.PERSPECTIVE ? View.ORTHOGRAPHIC : View.PERSPECTIVE;
                break;
            }
        });
    }

    public initialize(container: HTMLElement): void {
        const aspectRatio = container.clientWidth / container.clientHeight;
        this.perspectiveCamera = this.instansiatePerspectiveCamera(aspectRatio);
        this.orthographicCamera = this.instansiateOrthographicCamera(aspectRatio);
    }

    public initializeCameras(objectToFollow: THREE.Mesh): void {
        this.objectToFollow = objectToFollow;
        this.initializeCamerasPositions();
    }

    private instansiatePerspectiveCamera(aspectRatio: number): THREE.PerspectiveCamera {
        return new THREE.PerspectiveCamera(
            perspectiveFieldOfView,
            aspectRatio,
            perspectiveNearClippingPane * SETTINGS.SCENE_SCALE,
            perspectiveFarClippingPane * SETTINGS.SCENE_SCALE
        );
    }

    private instansiateOrthographicCamera(aspectRatio: number): THREE.OrthographicCamera {
        const orthographicCamera = new THREE.OrthographicCamera(
            SETTINGS.SCENE_SCALE * orthographicFieldOfView / -2,
            SETTINGS.SCENE_SCALE * orthographicFieldOfView / 2,
            SETTINGS.SCENE_SCALE * orthographicFieldOfView / aspectRatio / 2,
            SETTINGS.SCENE_SCALE * orthographicFieldOfView / aspectRatio / -2,
            orthographicNearClippingPane * SETTINGS.SCENE_SCALE,
            orthographicFarClippingPane * SETTINGS.SCENE_SCALE
        );
        orthographicCamera.rotation.x = Math.PI / -2;
        return orthographicCamera;
    }

    private initializeCamerasPositions() {
        this.orthographicCamera.position.x = this.objectToFollow.position.x;
        this.orthographicCamera.position.y = orthographicHeight * SETTINGS.SCENE_SCALE;
        this.orthographicCamera.position.z = this.objectToFollow.position.z;

        this.perspectiveCamera.position.x = this.objectToFollow.position.x + (
            Math.sin(this.objectToFollow.rotation.y) * maximumPerspectiveDistance * SETTINGS.SCENE_SCALE
        );
        this.perspectiveCamera.position.y = this.objectToFollow.position.y + perspectiveHeight * SETTINGS.SCENE_SCALE;
        this.perspectiveCamera.position.z = this.objectToFollow.position.z + (
            Math.cos(this.objectToFollow.rotation.y) * maximumPerspectiveDistance * SETTINGS.SCENE_SCALE
        );
    }

    public getCamera(): THREE.Camera {
        return this.currentView === View.PERSPECTIVE ? this.perspectiveCamera : this.orthographicCamera;
    }

    public rearViewCamera(): THREE.Camera {
       let rearViewCamera: THREE.Camera;
       rearViewCamera = this.perspectiveCamera;
        // this.perspectiveCamera.lookAt( this.objectToFollow.position);
        return rearViewCamera;
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

        if ( referencePosition.length() > maximumPerspectiveDistance * SETTINGS.SCENE_SCALE ) {
            referencePosition.clampLength(0, maximumPerspectiveDistance * SETTINGS.SCENE_SCALE);

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

    public updateZoom(): void {
        this.perspectiveCamera.zoom = this.zoomLevel;
        this.perspectiveCamera.updateProjectionMatrix();

        this.orthographicCamera.zoom = this.zoomLevel;
        this.orthographicCamera.updateProjectionMatrix();
    }

    public onResize(aspectRatio: number) {
        this.perspectiveCamera.aspect = aspectRatio;
        this.perspectiveCamera.updateProjectionMatrix();

        this.orthographicCamera.left = SETTINGS.SCENE_SCALE * orthographicFieldOfView / -2;
        this.orthographicCamera.right = SETTINGS.SCENE_SCALE * orthographicFieldOfView / 2;
        this.orthographicCamera.top = SETTINGS.SCENE_SCALE * orthographicFieldOfView / aspectRatio / 2;
        this.orthographicCamera.bottom = SETTINGS.SCENE_SCALE * orthographicFieldOfView / aspectRatio / -2;
        this.orthographicCamera.updateProjectionMatrix();
    }
}

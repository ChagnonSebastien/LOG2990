import { Injectable } from '@angular/core';
import { PerspectiveCamera, OrthographicCamera, Mesh, Vector2, Camera } from 'three';
import { Settings } from './settings';

enum View { PERSPECTIVE, ORTHOGRAPHIC }

@Injectable()
export class CameraService {
    private currentView: View;

    public perspectiveCamera: PerspectiveCamera;

    public orthographicCamera: OrthographicCamera;

    public objectToFollow: Mesh;

    private zoomLevel: number;

    constructor() {
        this.currentView = View.PERSPECTIVE;
        this.zoomLevel = Settings.CAMERA_INITIAL_ZOOM;
    }

    public zoomIn(): void {
        this.zoomLevel += Settings.CAMERA_ZOOM_CHANGE;
        this.updateZoom();
    }

    public zoomOut(): void {
        this.zoomLevel -= Settings.CAMERA_ZOOM_CHANGE;
        this.updateZoom();
    }

    public toggleCamera(): void {
        this.currentView = this.currentView === View.PERSPECTIVE ? View.ORTHOGRAPHIC : View.PERSPECTIVE;
    }

    public initialize(container: HTMLElement): void {
        const aspectRatio = container.clientWidth / container.clientHeight;
        this.perspectiveCamera = this.instansiatePerspectiveCamera(aspectRatio);
        this.orthographicCamera = this.instansiateOrthographicCamera(aspectRatio);
    }

    public initializeCameras(objectToFollow: Mesh): void {
        this.objectToFollow = objectToFollow;
        this.initializeCamerasPositions();
    }

    private instansiatePerspectiveCamera(aspectRatio: number): PerspectiveCamera {
        return new PerspectiveCamera(
            Settings.CAMERA_PERSPECTIVE_FIELD_OF_VIEW,
            aspectRatio,
            Settings.CAMERA_PERSPECTIVE_NEAR_CLIPPING_PANE * Settings.SCENE_SCALE,
            Settings.CAMERA_PERSPECTIVE_FAR_CLIPPING_PANE * Settings.SCENE_SCALE
        );
    }

    private instansiateOrthographicCamera(aspectRatio: number): OrthographicCamera {
        const orthographicCamera = new OrthographicCamera(
            Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / -2,
            Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / 2,
            Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / aspectRatio / 2,
            Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / aspectRatio / -2,
            Settings.CAMERA_ORTHOGRAPHIC_NEAR_CLIPPING_PANE * Settings.SCENE_SCALE,
            Settings.CAMERA_ORTHOGRAPHIC_FAR_CLIPPING_PANE * Settings.SCENE_SCALE
        );
        orthographicCamera.rotation.x = Math.PI / -2;
        return orthographicCamera;
    }

    private initializeCamerasPositions(): void {
        this.orthographicCamera.position.x = this.objectToFollow.position.x;
        this.orthographicCamera.position.y = Settings.CAMERA_ORTHOGRAPHIC_HEIGHT * Settings.SCENE_SCALE;
        this.orthographicCamera.position.z = this.objectToFollow.position.z;

        this.perspectiveCamera.position.x = this.objectToFollow.position.x + (
            Math.sin(this.objectToFollow.rotation.y) * Settings.CAMERA_PERSPECTIVE_MAXIMUM_DISTANCE * Settings.SCENE_SCALE
        );
        this.perspectiveCamera.position.y = this.objectToFollow.position.y + Settings.CAMERA_PERSPECTIVE_HEIGHT * Settings.SCENE_SCALE;
        this.perspectiveCamera.position.z = this.objectToFollow.position.z + (
            Math.cos(this.objectToFollow.rotation.y) * Settings.CAMERA_PERSPECTIVE_MAXIMUM_DISTANCE * Settings.SCENE_SCALE
        );
    }

    public getCamera(): Camera {
        return this.currentView === View.PERSPECTIVE ? this.perspectiveCamera : this.orthographicCamera;
    }

    public cameraOnMoveWithObject(): void {
        this.updatePerspectiveCameraPosition();
        this.updateOrthographicCameraPosition();
    }

    private updatePerspectiveCameraPosition(): void {
        const referencePosition = new Vector2(
            this.perspectiveCamera.position.x - this.objectToFollow.position.x,
            this.perspectiveCamera.position.z - this.objectToFollow.position.z
        );

        if ( referencePosition.length() > Settings.CAMERA_PERSPECTIVE_MAXIMUM_DISTANCE * Settings.SCENE_SCALE ) {
            referencePosition.clampLength(0, Settings.CAMERA_PERSPECTIVE_MAXIMUM_DISTANCE * Settings.SCENE_SCALE);

            this.perspectiveCamera.position.x = this.objectToFollow.position.x + referencePosition.x;
            this.perspectiveCamera.position.z = this.objectToFollow.position.z + referencePosition.y;
        }

        this.perspectiveCamera.lookAt(this.objectToFollow.position);
    }

    private updateOrthographicCameraPosition(): void {
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

    public onResize(aspectRatio: number): void {
        this.perspectiveCamera.aspect = aspectRatio;
        this.perspectiveCamera.updateProjectionMatrix();

        this.orthographicCamera.left = Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / -2;
        this.orthographicCamera.right = Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / 2;
        this.orthographicCamera.top = Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / aspectRatio / 2;
        this.orthographicCamera.bottom = Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / aspectRatio / -2;
        this.orthographicCamera.updateProjectionMatrix();
    }
}

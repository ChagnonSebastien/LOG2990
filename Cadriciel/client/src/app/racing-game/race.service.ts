import { CameraService } from './camera.service';
import { Injectable } from '@angular/core';
import { Settings } from './settings';
import * as THREE from 'three';

@Injectable()
export class RaceService {
    public sceneHud: THREE.Scene;
    public cameraHud: THREE.OrthographicCamera;
    public hudCanvas: HTMLCanvasElement;
    public hudBitmap: CanvasRenderingContext2D;
    public hudTexture: THREE.Texture;

    constructor(private cameraService: CameraService) {
        this.initializeHud();
    }

    private initializeHud() {
        this.initializeCanva();
        this.initializeBitmap();
        this.sceneHud = new THREE.Scene();
        this.initializeCamera();
        this.initializePlane();
        this.initializeRaceInformations();
    }

    private initializeCanva(): void {
        this.hudCanvas = document.createElement('canvas');
        this.hudCanvas.width = window.innerWidth;
        this.hudCanvas.height = window.innerHeight;
    }

    private initializeBitmap(): void {
        this.hudBitmap = this.hudCanvas.getContext('2d');
        this.hudBitmap.font = Settings.HUD_BITMAP_FONT;
        this.hudBitmap.textAlign = Settings.HUD_BITMAP_TEXT_ALIGN;
        this.hudBitmap.fillStyle = Settings.HUD_BITMAP_FILLSTYLE;
        this.hudBitmap.fillText(Settings.HUD_START_LAP_COUNTDOWN,
            this.hudCanvas.width * Settings.HUD_TEXT_WIDTH_OFFSET, this.hudCanvas.height * Settings.HUD_TEXT_HEIGHT_OFFSET);
    }

    private initializeCamera(): void {
        const aspectRatio = this.hudCanvas.width / this.hudCanvas.height;
        this.cameraHud = this.cameraService.instansiateOrthographicCamera(aspectRatio);
        this.cameraHud.rotation.x = 0;
    }

    private initializePlane(): void {
        this.hudTexture = new THREE.Texture(this.hudCanvas) ;
        this.hudTexture.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial( {map: this.hudTexture} );
        material.transparent = true;
        const planeGeometry = new THREE.PlaneGeometry( this.hudCanvas.width, this.hudCanvas.height);
        const plane = new THREE.Mesh( planeGeometry, material );
        this.sceneHud.add( plane );
    }

    private initializeRaceInformations(): void {
        const raceInformationsGeometry = new THREE.PlaneGeometry(this.hudCanvas.width * Settings.HUD_RACE_INFO_GEOMETRY_WIDTH_RATIO,
            this.hudCanvas.width * Settings.HUD_RACE_INFO_GEOMETRY_HEIGHT_RATIO);
        const raceInformationsMaterial = new THREE.MeshBasicMaterial({color: Settings.RED, side: THREE.DoubleSide});

        // laps to go
        const lapMesh = new THREE.Mesh(raceInformationsGeometry, raceInformationsMaterial);
        lapMesh.position.x = -this.hudCanvas.width * Settings.HUD_RACE_INFO_BOX_LEFT_OFFSET;
        this.sceneHud.add(lapMesh);

        // current position
        const positionMesh = new THREE.Mesh(raceInformationsGeometry, raceInformationsMaterial);
        positionMesh.position.x = -this.hudCanvas.width * Settings.HUD_RACE_INFO_BOX_RIGHT_OFFSET;
        this.sceneHud.add(positionMesh);

        // lap time
        const lapTimeMesh = new THREE.Mesh(raceInformationsGeometry, raceInformationsMaterial);
        lapTimeMesh.position.x = this.hudCanvas.width * Settings.HUD_RACE_INFO_BOX_RIGHT_OFFSET;
        this.sceneHud.add(lapTimeMesh);

        // race time
        const raceTimeMesh = new THREE.Mesh(raceInformationsGeometry, raceInformationsMaterial);
        raceTimeMesh.position.x = this.hudCanvas.width * Settings.HUD_RACE_INFO_BOX_LEFT_OFFSET;
        this.sceneHud.add(raceTimeMesh);
    }


}

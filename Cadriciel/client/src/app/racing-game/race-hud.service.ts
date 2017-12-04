import { CameraService } from './camera.service';
import { Injectable } from '@angular/core';
import { Settings } from './settings';
import { Observable } from 'rxjs/Rx';
import * as THREE from 'three';

@Injectable()
export class RaceHudService {
    public sceneHud: THREE.Scene;
    public cameraHud: THREE.OrthographicCamera;
    public hudCanvas: HTMLCanvasElement;
    public hudBitmap: CanvasRenderingContext2D;
    public hudTexture: THREE.Texture;
    public timer: number;
    public currentLap: number;
    public lapTimer: number;
    private raceEnded: boolean;

    constructor(private cameraService: CameraService) {
        this.timer = 0.0;
        this.currentLap = 0;
        this.lapTimer = 0.0;
        this.raceEnded = false;
        this.initializeHud();
    }

    private initializeHud(): void {
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
        this.updateTotalTimer();
        this.updateLapTimer();
    }

    private initializeCamera(): void {
        const aspectRatio = this.hudCanvas.width / this.hudCanvas.height;
        this.cameraHud = this.cameraService.instansiateOrthographicCamera(aspectRatio);
        this.cameraHud.rotation.x = 0; // reset camera rotation because instansiateOrthographicCamera sets it to PI / -2
    }

    private initializePlane(): void {
        this.hudTexture = new THREE.Texture(this.hudCanvas);
        this.hudTexture.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial({ map: this.hudTexture });
        material.transparent = true;
        const planeGeometry = new THREE.PlaneGeometry(this.hudCanvas.width, this.hudCanvas.height);
        const plane = new THREE.Mesh(planeGeometry, material);
        this.sceneHud.add(plane);
    }

    private initializeRaceInformations(): void {
        const raceInformationsGeometry = new THREE.PlaneGeometry(this.hudCanvas.width * Settings.HUD_RACE_INFO_GEOMETRY_WIDTH_RATIO,
            this.hudCanvas.width * Settings.HUD_RACE_INFO_GEOMETRY_HEIGHT_RATIO);
        const raceInformationsMaterial = new THREE.MeshBasicMaterial({ color: Settings.RED, side: THREE.DoubleSide });

        this.initializeLapMesh(raceInformationsGeometry, raceInformationsMaterial);
        this.initializePositionMesh(raceInformationsGeometry, raceInformationsMaterial);
        this.initializeLapTimeMesh(raceInformationsGeometry, raceInformationsMaterial);
        this.initializeRaceTimeMesh(raceInformationsGeometry, raceInformationsMaterial);
    }

    private initializeLapMesh(geometry: THREE.PlaneGeometry, material: THREE.MeshBasicMaterial): void {
        const lapMesh = new THREE.Mesh(geometry, material);
        lapMesh.position.x = -this.hudCanvas.width * Settings.HUD_RACE_INFO_BOX_LEFT_OFFSET;
        this.sceneHud.add(lapMesh);
    }

    private initializePositionMesh(geometry: THREE.PlaneGeometry, material: THREE.MeshBasicMaterial): void {
        const positionMesh = new THREE.Mesh(geometry, material);
        positionMesh.position.x = -this.hudCanvas.width * Settings.HUD_RACE_INFO_BOX_RIGHT_OFFSET;
        this.sceneHud.add(positionMesh);
    }

    private initializeLapTimeMesh(geometry: THREE.PlaneGeometry, material: THREE.MeshBasicMaterial): void {
        const lapTimeMesh = new THREE.Mesh(geometry, material);
        lapTimeMesh.position.x = this.hudCanvas.width * Settings.HUD_RACE_INFO_BOX_RIGHT_OFFSET;
        this.sceneHud.add(lapTimeMesh);
    }

    private initializeRaceTimeMesh(geometry: THREE.PlaneGeometry, material: THREE.MeshBasicMaterial): void {
        const raceTimeMesh = new THREE.Mesh(geometry, material);
        raceTimeMesh.position.x = this.hudCanvas.width * Settings.HUD_RACE_INFO_BOX_LEFT_OFFSET;
        this.sceneHud.add(raceTimeMesh);
    }

    public updateHud(lap: number): void {
        if (!this.raceEnded) {
            this.hudBitmap.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
            this.updateLaps();
            this.hudTexture.needsUpdate = true;
            this.updateTotalTimer();
            this.hudTexture.needsUpdate = true;
            this.updateLapTimer();
            this.hudTexture.needsUpdate = true;
            this.currentLap = lap;
        }
    }

    public startTimer(): void {
        const timer = Observable.timer(0, 10).map(() => this.timer = this.timer + 0.01);
        timer.subscribe((time: number) => {
            this.lapTimer = this.lapTimer + 0.01;
            this.updateHud(this.currentLap);
        });
    }

    public resetLapTimer(): void {
        this.lapTimer = 0;
    }

    public stopTimers(): void {
        this.raceEnded = true;
        this.currentLap++;
        this.hudBitmap.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
        this.updateLaps();
        this.updateTotalTimer();
        this.updateLapTimer();
    }

    private updateLaps(): void {
        this.hudBitmap.fillText(this.currentLap.toString() + '/' + Settings.TOTAL_LAPS.toString(),
            this.hudCanvas.width * Settings.HUD_TEXT_WIDTH_OFFSET,
            this.hudCanvas.height * Settings.HUD_TEXT_HEIGHT_OFFSET
        );
    }

    private updateTotalTimer(): void {
        this.hudBitmap.fillText(this.timer.toFixed(2).toString(),
            this.hudCanvas.width * Settings.HUD_TEXT_WIDTH_OFFSET * 6.5, this.hudCanvas.height * Settings.HUD_TEXT_HEIGHT_OFFSET
        );
    }

    private updateLapTimer(): void {
        this.hudBitmap.fillText(this.lapTimer.toFixed(2).toString(),
            this.hudCanvas.width * Settings.HUD_TEXT_WIDTH_OFFSET * 9.0, this.hudCanvas.height * Settings.HUD_TEXT_HEIGHT_OFFSET
        );
    }

}

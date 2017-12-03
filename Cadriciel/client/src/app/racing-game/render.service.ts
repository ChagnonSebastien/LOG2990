import { RaceHudService } from './race-hud.service';
import { FrameEventService, FrameEvent } from './events/frame-event.service';
import { Track } from './track';
import { TerrainGenerationService } from './terrain-generation/terrain-generation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { CameraService } from './camera.service';
import { RacingSceneService } from './racing-scene.service';
import { Settings } from './settings';
import { RearView } from './rear-view';

@Injectable()
export class RenderService {
    public container: HTMLElement;
    private stats: Stats;
    private renderer: THREE.WebGLRenderer;

    public activeRearView: boolean;

    constructor(
        private cameraService: CameraService,
        private terrainGenerationService: TerrainGenerationService,
        private sceneService: RacingSceneService,
        private frameEventService: FrameEventService,
        private raceService: RaceHudService
    ) { }

    public loadTrack(track) {
        this.terrainGenerationService.generate(this.sceneService.scene, track, this.sceneService.textureSky);
    }

    public swapRearWiew() {
        this.activeRearView = !this.activeRearView;
    }

    public startRenderingLoop() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.autoClear = false;
        this.render();
    }

    private renderGame(): void {
        this.renderer.clear();
        this.renderer.setViewport(0, 0, this.container.clientWidth, this.container.clientHeight * Settings.HUD_HEIGHT_RATIO);
        this.renderer.render(this.sceneService.scene, this.cameraService.getCamera());
    }

    private renderHud(): void {
        this.renderer.clearDepth();
        this.renderer.setViewport(0, this.container.clientHeight * Settings.HUD_HEIGHT_RATIO,
            this.container.clientWidth, this.container.clientHeight * Settings.HUD_INVERSE_HEIGHT_RATIO);
        this.renderer.render(this.raceService.sceneHud, this.raceService.cameraHud);
    }

    private render() {
        requestAnimationFrame(() => this.render());
        this.renderer.enableScissorTest(false);
        this.cameraService.cameraOnMoveWithObject();

        this.renderer.setViewport(0, 0, this.container.clientWidth, this.container.clientHeight);
        this.renderer.setScissor(0, 0, this.container.clientWidth, this.container.clientHeight);
        this.renderer.setScissorTest(true);

        this.renderer.render(this.sceneService.scene, this.cameraService.getCamera());

        this.frameEventService.sendFrameEvent(new FrameEvent());
        this.renderGame();
        this.renderHud();
        this.stats.update();

        if (this.activeRearView === true) {
            this.rearViewRender();
        }

    }

    public rearViewRender() {
        this.cameraService.rearCamera = new RearView(this.sceneService.scene, this.renderer);
        this.cameraService.rearViewCam();
    }

    private initStats() {
        this.stats = new Stats();
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.top = '64px';
        this.container.appendChild(this.stats.dom);
    }

    public onResize() {
        const aspectRatio = this.container.clientWidth / this.container.clientHeight;
        this.cameraService.onResize(aspectRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public async initialize(container: HTMLElement, track: Track): Promise<void> {
        this.container = container;
        this.initStats();
        this.loadTrack(track);
    }
}

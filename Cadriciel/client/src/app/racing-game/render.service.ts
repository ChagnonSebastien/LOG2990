import { RaceService } from './race.service';
import { FrameEventService, FrameEvent } from './events/frame-event.service';
import { Track } from './track';
import { TerrainGenerationService } from './terrain-generation/terrain-generation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { CameraService } from './camera.service';
import { RacingSceneService } from './racing-scene.service';

@Injectable()
export class RenderService {
    public container: HTMLElement;

    private stats: Stats;

    private renderer: THREE.WebGLRenderer;

    constructor(
        private cameraService: CameraService,
        private terrainGenerationService: TerrainGenerationService,
        private sceneService: RacingSceneService,
        private frameEventService: FrameEventService,
        private raceService: RaceService
    ) {}

    public loadTrack(track) {
        this.terrainGenerationService.generate(this.sceneService.scene, track, this.sceneService.textureSky);
    }

    public startRenderingLoop() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.autoClear = false; // to render second scene
        this.render();
    }

    private render() {
        requestAnimationFrame(() => this.render());
        this.frameEventService.sendFrameEvent(new FrameEvent());

        this.renderer.clear();
        this.renderer.setViewport(0, 0, 1866, 1186 / 2);
        this.renderer.render(this.sceneService.scene, this.cameraService.getCamera());

        this.renderer.clearDepth();
        this.renderer.setViewport(0, 1186 / 2, 1866, 1186 / 2);
        this.renderer.render(this.raceService.sceneHud, this.raceService.cameraHud);
        this.stats.update();
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

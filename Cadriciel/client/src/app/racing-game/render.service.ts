import { SceneService } from './scene.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Track } from './track';
import { TerrainGenerationService } from './terrain-generation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { CameraService } from './camera.service';
import { CommandsService, CommandEvent, PlayerCommand } from './events/commands.service';
import { VehicleService } from './vehicle.service';

@Injectable()
export class RenderService {
    public frame: BehaviorSubject<number>;

    public container: HTMLElement;

    private stats: Stats;

    private renderer: THREE.WebGLRenderer;

    constructor(
        private cameraService: CameraService,
        private terrainGenerationService: TerrainGenerationService,
        commandsService: CommandsService,
        private vehiculeService: VehicleService,
        private sceneService: SceneService
    ) {
        this.frame = new BehaviorSubject(0);
        commandsService.getCommandKeyDownObservable().subscribe((event: CommandEvent) => {
            if (event.getCommand() === PlayerCommand.TOGGLE_NIGHT_MODE) {
                this.sceneService.toggleNightMode();
            }
        });
    }

    public animateVehicule() {
        this.vehiculeService.moveVehicle();
    }

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
        this.render();
    }

    private render() {
        requestAnimationFrame(() => this.render());
        this.frame.next(this.frame.value + 1);
        this.cameraService.cameraOnMoveWithObject();
        this.renderer.render(this.sceneService.scene, this.cameraService.getCamera());
        this.animateVehicule();
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

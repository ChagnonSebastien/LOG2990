import { Track } from './track';
import { TerrainGenerationService } from './terrain-generation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { CameraService } from './camera.service';
import { CommandsService, CommandEvent, PlayerCommand } from './events/commands.service';
import { VehicleService } from './vehicle.service';
import { Light } from './light';

@Injectable()
export class RenderService {

    private scale: number;

    public container: HTMLElement;

    private stats: Stats;

    private renderer: THREE.WebGLRenderer;

    public scene: THREE.Scene;

    private textureSky: THREE.Texture;

    private light: Light;

    constructor(
        private cameraService: CameraService,
        private terrainGenerationService: TerrainGenerationService,
        commandsService: CommandsService,
        private vehiculeService: VehicleService,
    ) {
        commandsService.getCommandKeyDownObservable().subscribe((event: CommandEvent) => {
            if (event.getCommand() === PlayerCommand.TOGGLE_NIGHT_MODE) {
                this.light.dirLight.visible = !this.light.dirLight.visible;
            }
        });
    }

    public animateVehicule() {
        this.vehiculeService.moveVehicle();
    }

    protected createScene() {
        this.scene = new THREE.Scene();
        this.light = new Light();
        this.createSkyBox();
        this.scene.add(this.light.hemiLight);
        this.scene.add(this.light.dirLight);
    }

    private createSkyBox() {
        const url = '../../assets/images/skybox/';
        const images = [url + 'xpos.png', url + 'xneg.png',
        url + 'ypos.png', url + 'yneg.png',
        url + 'zpos.png', url + 'zneg.png'];
        this.textureSky = THREE.ImageUtils.loadTextureCube(images);
        const shader = THREE.ShaderLib['cube'];
        shader.uniforms['tCube'].value = this.textureSky;
        const material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        const skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000), material);
        material.needsUpdate = true;
        this.scene.add(skyboxMesh);
    }

    public loadTrack(track) {
        this.terrainGenerationService.generate(this.scene, this.scale, track, this.textureSky);
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
        this.cameraService.cameraOnMoveWithObject();
        this.renderer.render(this.scene, this.cameraService.getCamera());
        this.animateVehicule();
        this.stats.update();
    }

    protected initStats() {
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

    public async initialize(container: HTMLElement, track: Track, scale: number): Promise<void> {
        this.scale = scale;
        this.container = container;
        this.createScene();
        this.initStats();
        this.loadTrack(track);
    }
}

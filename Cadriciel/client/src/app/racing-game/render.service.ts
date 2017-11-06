import { Track } from './track';
import { TerrainGenerationService } from './terrain-generation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { CameraService } from './camera.service';
import { RacingGameService } from './racing-game.service';

const scale = 100;

@Injectable()
export class RenderService {

    private container: HTMLElement;

    private stats: Stats;

    private renderer: THREE.WebGLRenderer;

    public scene: THREE.Scene;

    private textureSky: THREE.Texture;

    constructor(
        private cameraService: CameraService,
        private racingGameService: RacingGameService,
        private terrainGenerationService: TerrainGenerationService,
    ) {
    }

    private createScene() {
        this.scene = new THREE.Scene();
        this.createSkyBox();
        this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.4));
        const dirLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        dirLight.position.set( 200, 500, 100 );
        dirLight.rotation.y = Math.PI / 4 ;
        dirLight.rotation.x = Math.PI / 4 ;
        dirLight.castShadow = true;
        dirLight.shadow.camera.near = 1;
        dirLight.shadow.camera.far = 1000;
        dirLight.shadow.camera.right = 1000;
        dirLight.shadow.camera.left = - 1000;
        dirLight.shadow.camera.top	= 1000;
        dirLight.shadow.camera.bottom = - 1000;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add( dirLight );
    }

    public createSkyBox() {
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
        const skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000), material);
        material.needsUpdate = true;
        this.scene.add(skyboxMesh);
    }

    public loadTrack(track) {
        this.terrainGenerationService.generate(this.scene, 25, track, this.textureSky);
    }

    public eventsList(event: any): void {
        this.cameraService.swapCamera(event);
        this.cameraService.zoomCamera(event);
    }

    private startRenderingLoop() {
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

    public async initialize(container: HTMLElement, track: Track) {
        this.container = container;
        this.createScene();
        await this.addVehicles();
        this.initStats();
        this.startRenderingLoop();
    }

    public async addVehicles(): Promise<void> {
        const mainVehicle = await this.racingGameService.initializeMainVehicle();
        this.scene.add(mainVehicle.vehicle);
        this.cameraService.initializeCameras(this.container, mainVehicle.vehicle, scale);
        const opponentsVehicles = await this.racingGameService.initializeOpponentsVehicles();

        for (let i = 0; i < opponentsVehicles.length; i++) {
            this.scene.add(opponentsVehicles[i].vehicle);
        }

        return new Promise<void>(resolve => {
            resolve();
        });
    }

}

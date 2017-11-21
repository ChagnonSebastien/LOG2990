import { Track } from './track';
import { TerrainGenerationService } from './terrain-generation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { CameraService } from './camera.service';
import { CommandsService } from './commands.service';
import { Subscription } from 'rxjs/Subscription';
import { VehicleService } from './vehicle.service';

@Injectable()
export class RenderService {

    private scale: number;

    public container: HTMLElement;

    private stats: Stats;

    private renderer: THREE.WebGLRenderer;

    public scene: THREE.Scene;

    private textureSky: THREE.Texture;

    private subscription: Subscription;

    private event: any;

    private keyPressed = false;

    private hemiLight: THREE.HemisphereLight;

    private dirLight: THREE.DirectionalLight;

    constructor(
        private cameraService: CameraService,
        private terrainGenerationService: TerrainGenerationService,
        private commandsService: CommandsService,
        private vehiculeService: VehicleService
    ) {
        this.subscription = this.commandsService.getKeyDownEvent()
        .subscribe(event => {
            this.event = event;
            this.keyPressed = true;
            if (this.event.keyCode === 78) {
                this.dirLight.visible = !this.dirLight.visible;
            }
        });
    }

    public animateVehicule() {
        this.vehiculeService.moveVehicle();
    }

    private createHemisphereLight() {
        this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.2);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 7500, 0);
        this.scene.add(this.hemiLight);
    }

    private createDirectionalLight() {
        this.dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.dirLight.color.setHSL(0.1, 1, 0.95);
        this.dirLight.position.set(-6000, 7500, 6000);
        this.dirLight.position.multiplyScalar(30);
        this.scene.add(this.dirLight);
    }

    protected createScene() {
        this.scene = new THREE.Scene();
        this.createSkyBox();
        this.createHemisphereLight();
        this.createDirectionalLight();
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.left = -50;
        this.dirLight.shadow.camera.right = 50;
        this.dirLight.shadow.camera.top = 50;
        this.dirLight.shadow.camera.bottom = -50;
        this.dirLight.shadow.camera.far = 3500;
        this.dirLight.shadow.bias = -0.0001;
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
        const skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000), material);
        material.needsUpdate = true;
        this.scene.add(skyboxMesh);
    }

    public loadTrack(track) {
        this.terrainGenerationService.generate(this.scene, this.scale, track, this.textureSky);
    }

    public eventsList(): void {
        if (this.keyPressed) {
            this.cameraService.swapCamera(this.event);
            this.cameraService.zoomCamera(this.event);
            this.keyPressed = false;
        }
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
        this.eventsList();
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

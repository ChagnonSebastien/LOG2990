import { Track } from './track';
import { TerrainGenerationService } from './terrain-generation.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');
import { CameraService } from './camera.service';

@Injectable()
export class RenderService {

    private container: HTMLElement;

    private camera: THREE.PerspectiveCamera;

    private stats: Stats;

    private cube: THREE.Mesh;

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    public rotationSpeedX = 0.005;

    public rotationSpeedY = 0.01;

    public view;

    public inc = -0.01;

    constructor(private cameraService: CameraService, private terrainGeneration: TerrainGenerationService) {
    }

    private animateCube() {
        this.cube.rotation.x += this.rotationSpeedX;
        this.cube.rotation.y += this.rotationSpeedY;
        // this.cube.position.z += 5;
    }

    private createCube() {
        const geometry = new THREE.BoxGeometry(20, 20, 20);

        for (let i = 0; i < geometry.faces.length; i += 2) {
            const hex = Math.random() * 0xffffff;
            geometry.faces[i].color.setHex(hex);
            geometry.faces[i + 1].color.setHex(hex);
        }

        const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    private createScene(track: Track) {
        this.scene = new THREE.Scene();
        this.createSkyBox();
        this.terrainGeneration.generate(this.scene, track);
        this.cameraService.initialiseCamera(this.container);
        this.camera = this.cameraService.getCamera();
    }

    private getAspectRatio() {
        return this.container.clientWidth / this.container.clientHeight;
    }

    public createSkyBox() {
        const url = '../../assets/images/skybox/';
        const images = [url + 'xpos.png', url + 'xneg.png',
        url + 'ypos.png', url + 'yneg.png',
        url + 'zpos.png', url + 'zneg.png'];
        const textureSky = THREE.ImageUtils.loadTextureCube(images);
        const shader = THREE.ShaderLib['cube'];
        shader.uniforms['tCube'].value = textureSky;
        const material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        const skyboxMesh    = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000), material );
        material.needsUpdate = true;
        this.scene.add( skyboxMesh );
    }

    public eventsList(event: any): void {
        this.cameraService.swapCamera(event);
        this.cameraService.zoomCamera(event);
        this.updateCamera();
    }

    public updateCamera(): void {
        this.camera = this.cameraService.getCamera();
    }

    public cameraFollowingObject(object: any) {
        this.cameraService.cameraOnMoveWithObject(object);
        this.updateCamera();
    }

    private startRenderingLoop() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.view = this.camera.zoom;
        this.render();
    }

    private render() {
        requestAnimationFrame(() => this.render());
        this.animateCube();
        this.camera.zoom = this.view;
        this.camera.updateProjectionMatrix();
        this.cameraFollowingObject(this.cube);
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    private initStats() {
        this.stats = new Stats();
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.top = '64px';
        this.container.appendChild(this.stats.dom);
    }

    public onResize() {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public initialize(container: HTMLElement, rotationX: number, rotationY: number, track: Track) {
        this.container = container;
        this.rotationSpeedX = rotationX;
        this.rotationSpeedY = rotationY;
        this.createScene(track);
        this.createCube();
        this.initStats();
        this.startRenderingLoop();
    }
}

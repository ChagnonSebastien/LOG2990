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

    public fov;

    public zoom = 1.0;

    public inc = -0.01;

    constructor(private cameraService: CameraService) {
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
        console.log('cube ajouté');
    }

    private createScene() {
        this.scene = new THREE.Scene();
        this.cameraService.initialiseCamera(this.container);
        this.camera = this.cameraService.getCamera();
        console.log('Camera service fonctionne');
    }

    private getAspectRatio() {
        return this.container.clientWidth / this.container.clientHeight;
    }

    public eventsList(event: any): void {
        this.cameraService.selectCamera(event);
        this.zoomCamera(event);
        this.updateCamera();
    }

    public zoomCamera(event: any): void {
        // 107 corresponding to '+' in ASCII
        // 109 corresponding to '-' in ASCII
        if (event.keyCode === 107) {
            this.zoom += this.inc;
            console.log('zoom');
        } else if (event.keyCode === 109) {
            this.zoom -= this.inc;
            console.log(this.zoom);
        }
    }

    public updateZoom(): void {
        this.zoom += this.inc;
        if ( this.zoom <= 0.2 || this.zoom >= 1.0) {
            this.inc = -this.inc;
        }
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
        this.fov = this.camera.fov;
        this.render();
    }

    private render() {
        requestAnimationFrame(() => this.render());
        this.animateCube();
        this.camera.fov = this.fov * this.zoom;
        this.camera.updateProjectionMatrix();
        /*
        this.zoom += this.inc;
        if ( this.zoom <= 0.2 || this.zoom >= 1.0) {
            this.inc = -this.inc;
        }
        */
        // this.updateZoom();
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

    public initialize(container: HTMLElement, rotationX: number, rotationY: number) {
        this.container = container;
        this.rotationSpeedX = rotationX;
        this.rotationSpeedY = rotationY;

        this.createScene();
        this.createCube();
        this.initStats();
        this.startRenderingLoop();
    }
}
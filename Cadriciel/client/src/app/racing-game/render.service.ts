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

    private cart: THREE.Mesh;


    // added
    private cameraZ = 400;

    private fieldOfView = 70;

    private nearClippingPane = 1;

    private farClippingPane = 1000;


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
    }



    private createScene() {
        this.scene = new THREE.Scene();
        this.createSkyBox();
        this.cameraService.initialiseCamera(this.container);
        this.camera = this.cameraService.getCamera();
        this.scene.add(new THREE.AmbientLight(0xFFFFFF));
        const light: THREE.SpotLight = new THREE.SpotLight(0xffffff);
        light.position.set(100, 100, 100);
        light.castShadow = true;
        this.scene.add(light);
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
        const skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(1000, 1000, 1000), material);
        material.needsUpdate = true;
        this.scene.add(skyboxMesh);
    }

    public eventsList(event: any): void {
        this.cameraService.selectCamera(event);
        this.zoomCamera(event);
        this.updateCamera();
    }

    public zoomCamera(event: any): void {
        // 107 corresponding to '+' in ASCII
        // 109 corresponding to '-' in ASCII
        if (event.keyCode === 73) {
            this.view += this.inc;
        } else if (event.keyCode === 79) {
            this.view -= this.inc;
        }
    }

    public updateCamera(): void {
        this.camera = this.cameraService.getCamera();
    }

    public cameraFollowingObject(object: any) {
        this.cameraService.cameraOnMoveWithObject(object);
        // this.updateCamera();
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
        // this.animateCube();
        // this.animatedCart();
        this.camera.zoom = this.view;
        this.camera.updateProjectionMatrix();
        // this.cameraFollowingObject(this.cube);
        // this.cameraFollowingObject(this.cart);
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
        // this.createCube();
        this.createCart();
        this.initStats();
        this.startRenderingLoop();
    }

    /* CARTS */
    private createCart() {
        const service = this;
        const loader = new THREE.ObjectLoader();
        loader.load('/assets/cart.json', (object: THREE.Object3D) => {
            console.log('z: ', object);
            this.cart = <THREE.Mesh>object;
            this.cart.position.setX(0);
            this.cart.position.setY(0);
            this.cart.position.setZ(0);
            this.cart.scale.setX(50);
            this.cart.scale.setY(50);
            this.cart.scale.setZ(50);
            this.cart.rotation.y = 20.4;
            console.log('z: ', this.cart);
            service.scene.add(this.cart);
        }, (object: any) => {
            console.log('prog: ', object);
        }, (object: any) => {
            console.log('err: ', object);
        });

    }

    private animatedCart() {
        this.cart.rotation.x += this.rotationSpeedX;
        this.cart.rotation.y += this.rotationSpeedY;
    }
}

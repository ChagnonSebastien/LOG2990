import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');

@Injectable()
export class RenderService {

    private container: HTMLElement;

    private camera: THREE.PerspectiveCamera;

    private stats: Stats;

    private line: THREE.Line; // for line

    private cube: THREE.Mesh;

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    private cameraZ = 400;

    private fieldOfView = 70;

    private nearClippingPane = 1;

    private farClippingPane = 1000;

    public rotationSpeedX = 0.005;

    public rotationSpeedY = 0.01;

    private lastPoint: THREE.Vector3;

    private animateCube() {
        this.cube.rotation.x += this.rotationSpeedX;
        this.cube.rotation.y += this.rotationSpeedY;
    }

    private drawLine() {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        const positions = new Float32Array(300);
        const colors = new Float32Array( 300);
        let value = 10;
        for ( let i = 0; i < 100; i ++ ) {
          const x = value;
          const y = value;
          const z = value;
          value++;
          // positions
          positions[ i * 3 ] = x;
          positions[ i * 3 + 1 ] = y;
          positions[ i * 3 + 2 ] = z;
          // colors
          colors[ i * 3 ] = ( x / value ) + 0.5;
          colors[ i * 3 + 1 ] = ( y / value ) + 0.5;
          colors[ i * 3 + 2 ] = ( z / value ) + 0.5;
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
        geometry.computeBoundingSphere();
        const mesh = new THREE.Line( geometry, material );
        this.scene.add( mesh );
    }

    private createCube() {
        const geometry = new THREE.BoxGeometry(200, 200, 200);

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
        /* Scene */
        this.scene = new THREE.Scene();

        /* Camera */
        const aspectRatio = this.getAspectRatio();
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );
        this.camera.position.z = this.cameraZ;
    }

    private getAspectRatio() {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render() {
        requestAnimationFrame(() => this.render());
        this.animateCube();
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

    public init(container: HTMLElement) {
        this.container = container;
        this.createScene();
        this.drawLine();
        this.startRenderingLoop();
    }

}

import { Injectable } from '@angular/core';
import * as THREE from 'three';

const viewDepth = 10;

@Injectable()
export class RenderService {

    private container: HTMLElement;

    private renderer: THREE.WebGLRenderer;

    private camera: THREE.OrthographicCamera;

    private scene: THREE.Scene;

    public initialise(container: HTMLElement) {
        this.container = container;
        this.createScene();
        this.startRenderingLoop();
    }

    private createScene() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(
            this.container.clientWidth / - 2,
            this.container.clientWidth / 2,
            this.container.clientHeight / 2,
            this.container.clientHeight / - 2,
            -viewDepth,
            viewDepth
        );
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
        this.renderer.render(this.scene, this.camera);
    }
}

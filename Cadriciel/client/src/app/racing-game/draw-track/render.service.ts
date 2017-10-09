import { Injectable } from '@angular/core';
import * as THREE from 'three';

const viewDepth = 10;

@Injectable()
export class RenderService {

    private container: HTMLElement;

    private renderer: THREE.WebGLRenderer;

    private camera: THREE.OrthographicCamera;

    private scene: THREE.Scene;

    private intersections: THREE.Mesh[] = [];

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

        this.intersections.push(this.newPoint(0, 0));
    }

    private newPoint(positionX: number, positionY: number) {
        const geometry = new THREE.CircleGeometry(10, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000FF });
        const point = new THREE.Mesh(geometry, material);
        point.position.setX(positionX);
        point.position.setY(positionY);
        this.scene.add(point);
        return point;
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

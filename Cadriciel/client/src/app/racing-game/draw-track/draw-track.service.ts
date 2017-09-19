import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class DrawTrackService {
    private container: HTMLElement;

    private camera: THREE.OrthographicCamera;

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    private mousePosition: THREE.Vector3 = new THREE.Vector3();

    private points: THREE.Mesh[] = [];

    public initialise(container: HTMLElement) {
        this.container = container;
        this.createScene();
        this.startRenderingLoop();
    }

    private createScene() {
        /* Scene */
        this.scene = new THREE.Scene();

        /* Camera */
        this.camera = new THREE.OrthographicCamera(
            this.container.clientWidth / - 2,
            this.container.clientWidth / 2,
            this.container.clientHeight / 2,
            this.container.clientHeight / - 2,
            -10,
            10
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

    public updateMousePosition(clientX: number, clientY: number) {
        this.mousePosition.x = clientX - this.container.clientWidth/2 - this.container.offsetLeft;
        this.mousePosition.y = this.container.clientHeight/2 + this.container.offsetTop - clientY;
    }

    public addPoint() {
        let geometry = new THREE.CircleGeometry( 10, 32 );
        let material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
        let circle = new THREE.Mesh( geometry, material );
        circle.position.set(this.mousePosition.x, this.mousePosition.y, 0);
        this.scene.add( circle );

        this.points.push(circle);
    }

    public removePoint() {
        this.scene.remove(this.points.pop());
    }

    public onResize() {
        this.camera.left = this.container.clientWidth / -2;
        this.camera.right = this.container.clientWidth / 2;
        this.camera.top = this.container.clientHeight / 2;
        this.camera.bottom = this.container.clientHeight / - 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

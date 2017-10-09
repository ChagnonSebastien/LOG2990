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

    private firstPointHighlight: THREE.Mesh;

    private segments: THREE.Mesh[] = [];

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

        this.intersections.push(this.newIntersection(new THREE.Vector2(0, 0)));
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

    private newIntersection(position: THREE.Vector2) {
        const geometry = new THREE.CircleGeometry(10, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const point = new THREE.Mesh(geometry, material);
        point.position.setX(position.x);
        point.position.setY(position.y);
        point.position.setZ(-3);
        this.scene.add(point);
        return point;
    }

    private newSegment() {
        const geometry = new THREE.PlaneGeometry(0, 20);
        const material = new THREE.MeshBasicMaterial({ color: 0xBB1515 });
        const segment = new THREE.Mesh(geometry, material);
        segment.position.z = -4;
        this.scene.add(segment);
        return segment;
    }

    public updateIntersectionPosition(index: number, position: THREE.Vector2) {
        if (index >= this.intersections.length) {
            return;
        }

        this.intersections[index].position.setX(position.x);
        this.intersections[index].position.setY(position.y);
    }

    public addIntersection(position: THREE.Vector2) {
        if (this.intersections.length === 1) {
            this.addHighlight(position);
        }

        this.intersections[this.intersections.length - 1].position.setZ(0);
        this.intersections.push(this.newIntersection(position));
        this.segments.push(this.newSegment());
    }

    public addHighlight(position: THREE.Vector2) {
        const geometry = new THREE.CircleGeometry(15, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xF5CD30 });
        this.firstPointHighlight = new THREE.Mesh(geometry, material);
        this.firstPointHighlight.position.set(position.x, position.y, -1);
        this.scene.add(this.firstPointHighlight);
    }
}

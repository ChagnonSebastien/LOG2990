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

    private trackClosed = false;

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
        this.segments.push(this.newSegment());
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
        return segment;
    }

    public updateIntersectionPosition(index: number, position: THREE.Vector2) {
        if (index >= this.intersections.length) {
            return;
        }

        this.intersections[index].position.set(position.x, position.y, this.intersections[index].position.z);
        if (index === 0 && this.trackClosed) {
            this.firstPointHighlight.position.set(position.x, position.y, this.firstPointHighlight.position.z);
        }

        this.updateSegmentPosition(index - 1 > -1 ? index - 1 : this.intersections.length - 1);
        this.updateSegmentPosition(index);
    }

    private updateSegmentPosition(index: number) {
        const fromPosition = this.intersections[index].position;
        const toPosition = this.intersections[index + 1 < this.intersections.length ? index + 1 : 0].position;

        this.segments[index].geometry = new THREE.PlaneGeometry(this.getXYDistance(fromPosition, toPosition), 20);
        this.segments[index].geometry.rotateZ(Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
        this.segments[index].position.x = ((toPosition.x - fromPosition.x) / 2) + fromPosition.x;
        this.segments[index].position.y = ((toPosition.y - fromPosition.y) / 2) + fromPosition.y;
    }

    private getXYDistance(vector1: THREE.Vector3, vector2: THREE.Vector3) {
        return Math.sqrt(Math.pow(vector2.x - vector1.x, 2) + Math.pow(vector2.y - vector1.y, 2));
    }

    public addIntersection(position: THREE.Vector2) {
        if (this.intersections.length === 1) {
            this.addHighlight(position);
        }

        this.intersections[this.intersections.length - 1].position.setZ(0);
        this.intersections.push(this.newIntersection(position));
        this.segments.splice(this.segments.length - 1, 0, this.newSegment());
        this.scene.add(this.segments[this.segments.length - 2]);
    }

    private addHighlight(position: THREE.Vector2) {
        const geometry = new THREE.CircleGeometry(15, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xF5CD30 });
        this.firstPointHighlight = new THREE.Mesh(geometry, material);
        this.firstPointHighlight.position.set(position.x, position.y, -1);
        this.scene.add(this.firstPointHighlight);
    }

    public removeIntersection() {
        this.scene.remove(this.intersections[this.intersections.length - 2]);
        this.intersections.splice(this.intersections.length - 2, 1);
        this.scene.remove(this.segments[this.segments.length - 2]);
        this.segments.splice(this.segments.length - 2, 1);

        if (this.intersections.length === 1) {
            this.scene.remove(this.firstPointHighlight);
        } else {
            this.updateSegmentPosition(this.segments.length - 2);
        }
    }
}

import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class DrawTrackService {

    private container: HTMLElement;

    private camera: THREE.OrthographicCamera;

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    public mousePosition: THREE.Vector3 = new THREE.Vector3();

    public pointMouseHoversOn = -1;

    public loopClosed = false;

    public points: THREE.Mesh[] = [];

    private segments: THREE.Mesh[] = [];

    private firstPointHighlight: THREE.Mesh;

    private activePoint: THREE.Mesh;

    private isActivePointInScene = false;

    private potholes: {distance: number, offset: number}[] = [];

    public initialise(container: HTMLElement) {
        this.container = container;
        this.createScene();
        this.initialiseFirstPointHighlight();
        this.initialiseActivePoint();
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

    private initialiseFirstPointHighlight() {
        const geometry = new THREE.CircleGeometry( 15, 32 );
        const material = new THREE.MeshBasicMaterial( { color: 0xF5CD30 } );
        this.firstPointHighlight = new THREE.Mesh( geometry, material );
    }

    private initialiseActivePoint() {
        const geometry = new THREE.CircleGeometry( 10, 32 );
        const material = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
        this.activePoint = new THREE.Mesh( geometry, material );
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
        this.mousePosition = this.getRelativeMousePosition(clientX, clientY);

        this.pointMouseHoversOn = this.getPointUnderMouse();
        if (this.points.length > 0 && !this.loopClosed) {

            if (this.pointMouseHoversOn === 0) {
                this.mousePosition = this.points[0].position.clone();
                this.updateLastSegmentPosition();
                this.firstPointHighlight.material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF });
            } else {
                this.firstPointHighlight.material = new THREE.MeshBasicMaterial( { color: 0xF5CD30 });
                this.updateLastSegmentPosition();
            }
        }
        if (!this.loopClosed) {
            this.updateActivePoint();
        }
    }

    private getRelativeMousePosition(clientX: number, clientY: number) {
        const relativePosition = new THREE.Vector3();
        relativePosition.x = clientX - this.container.clientWidth / 2 - this.container.offsetLeft;
        relativePosition.y = this.container.clientHeight / 2 + this.container.offsetTop - clientY;
        return relativePosition;
    }

    private getPointUnderMouse(): number {
        const service = this;
        let index = -1;
        this.points.forEach(function(point, i, array) {
            if (service.distance(service.mousePosition, point.position) < 20) {
                index = i;
            }
        });
        return index;
    }

    private updateActivePoint() {
        this.activePoint.position.set(this.mousePosition.x, this.mousePosition.y, -3);
        if (!this.isActivePointInScene) {
            this.scene.add(this.activePoint);
            this.isActivePointInScene = true;
        }
    }

    private checkIfMouseIsOnFirstPoint(): boolean {
        return this.distance(this.mousePosition, this.points[0].position) < 20;
    }

    private updateLastSegmentPosition() {
        if (this.segments.length === 0) {
            return;
        }

        const fromPoint = this.points[this.points.length - 1].position;
        this.segments[this.segments.length - 1].geometry = new THREE.PlaneGeometry(this.distance(fromPoint, this.mousePosition), 20);
        this.segments[this.segments.length - 1].geometry.rotateZ(
            Math.atan((this.mousePosition.y - fromPoint.y) / (this.mousePosition.x - fromPoint.x)));
        this.segments[this.segments.length - 1].position.x = ((this.mousePosition.x - fromPoint.x) / 2) + fromPoint.x;
        this.segments[this.segments.length - 1].position.y = ((this.mousePosition.y - fromPoint.y) / 2) + fromPoint.y;
    }

    public distance(vector1: THREE.Vector3, vector2: THREE.Vector3) {
        return Math.sqrt(Math.pow(vector2.x - vector1.x, 2) + Math.pow(vector2.y - vector1.y, 2));
    }

    public addPoint() {
        if (this.pointMouseHoversOn === -1 && !this.loopClosed) {
            const geometry = new THREE.CircleGeometry(10, 32);
            const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
            const circle = new THREE.Mesh(geometry, material);
            circle.position.set(this.mousePosition.x, this.mousePosition.y, 0);
            this.scene.add(circle);

            this.points.push(circle);
            this.segments.push(this.newSegment());
            if (this.points.length === 1) {
              this.addHighlight();
              this.segments[0].material = new THREE.MeshBasicMaterial({color: 0xFF7700});
            }
        } else if (this.pointMouseHoversOn === 0) {
            this.loopClosed = true;
        }
    }

    public addHighlight() {
        this.firstPointHighlight.position.set(this.mousePosition.x, this.mousePosition.y, -1);
        this.scene.add(this.firstPointHighlight);
    }

    private newSegment(): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry( 0, 30 );
        const material = new THREE.MeshBasicMaterial( { color: 0xBB1515 } );
        const segment = new THREE.Mesh( geometry, material );
        segment.position.z = -4;
        this.scene.add(segment);
        return segment;
    }

    public removePoint() {
        this.scene.remove(this.points.pop());
        if (this.points.length === 0) {
            this.removeHighlight();
        }
        if (this.segments.length > 0) {
            this.removeLastSegment();
        }
        this.loopClosed = false;
        this.updateActivePoint();
    }

    private removeLastSegment() {
        this.scene.remove(this.segments.pop());
        this.updateLastSegmentPosition();
    }

    private removeHighlight() {
        this.scene.remove(this.firstPointHighlight);
    }

    public isFinished() {
        return this.loopClosed;
    }

    public switchAmount(item: String) {
        this.potholes.push(this.newRandomLocation());
        console.log(this.potholes[this.potholes.length - 1])
    }

    private newRandomLocation(): {distance: number, offset: number} {
        return {distance: Math.random() * this.getTrackLenght(), offset: Math.random() * (Math.random() < 0.5 ? -1 : 1)};
    }

    private getTrackLenght(): number {
        let distance = 0;
        let service = this;
        this.points.forEach(function(currentValue, index, array) {
            distance += service.distance(currentValue.position, (index === 0) ? array[array.length - 1].position : array[index - 1].position);
        });
        console.log(distance);
        return distance;
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

import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class DrawTrackService {

    private container: HTMLElement;

    private camera: THREE.OrthographicCamera;

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    public mousePosition: THREE.Vector3 = new THREE.Vector3();

    public mouseOnFirstPoint = false;

    private loopClosed = false;

    public points: THREE.Mesh[] = [];

    private segments: THREE.Mesh[] = [];

    private firstPointHighlight: THREE.Mesh;

    private activePoint: THREE.Mesh;

    private activeSegment: THREE.Mesh;

    private isActivePointInScene = false;

    public initialise(container: HTMLElement) {
        this.container = container;
        this.createScene();
        this.initialiseFirstPointHighlight();
        this.initialiseActivePoint();
        this.initialiseActiveSegment();
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

    private initialiseActiveSegment() {
      this.activeSegment = this.newActiveSegment();
      this.scene.remove(this.activeSegment);
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
        this.mousePosition.x = clientX - this.container.clientWidth / 2 - this.container.offsetLeft;
        this.mousePosition.y = this.container.clientHeight / 2 + this.container.offsetTop - clientY;
        if (this.points.length > 0 && !this.loopClosed) {

            if (this.checkIfMouseIsOnFirstPoint()) {
                this.mousePosition = this.points[0].position.clone();
                if (!this.mouseOnFirstPoint) {
                  this.mouseOnFirstPoint = true;
                  this.updateActiveSegment();
                  this.firstPointHighlight.material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF });
                }
            } else {
                if (this.mouseOnFirstPoint) {
                   this.mouseOnFirstPoint = false;
                   this.firstPointHighlight.material = new THREE.MeshBasicMaterial( { color: 0xF5CD30 });
                }
                this.updateActiveSegment();
            }
        }
        if (!this.loopClosed) {
            this.updateActivePoint();
        }

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

    private updateActiveSegment() {
      const fromPoint = this.points[this.points.length - 1].position;
      this.activeSegment.geometry = new THREE.PlaneGeometry(this.distance(fromPoint, this.mousePosition), 20);
      this.activeSegment.geometry.rotateZ(Math.atan((this.mousePosition.y - fromPoint.y) / (this.mousePosition.x - fromPoint.x)));
      this.activeSegment.position.x = ((this.mousePosition.x - fromPoint.x) / 2) + fromPoint.x;
      this.activeSegment.position.y = ((this.mousePosition.y - fromPoint.y) / 2) + fromPoint.y;
    }

    private distance(vector1: THREE.Vector3, vector2: THREE.Vector3) {
        return Math.sqrt(Math.pow(vector2.x - vector1.x, 2) + Math.pow(vector2.y - vector1.y, 2));
    }

    public addPoint() {
        if (!this.mouseOnFirstPoint) {
            const geometry = new THREE.CircleGeometry(10, 32);
            const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
            const circle = new THREE.Mesh(geometry, material);
            circle.position.set(this.mousePosition.x, this.mousePosition.y, 0);
            this.scene.add(circle);

            this.points.push(circle);
            if (this.points.length === 1) {
              this.addHighlight();
              this.scene.add(this.activeSegment);
              this.updateActiveSegment();
              this.activeSegment.material = new THREE.MeshBasicMaterial({color: 0xFF7700});
            } else {
              this.pushSegment();
            }
        } else {
            this.loopClosed = true;
        }
    }

    public addHighlight() {
        this.firstPointHighlight.position.set(this.mousePosition.x, this.mousePosition.y, -1);
        this.scene.add(this.firstPointHighlight);
    }

    private pushSegment() {
        this.activeSegment.position.z = -2;
        this.segments.push(this.activeSegment);
        this.activeSegment = this.newActiveSegment();
    }

    private newActiveSegment() {
        const geometry = new THREE.PlaneGeometry( 0, 30 );
        const material = new THREE.MeshBasicMaterial( { color: 0xBB1515 } );
        const segment = new THREE.Mesh( geometry, material );
        segment.position.z = -4;
        this.scene.add(segment);
        return segment;
    }

    public removePoint() {
        if (!this.loopClosed) {
            this.scene.remove(this.points.pop());
            if (this.points.length === 0) {
                this.removeHighlight();
                this.scene.remove(this.activeSegment);
            }
            if (this.segments.length > 0) {
                this.removeSegment();
            }
        } else {
            this.loopClosed = false;
            this.updateActiveSegment();
            this.updateActivePoint();
        }
    }

    private removeSegment() {
        this.scene.remove(this.activeSegment);
        this.activeSegment = this.segments.pop();
        this.updateActiveSegment();
    }

    private removeHighlight() {
        this.scene.remove(this.firstPointHighlight);
    }

    public isFinished() {
        return this.loopClosed;
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

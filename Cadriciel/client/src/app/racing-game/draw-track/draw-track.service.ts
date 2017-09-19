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
    private segments: THREE.Mesh[] = [];
    private firstPointHighlight: THREE.Mesh;

    private activePoint: THREE.Mesh;
    private activeSegment: THREE.Mesh;
    private isActivePointInScene: boolean = false;

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
        let geometry = new THREE.CircleGeometry( 15, 32 );
        let material = new THREE.MeshBasicMaterial( { color: 0xF5CD30 } );
        this.firstPointHighlight = new THREE.Mesh( geometry, material );
    }

    private initialiseActivePoint() {
        let geometry = new THREE.CircleGeometry( 10, 32 );
        let material = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
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
        this.mousePosition.x = clientX - this.container.clientWidth/2 - this.container.offsetLeft;
        this.mousePosition.y = this.container.clientHeight/2 + this.container.offsetTop - clientY;

        this.updateActivePoint();
      if (this.points.length > 0)
          this.updateActiveSegment(this.points[this.points.length - 1].position);
    }

    private updateActivePoint() {
        this.activePoint.position.set(this.mousePosition.x, this.mousePosition.y, -3);
        if (!this.isActivePointInScene) {
            this.scene.add(this.activePoint);
            this.isActivePointInScene = true;
        }
    }

    private updateActiveSegment(fromPoint: THREE.Vector3) {
      this.activeSegment.geometry = new THREE.PlaneGeometry(this.distance(fromPoint, this.mousePosition) ,10);
      this.activeSegment.geometry.rotateZ(Math.atan((this.mousePosition.y - fromPoint.y)/(this.mousePosition.x - fromPoint.x)));
      this.activeSegment.position.x = (this.mousePosition.x - fromPoint.x) / 2;
      this.activeSegment.position.y = (this.mousePosition.y - fromPoint.y) / 2;
    }

    private distance(vector1: THREE.Vector3, vector2: THREE.Vector3) {
        return Math.sqrt(Math.pow(vector2.x - vector1.x,2) + Math.pow(vector2.y - vector1.y, 2));
    }

    public addPoint() {
        let geometry = new THREE.CircleGeometry( 10, 32 );
        let material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
        let circle = new THREE.Mesh( geometry, material );
        circle.position.set(this.mousePosition.x, this.mousePosition.y, 0);
        this.scene.add( circle );

        this.points.push(circle);
        if (this.points.length === 1) {
            this.addHighlight();
            this.activeSegment = this.newActiveSegment();
        } else {
            this.pushSegment();
        }
    }

    public addHighlight() {
        this.firstPointHighlight.position.set(this.mousePosition.x, this.mousePosition.y, -1);
        this.scene.add(this.firstPointHighlight);
    }

    private pushSegment() {
        this.segments.push(this.activeSegment);
        this.activeSegment = this.newActiveSegment();
    }

    private newActiveSegment() {
        let geometry = new THREE.PlaneGeometry( 0, 20 );
        let material = new THREE.MeshBasicMaterial( { color: 0xBB1515 } );
        return new THREE.Mesh( geometry, material );
    }

    public removePoint() {
        this.scene.remove(this.points.pop());
        if (this.points.length === 0) {
            this.removeHighlight();
        }
    }

    public removeHighlight() {
        this.scene.remove(this.firstPointHighlight);
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

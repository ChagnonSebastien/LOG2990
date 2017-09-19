import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');

@Injectable()
export class DrawTrackService {
    private container: HTMLElement;

    private geometries: THREE.Geometry;

    private projector: THREE.Projector;

    private camera: THREE.PerspectiveCamera;

    private plane: THREE.Mesh;

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    private cameraZ = 400;

    private fieldOfView = 70;

    private nearClippingPane = 1;

    private farClippingPane = 1000;

    private mouse: THREE.Vector3;

    public pointX;

    public pointY;

    private raycaster: THREE.Raycaster;



    public push() {
        console.log('push here');

        this.mouse.x = ( this.pointX / this.container.clientWidth ) * 2 - 1;
        this.mouse.y = - (this.pointY / this.container.clientHeight ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.plane);
        if (intersects.length > 0) {
            const geometry = new THREE.CircleGeometry( 10, 32 );
            const material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
            const circle = new THREE.Mesh( geometry, material );
            circle.position.copy(intersects[0].point);
            this.scene.add( circle );
            console.log('creating point at :' + circle.position.x);

        }
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
        // this.raycaster.setFromCamera( this.mouse, this.camera );
        requestAnimationFrame(() => this.render());
        // this.push();
        this.renderer.render(this.scene, this.camera);
    }

    public onResize() {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public getMousePosition(X, Y): void {
        const vector = new THREE.Vector3(
            ( X / this.container.clientWidth ) * 2 - 1,
             - (Y / this.container.clientHeight ) * 2 + 1,
             0);
        this.projector.unprojectVector( vector, this.camera );
        const dir = vector.sub( this.camera.position ).normalize();
        const distance = - this.camera.position.z / dir.z;
        const pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
        this.geometries.vertices.push(vector);
    }

    private createPlan() {
        const geometry = new THREE.PlaneGeometry(this.container.clientWidth, this.container.clientHeight, 3);
        const material = new THREE.MeshBasicMaterial({color: 0xffffff});
        this.plane = new THREE.Mesh(geometry, material);

        this.scene.add(this.plane);
    }

    private draw() {

        const geometry = new THREE.CircleGeometry( 79, 32 );
        const material = new THREE.LineBasicMaterial({
           color: 0x0000ff
        });

        const lined = new THREE.Mesh(geometry, material);
        this.scene.add(lined);
    }

    public initialise(container: HTMLElement, positionX: number, positionY: number) {
            this.container = container;
            this.pointX = positionX;
            this.pointY = positionY;
            this.mouse = new THREE.Vector3();
            this.raycaster = new THREE.Raycaster();
            this.createScene();
            // this.draw();
            this.createPlan();
            this.startRenderingLoop();
    }
}

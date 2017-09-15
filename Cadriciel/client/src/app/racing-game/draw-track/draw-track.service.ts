import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');

@Injectable()
export class DrawTrackService {
    private container: HTMLElement;

    // private maetrieal: THREE.LineBasicMaterial;

    private geometries: THREE.Geometry;

    private projector: THREE.Projector;

    private camera: THREE.PerspectiveCamera;

    private line: THREE.Line; // for line

    private renderer: THREE.WebGLRenderer;

    private scene: THREE.Scene;

    private cameraZ = 400;

    private fieldOfView = 70;

    private nearClippingPane = 1;

    private farClippingPane = 1000;

    private lastPoint: THREE.Vector3;

    private mouse: THREE.Vector3;

    private mouseOn = false;

    public pointX;

    public pointY;

    private raycaster: THREE.Raycaster;



    private push() {
        // this.line.position.x = ( this.pointX / this.container.clientWidth ) * 2 - 1;
        // this.line.position.y = - (this.pointY / this.container.clientHeight ) * 2 + 1;

        this.mouse.x = ( this.pointX / this.container.clientWidth ) * 2 - 1;
        this.mouse.y = - (this.pointY / this.container.clientHeight ) * 2 + 1;
        this.mouse.z = 0.5;
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

    public click() {
        this.mouseOn = true;
    }

    private draw() {

         /*

        if (this.lastPoint) {
            const pos = this.getMousePosition(this.pointX, this.pointY);
            const material = new THREE.LineBasicMaterial({
                color: 0x0000ff
            });

            const geometry = new THREE.Geometry();
            if ( Math.abs(this.lastPoint.x - pos.x) < 2000 &&
                Math.abs(this.lastPoint.y - pos.y) < 2000 &&
                Math.abs(this.lastPoint.z - pos.z) < 2000 ) {
                geometry.vertices.push(this.lastPoint);
                geometry.vertices.push(pos);

                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
                this.lastPoint = pos;
        }
        */

        const geometry = new THREE.CircleGeometry( 79, 32 );
        const material = new THREE.LineBasicMaterial({
           color: 0x0000ff
        });

        this.line = new THREE.Mesh(geometry, material);
        // this.line = new THREE.Mesh(this.geometries, material);
        this.scene.add(this.line);

       /*
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
        */
    }

    private createCube() {
        const geometry = new THREE.BoxGeometry(200, 200, 200);

        for (let i = 0; i < geometry.faces.length; i += 2) {
            const hex = Math.random() * 0xffffff;
            geometry.faces[i].color.setHex(hex);
            geometry.faces[i + 1].color.setHex(hex);
        }

        const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });
        this.line = new THREE.Mesh(geometry, material);
        this.scene.add(this.line);
    }

        /*
        if (this.mouseOn) {
            const geometry = new THREE.ConeGeometry( 5, 20, 32 );
            const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            const cone = new THREE.Mesh( geometry, material );
            this.scene.add( cone );
        } else {
            const geometry = new THREE.CircleGeometry( 79, 32 );
            const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
            const circle = new THREE.Mesh( geometry, material );
            this.scene.add( circle );
        }
        */

    public initialise(container: HTMLElement, positionX: number, positionY: number) {
            this.container = container;
            this.pointX = positionX;
            this.pointY = positionY;
            this.createScene();
            this.draw();
            this.startRenderingLoop();
    }
}

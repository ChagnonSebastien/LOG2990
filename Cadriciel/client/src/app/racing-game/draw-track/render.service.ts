import { Injectable } from '@angular/core';
import * as THREE from 'three';

const viewDepth = 10;

@Injectable()
export class RenderService {

    public container: HTMLElement;

    private camera: THREE.OrthographicCamera;

    private scene: THREE.Scene;

    public initialise(container: HTMLElement) {
        this.container = container;
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
}

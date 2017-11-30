import { SceneService } from './scene.service';
import { Light } from './light';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class RacingSceneService extends SceneService {
    public textureSky: THREE.Texture;
    public light: Light;

    constructor() {
        super();
        this.createScene();
    }

    private createScene() {
        this.createLight();
        this.createSkyBox();
    }

     private createSkyBox() {
        const url = '../../assets/images/skybox/';
        const images = [url + 'xpos.png', url + 'xneg.png',
        url + 'ypos.png', url + 'yneg.png',
        url + 'zpos.png', url + 'zneg.png'];
        this.textureSky = THREE.ImageUtils.loadTextureCube(images);
        const shader = THREE.ShaderLib['cube'];
        shader.uniforms['tCube'].value = this.textureSky;
        const material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        const skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000), material);
        material.needsUpdate = true;
        this.addObject(skyboxMesh);
    }

    private createLight() {
        this.light = new Light();
        this.addObject(this.light.hemiLight);
        this.addObject(this.light.dirLight);
    }

    public toggleNightMode() {
        this.light.dirLight.visible = !this.light.dirLight.visible;
    }
}

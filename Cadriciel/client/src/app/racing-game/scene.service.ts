import { Light } from './light';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class SceneService {
    public scene: THREE.Scene;
    public textureSky: THREE.Texture;
    public light: Light;

    constructor() {
        this.createScene();
    }

    public addToScene(object: THREE.Object3D) {
        this.scene.add(object);
    }

    public removeFromScene(object: THREE.Object3D) {
        this.scene.remove(object);
    }

    private createScene() {
        this.scene = new THREE.Scene();
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
        this.addToScene(skyboxMesh);
    }

    private createLight() {
        this.light = new Light();
        this.addToScene(this.light.hemiLight);
        this.addToScene(this.light.dirLight);
    }

    public toggleNightMode() {
        this.light.dirLight.visible = !this.light.dirLight.visible;
    }

    public lightWay() {
        this.scene.traverse ( function (children) {
            if (children.name === 'vehicle') {
                children.traverse( function (child) {
                    if (child instanceof THREE.SpotLight) {
                        child.visible = !child.visible;
                    }
                });
            }
        });
    }
}

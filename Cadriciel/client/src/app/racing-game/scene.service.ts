import { Light } from './light';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class SceneService {
    public scene: THREE.Scene;
    public textureSky: THREE.Texture;
    public light: Light;
    private materialSkybox: THREE.ShaderMaterial;
    private isNight: boolean;
    private shader: THREE.Shader;

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

    private createTexture() {
        const url = '../../assets/images/skybox/';
        if (this.isNight) {
            const images = [url + 'bluefreeze_rt.png', url + 'bluefreeze_lf.png',
            url + 'bluefreeze_up.png', url + 'bluefreeze_dn.png',
            url + 'bluefreeze_ft.png', url + 'bluefreeze_bk.png'];
            this.textureSky = THREE.ImageUtils.loadTextureCube(images);
            this.shader = THREE.ShaderLib['cube'];
            this.shader.uniforms['tCube'].value = this.textureSky;
        } else {
            const images = [url + 'xpos.png', url + 'xneg.png',
            url + 'ypos.png', url + 'yneg.png',
            url + 'zpos.png', url + 'zneg.png'];
            this.textureSky = THREE.ImageUtils.loadTextureCube(images);
            this.shader = THREE.ShaderLib['cube'];
            this.shader.uniforms['tCube'].value = this.textureSky;
        }

        this.materialSkybox = new THREE.ShaderMaterial({
            fragmentShader: this.shader.fragmentShader,
            vertexShader: this.shader.vertexShader,
            uniforms: this.shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide,
        });

        this.materialSkybox.needsUpdate = true;
    }

     private createSkyBox() {
        this.createTexture();
        const skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry(100000, 100000, 100000), this.materialSkybox);
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

import * as THREE from 'three';
import { Scene } from 'three';

export class SceneService {
    public scene: THREE.Scene;

    constructor() {
        this.scene = new Scene();
    }

    public addObject(object: THREE.Object3D) {
        this.scene.add(object);
    }

    public addObjectWithName(object: THREE.Object3D, name: string) {
        object.name = name;
        this.scene.add(object);
    }

    public removeObject(object: THREE.Object3D) {
        this.scene.remove(object);
    }

    public removeObjectByName(name: string) {
        this.scene.remove(this.scene.getObjectByName(name));
    }
}

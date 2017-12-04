import * as THREE from 'three';
import { Scene } from 'three';

export class SceneService {
    public scene: THREE.Scene;

    constructor() {
        this.scene = new Scene();
    }

    public addObject(object: THREE.Object3D): void {
        this.scene.add(object);
    }

    public addObjectWithName(object: THREE.Object3D, name: string): void {
        object.name = name;
        this.scene.add(object);
    }

    public removeObject(object: THREE.Object3D): void {
        this.scene.remove(object);
    }

    public removeObjectByName(name: string): void {
        this.scene.remove(this.scene.getObjectByName(name));
    }
}

import * as THREE from 'three';

export class Light {
    public hemiLight: THREE.HemisphereLight;

    public dirLight: THREE.DirectionalLight;

    constructor() {
        this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.2);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 7500, 0);

        this.dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.dirLight.color.setHSL(0.1, 1, 0.95);
        this.dirLight.position.set(-6000, 7500, 6000);
        this.dirLight.position.multiplyScalar(30);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.left = -50;
        this.dirLight.shadow.camera.right = 50;
        this.dirLight.shadow.camera.top = 50;
        this.dirLight.shadow.camera.bottom = -50;
        this.dirLight.shadow.camera.far = 3500;
        this.dirLight.shadow.bias = -0.0001;
    }

    public addSpotLight(object: any) {
        const spotLight = new THREE.SpotLight( 0xFFFFFF);
        spotLight.castShadow = true;
        spotLight.position.x = object.position.x;
        spotLight.position.y = object.position.y + 10;
        spotLight.position.z = object.position.z;
        object.add(spotLight);
    }
}

import * as THREE from 'three';

export class Light {
    public hemiLight: THREE.HemisphereLight;

    public dirLight: THREE.DirectionalLight;

    public spotRight: THREE.SpotLight;

    public spotLeft: THREE.SpotLight;

    constructor() {
        this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.2);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 10000, 0);

        this.dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.dirLight.color.setHSL(0.1, 1, 0.95);
        this.dirLight.position.set(0, 10000, 0);
        this.dirLight.position.multiplyScalar(30);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.left = -5000;
        this.dirLight.shadow.camera.right = 5000;
        this.dirLight.shadow.camera.top = 5000;
        this.dirLight.shadow.camera.bottom = -5000;
        this.dirLight.shadow.camera.far = 10000;
        this.dirLight.shadow.bias = -0.0001;
    }

    public addLightsToVehicle(vehicule: any) {
        const sphereRight = new THREE.SphereGeometry(0.15, 16, 8);
        const matSphereRight = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
        const headlightRight = new THREE.Mesh(sphereRight, matSphereRight);

        const sphereLeft = new THREE.SphereGeometry(0.15, 16, 8);
        const matSphereLeft = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
        const headlightLeft = new THREE.Mesh(sphereLeft, matSphereLeft);

        this.spotRight = new THREE.SpotLight( 0xFFFFFF);
        this.spotRight.add(headlightRight);

        this.spotLeft = new THREE.SpotLight( 0xFFFFFF);
        this.spotLeft.add(headlightLeft);

        const target = new THREE.Object3D();
        vehicule.add(target);
        target.position.set(0, 0, 4);

        vehicule.add(this.spotRight);
        vehicule.add(this.spotLeft);

        this.spotRight.position.set(0.6, 1.1, -3.2);
        this.spotRight.target = target;
        this.spotLeft.position.set(-0.6, 1.1, -3.2);
        this.spotLeft.target = target;
    }
}

import * as THREE from 'three';
import { Settings } from './settings';

export class Light {
    public hemiLight: THREE.HemisphereLight;

    public dirLight: THREE.DirectionalLight;

    public spotRight: THREE.SpotLight;

    public spotLeft: THREE.SpotLight;

    constructor() {
        this.hemiLight = new THREE.HemisphereLight(Settings.LIGHT_COLOR, Settings.LIGHT_COLOR, 0.2);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 10000, 0);

        this.dirLight = new THREE.DirectionalLight(Settings.LIGHT_COLOR, 1);
        this.dirLight.color.setHSL(0.1, 1, 0.95);
        this.dirLight.position.set(0, 10000, 0);
        this.dirLight.position.multiplyScalar(30);
    }

    public addLightsToVehicle(vehicle: any): void {
        const sphereRight = new THREE.SphereGeometry(0.15, 16, 8);
        const matSphereRight = new THREE.MeshBasicMaterial({ color: Settings.LIGHT_COLOR });
        const headlightRight = new THREE.Mesh(sphereRight, matSphereRight);

        const sphereLeft = new THREE.SphereGeometry(0.15, 16, 8);
        const matSphereLeft = new THREE.MeshBasicMaterial({ color: Settings.LIGHT_COLOR });
        const headlightLeft = new THREE.Mesh(sphereLeft, matSphereLeft);

        this.spotRight = new THREE.SpotLight(Settings.LIGHT_COLOR);
        this.spotRight.add(headlightRight);

        this.spotLeft = new THREE.SpotLight(Settings.LIGHT_COLOR);
        this.spotLeft.add(headlightLeft);

        const target = new THREE.Object3D();
        vehicle.add(target);
        target.position.set(0, 0, -4);

        vehicle.add(this.spotRight);
        vehicle.add(this.spotLeft);

        this.spotRight.position.set(0.6, 1.1, -3.2);
        this.spotRight.target = target;
        this.spotLeft.position.set(-0.6, 1.1, -3.2);
        this.spotLeft.target = target;
    }

    public hideLightsVehicle(): void {
        this.spotRight.visible = !this.spotRight.visible;
        this.spotLeft.visible = !this.spotLeft.visible;
    }
}

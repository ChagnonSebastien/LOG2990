import * as THREE from 'three';
import { Settings } from './settings';

export class Light {
    public hemiLight: THREE.HemisphereLight;
    public dirLight: THREE.DirectionalLight;
    public spotRight: THREE.SpotLight;
    public spotLeft: THREE.SpotLight;

    constructor() {
        this.hemiLight = new THREE.HemisphereLight(Settings.LIGHT_COLOR, Settings.LIGHT_COLOR, Settings.LIGHT_INTENSITY);
        this.hemiLight.color.setHSL(Settings.HUE_LIGHT, Settings.SATURATION_LIGHT, Settings.LIGHTNESS_LIGHT);
        this.hemiLight.groundColor.setHSL(Settings.HUE_GROUND, Settings.SATURATION_GROUND, Settings.LIGHTNESS_GROUND);
        this.hemiLight.position.set(Settings.HEMILIGHT_X, Settings.HEMILIGHT_Y, Settings.HEMILIGHT_Z);

        this.dirLight = new THREE.DirectionalLight(Settings.LIGHT_COLOR, 1);
        this.dirLight.color
            .setHSL(Settings.HUE_DIRECTIONAL_LIGHT, Settings.SATURATION_DIRECTIONAL_LIGHT, Settings.LIGHTNESS_DIRECTIONAL_LIGHT);
        this.dirLight.position
            .set(Settings.DIRECTIONAL_LIGHT_X, Settings.DIRECTIONAL_LIGHT_Y, Settings.DIRECTIONAL_LIGHT_Z);
    }

    public addLightsToVehicle(vehicle: THREE.Mesh): void {
        const sphereRight = new THREE.SphereGeometry(
            Settings.CAR_LIGHT_RADIUS,
            Settings.CAR_LIGHT_WIDTH_SEGMENT,
            Settings.CAR_LIGHT_PHI_START
        );
        const matSphereRight = new THREE.MeshBasicMaterial({ color: Settings.LIGHT_COLOR });
        const headlightRight = new THREE.Mesh(sphereRight, matSphereRight);

        const sphereLeft = new THREE.SphereGeometry(
            Settings.CAR_LIGHT_RADIUS,
            Settings.CAR_LIGHT_WIDTH_SEGMENT,
            Settings.CAR_LIGHT_PHI_START
        );
        const matSphereLeft = new THREE.MeshBasicMaterial({ color: Settings.LIGHT_COLOR });
        const headlightLeft = new THREE.Mesh(sphereLeft, matSphereLeft);

        this.spotRight = new THREE.SpotLight(Settings.LIGHT_COLOR);
        this.spotRight.add(headlightRight);

        this.spotLeft = new THREE.SpotLight(Settings.LIGHT_COLOR);
        this.spotLeft.add(headlightLeft);

        const target = new THREE.Object3D();
        vehicle.add(target);
        target.position.set(
            Settings.LIGHT_TARGET_X,
            Settings.LIGHT_TARGET_Y,
            Settings.LIGHT_TARGET_Z
        );

        vehicle.add(this.spotRight);
        vehicle.add(this.spotLeft);

        this.spotRight.position.set(
            Settings.LIGHT_SPOT_X_RIGHT,
            Settings.LIGHT_SPOT_Y,
            Settings.LIGHT_SPOT_Z
        );
        this.spotRight.target = target;
        this.spotLeft.position.set(
            Settings.LIGHT_SPOT_X_LEFT,
            Settings.LIGHT_SPOT_Y,
            Settings.LIGHT_SPOT_Z
        );
        this.spotLeft.target = target;
    }

    public hideLightsVehicle(): void {
        this.spotRight.visible = !this.spotRight.visible;
        this.spotLeft.visible = !this.spotLeft.visible;
    }
}

import { Light } from './light';
import * as THREE from 'three';
const WIDTH = 1;
const HEIGHT = 1;
const DEPTH = 1;
const WHITE = 0xFFFFFF;

describe('test Light', function () {
    let light: Light;
    const vehicle = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, HEIGHT, DEPTH),
                                    new THREE.MeshBasicMaterial({color: WHITE}));
    beforeEach(() => {
        light = new Light();
    });

    it('should be created', done => {
        expect(light).toBeTruthy();
        done();
    });

    it('should be swap visibility of spotRight ', done => {
        light.addLightsToVehicle(vehicle);
        light.hideLightsVehicle();
        expect(light.spotRight.visible).toEqual(false);
        done();
    });

    it('should be swap visibility of spotLeft ', done => {
        light.addLightsToVehicle(vehicle);
        light.hideLightsVehicle();
        expect(light.spotLeft.visible).toEqual(false);
        done();
    });
});


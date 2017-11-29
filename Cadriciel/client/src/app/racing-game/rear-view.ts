import { Scene, PerspectiveCamera, Object3D } from 'three';

export class RearView {

    private scene: Scene;
    private rearCamera: PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    constructor(scene: Scene, renderer: THREE.WebGLRenderer) {
        this.scene = scene;
        this.rearCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 3000);
        this.renderer = renderer;
    }

    public addRearView(vehicle: any) {
        const  target = new Object3D;
        vehicle.add(target);
        target.position.set(0, 0, 3000);
        vehicle.add(this.rearCamera);
        this.rearCamera.position.set(0, 1, 2);
        this.rearCamera.lookAt(target.position);

        this.renderer.setViewport(400, 650, 300, 150);
        this.renderer.setScissor(400, 650, 300, 150);
        this.renderer.setScissorTest(true);
        this.renderer.render(this.scene, this.rearCamera);

    }


}

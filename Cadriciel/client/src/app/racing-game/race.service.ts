import { Injectable } from '@angular/core';
import { Settings } from './settings';
import * as THREE from 'three';

const HUB = 'hub';
@Injectable()
export class RaceService {
    public planeHud: THREE.Mesh;
    public sceneHud: THREE.Scene;
    public cameraHud: THREE.OrthographicCamera;

    constructor() {
        this.initializeHub();
    }

    private initializeHub() {
        /*const geometry = new THREE.PlaneGeometry(10 * Settings.SCENE_SCALE, 5 * Settings.SCENE_SCALE, 32 * Settings.SCENE_SCALE);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
        this.planeHud = new THREE.Mesh(geometry, material);
        this.planeHud.name = HUB;*/
        
        const hudCanvas = document.createElement('canvas');
        const width = window.innerWidth;
        const height = window.innerHeight;
        console.log('window inner width: ', width);
        console.log('window inner height: ', height);
        // Again, set dimensions to fit the screen.
        hudCanvas.width = width;
        hudCanvas.height = height;

        // Get 2D context and draw something supercool.
        const hudBitmap = hudCanvas.getContext('2d');
          hudBitmap.font = 'Normal 40px Arial';
        hudBitmap.textAlign = 'center';
        hudBitmap.fillStyle = 'rgba(245,245,245,0.75)';
        hudBitmap.fillText('Initializing...', width / 2, height * 0.75);

        const aspectRatio = width / height;
        // Create the camera and set the viewport to match the screen dimensions.
        this.cameraHud = new THREE.OrthographicCamera(Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / -2,
            Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / 2,
            Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / aspectRatio / 2,
            Settings.SCENE_SCALE * Settings.CAMERA_ORTHOGRAPHIC_FIELD_OF_VIEW / aspectRatio / -2,
            Settings.CAMERA_ORTHOGRAPHIC_NEAR_CLIPPING_PANE * Settings.SCENE_SCALE,
            Settings.CAMERA_ORTHOGRAPHIC_FAR_CLIPPING_PANE * Settings.SCENE_SCALE);
      
        // Create also a custom scene for HUD.
        this.sceneHud = new THREE.Scene();
       
          // Create texture from rendered graphics.
          const hudTexture = new THREE.Texture(hudCanvas) ;
          hudTexture.needsUpdate = true;
        
        // Create HUD material.
        const material = new THREE.MeshBasicMaterial( {map: hudTexture} );
        material.transparent = true;
      
        // Create plane to render the HUD. This plane fill the whole screen.
        const planeGeometry = new THREE.PlaneGeometry( width, height );
        const plane = new THREE.Mesh( planeGeometry, material );
        this.sceneHud.add( plane );
      
        
        
        
    }
}

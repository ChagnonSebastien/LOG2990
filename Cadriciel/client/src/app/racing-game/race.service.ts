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
          hudBitmap.font = 'Normal 100px Arial';
        hudBitmap.textAlign = 'center';
        hudBitmap.fillStyle = 'rgba(245,245,245,0.75)';
        hudBitmap.fillText('Initializing...', width / 2, height * 0.5);

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
      
        // laps to go
        const lapGeometry = new THREE.PlaneGeometry(width / 5, height * 0.75);
        const lapMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
        const lapMesh = new THREE.Mesh(lapGeometry, lapMaterial);
        lapMesh.position.x = -width * 0.4;

        this.sceneHud.add(lapMesh);
        
        // current position
        const positionGeometry = new THREE.PlaneGeometry(width / 5, height * 0.75);
        const positionMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
        const positionMesh = new THREE.Mesh(positionGeometry, positionMaterial);
        positionMesh.position.x = -width * 0.15;

        this.sceneHud.add(positionMesh);

        // lap time
        const lapTimeGeometry = new THREE.PlaneGeometry(width / 5, height * 0.75);
        const lapTimeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
        const lapTimeMesh = new THREE.Mesh(lapTimeGeometry, lapTimeMaterial);
        lapTimeMesh.position.x = width * 0.15;

        this.sceneHud.add(lapTimeMesh);

        // race time
        const raceTimeGeometry = new THREE.PlaneGeometry(width / 5, height * 0.75);
        const raceTimeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
        const raceTimeMesh = new THREE.Mesh(raceTimeGeometry, raceTimeMaterial);
        raceTimeMesh.position.x = width * 0.4;

        this.sceneHud.add(raceTimeMesh);
    }
}

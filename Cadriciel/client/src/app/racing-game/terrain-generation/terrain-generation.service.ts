import { DiamondSquareAlgorithmService } from './diamond-square-algorithm.service';
import { LineCalculationService } from '../line-calculation.service';
import { DecorElementsService } from './decor-elements.service';
import { Track } from '../track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Settings } from '../settings';

const assetsPath = '/assets';

const startPlaidPath = 'plaid_start_v2.jpg';
const oceanTexturePath = 'dirt-512.jpg';
const sandyTexturePath = 'sand-512.jpg';
const grassyTexturePath = 'grass-512.jpg';
const rockyTexturePath = 'rock-512.jpg';
const snowyTexturePath = 'snow-512.jpg';
const waterTexturePath = 'water512.jpg';

const trackColor = 0x101010;
const trackRoughness = 0.5;
const trackHeight = 64;
const heightMapPixelWidth = 256;
const heightMapStrength = 255;
const trackRadius = 10;

@Injectable()
export class TerrainGenerationService {

    private scene: THREE.Scene;

    private track: Track;

    private mapWidth: number;

    private heightTable: number[][];

    private heightMapSteps = 10;

    constructor(
        private decorElementsService: DecorElementsService,
        private lineCalculationService: LineCalculationService,
        private diamondSquareAlgorithmService: DiamondSquareAlgorithmService
    ) {
        this.heightTable = this.diamondSquareAlgorithmService.generate(this.heightMapSteps);
    }

    public generate(scene: THREE.Scene, track: Track, textureSky: THREE.Texture): void {
        this.scene = scene;
        this.track = track;

        this.decorElementsService.initialize(scene, track);

        const maximumX = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.x)) + 100;
        const minimumX = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.x)) - 100;
        const maximumY = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.y)) + 100;
        const minimumY = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.y)) - 100;
        this.mapWidth = 2 * Math.max(Math.abs(maximumX), Math.abs(minimumX), Math.abs(maximumY), Math.abs(minimumY));

        this.addObjectsInScene(textureSky);
        this.decorElementsService.placeDecor();
        this.decorElementsService.placeTrees();
        this.decorElementsService.placeObstacles();
    }

    private addObjectsInScene(textureSky: THREE.Texture) {

        this.scene.add(this.generateTerrain());
        this.scene.add(this.generateWater());
        this.scene.add(this.generateRaceStartPlaid());

        this.generateIntersections(textureSky).forEach(instersection => {
            this.scene.add(instersection);
        });

        this.generateSegments(textureSky).forEach(instersection => {
            this.scene.add(instersection);
        });
    }

    private generateHeightMap(): THREE.DataTexture {
        const imageBufferRGB = new Uint8Array(3 * heightMapPixelWidth * heightMapPixelWidth);

        for (let i = 0; i < heightMapPixelWidth; i++) {
            for (let j = 0; j < heightMapPixelWidth; j++) {

                // Converts i and j pixel from height map to track absolute position
                const x = j / heightMapPixelWidth * this.mapWidth - this.mapWidth / 2;
                const z = -(i / heightMapPixelWidth * this.mapWidth - this.mapWidth / 2);

                const height = this.heightAtPoint(x, z);
                this.decorElementsService.addTree( x, height, z );

                imageBufferRGB[(3 * i * heightMapPixelWidth) + (3 * j)] =      // Red
                imageBufferRGB[(3 * i * heightMapPixelWidth) + (3 * j) + 1] =  // Green
                imageBufferRGB[(3 * i * heightMapPixelWidth) + (3 * j) + 2] =  // Blue
                height + trackHeight; // Because the height map only takes positive values
            }
        }

        return new THREE.DataTexture( imageBufferRGB, heightMapPixelWidth, heightMapPixelWidth, THREE.RGBFormat );
    }

    private loadTexture(path: string): THREE.Texture {
        const texture = THREE.ImageUtils.loadTexture( `${assetsPath}/${path}` );
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    private generateTerrain(): THREE.Mesh {
        const heightMap = this.generateHeightMap();
        heightMap.wrapS = heightMap.wrapT = THREE.RepeatWrapping;
        heightMap.needsUpdate = true;

        const customUniforms = {
            bumpTexture:	{ type: 't', value: heightMap },
            bumpScale:	    { type: 'f', value: heightMapStrength * Settings.SCENE_SCALE },
            oceanTexture:	{ type: 't', value: this.loadTexture(oceanTexturePath) },
            sandyTexture:	{ type: 't', value: this.loadTexture(sandyTexturePath) },
            grassTexture:	{ type: 't', value: this.loadTexture(grassyTexturePath) },
            rockyTexture:	{ type: 't', value: this.loadTexture(rockyTexturePath) },
            snowyTexture:	{ type: 't', value: this.loadTexture(snowyTexturePath) },
        };


        const terrainMaterial = new THREE.ShaderMaterial({
            uniforms: customUniforms,
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent
        });

        const terrainGeometry = new THREE.PlaneGeometry(
            this.mapWidth * Settings.SCENE_SCALE, this.mapWidth * Settings.SCENE_SCALE, heightMapPixelWidth, heightMapPixelWidth);
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.rotation.x = -Math.PI / 2;
        terrain.position.y = -trackHeight * Settings.SCENE_SCALE;
        terrain.receiveShadow = true;

        return terrain;

    }

    private generateWater(): THREE.Mesh {
        const waterGeometry = new THREE.PlaneGeometry(this.mapWidth * Settings.SCENE_SCALE, this.mapWidth * Settings.SCENE_SCALE, 1, 1);
        const waterTexture = this.loadTexture(waterTexturePath);
        waterTexture.repeat.set( 20 , 20 );
        const waterMat = new THREE.MeshBasicMaterial({map: waterTexture, transparent: true, opacity: 0.40});
        const water = new THREE.Mesh(waterGeometry, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.y = -5;
        return water;

    }

    private heightAtPoint(x: number, y: number) {
        const availableRadius = this.track.distanceToPoint(new THREE.Vector2(x, y), this.lineCalculationService);

        // Converts the absolute scene cordinate to the height table coordinates
        const heightTableX = Math.floor((x + this.mapWidth / 2) * Math.pow(2, this.heightMapSteps) / this.mapWidth);
        const heightTableY = Math.floor((y + this.mapWidth / 2) * Math.pow(2, this.heightMapSteps) / this.mapWidth);

        // The sigmoid function assures a smooth transition between the normal terrain height and the track
        return availableRadius < trackRadius * 1.5 ? 0 : (
            (this.heightTable[heightTableX][heightTableY] - trackHeight) *
            this.sigmoid(1, trackRadius - 3 - (availableRadius - trackRadius) / 3)
        );
    }

    private sigmoid(L: number, x: number) {
        return L / (1 + Math.pow(Math.E, x));
    }

    private generateSegments(textureSky): THREE.Mesh[] {
        const material = new THREE.MeshStandardMaterial({color: trackColor, roughness: trackRoughness, envMap: textureSky});
        return this.track.trackIntersections.map((intersection, index, array) => {
            const segment = new THREE.Vector2().subVectors(array[index + 1 < array.length ? index + 1 : 0], intersection);

            const geometry = new THREE.PlaneGeometry(Settings.SCENE_SCALE * segment.length(), Settings.SCENE_SCALE * trackRadius * 2);
            geometry.rotateX(Math.PI / -2);

            const segmentMesh = new THREE.Mesh(geometry, material);
            segmentMesh.rotateY(- Math.atan((segment.y) / (segment.x)));
            segmentMesh.position.set(
                ((segment.x / 2) + intersection.x) * Settings.SCENE_SCALE, 2, ((segment.y / 2) + intersection.y) * Settings.SCENE_SCALE);
            segmentMesh.receiveShadow = true;
            return segmentMesh;
        });
    }

    private generateIntersections(textureSky): THREE.Mesh[] {
        const intersectionGeometry = new THREE.CircleGeometry(Settings.SCENE_SCALE * trackRadius, 32); // 32 is the resolution of the circle
        intersectionGeometry.rotateX(Math.PI / -2);
        const intersectionMaterial = new THREE.MeshStandardMaterial({color: trackColor, roughness: trackRoughness, envMap: textureSky});
        const intersection = new THREE.Mesh(intersectionGeometry, intersectionMaterial);
        intersection.receiveShadow = true;

        return this.track.trackIntersections.map(intersectionPosition => {
            const intersectionClone = intersection.clone();
            intersectionClone.position.set(intersectionPosition.x * Settings.SCENE_SCALE, 2, intersectionPosition.y * Settings.SCENE_SCALE);
            return intersectionClone;
        });
    }

    private generateRaceStartPlaid(): THREE.Mesh {
        const textureRatio = 20 / 3; // 3 / 20 is the texture ratio if the image
        const plaidGeometry = new THREE.PlaneGeometry(
            Settings.SCENE_SCALE * trackRadius * 2 / textureRatio, Settings.SCENE_SCALE * trackRadius * 2);
        plaidGeometry.rotateX(Math.PI / -2);

        const plaidTexture = this.loadTexture(startPlaidPath);
        const plaidMaterial = new THREE.MeshStandardMaterial({map: plaidTexture});
        const plaidMesh = new THREE.Mesh(plaidGeometry, plaidMaterial);

        const centerOfFirstSegment = this.track.centerOfFirstSegment();
        plaidMesh.rotateY(centerOfFirstSegment.rotation);
        plaidMesh.position.set(
            centerOfFirstSegment.position.x * Settings.SCENE_SCALE, 3, centerOfFirstSegment.position.y * Settings.SCENE_SCALE);
        return plaidMesh;
    }
}

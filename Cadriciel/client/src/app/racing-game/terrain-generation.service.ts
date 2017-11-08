import { DecorElementsService } from './decor-elements.service';
import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const trackRadius = 10;
const coneRadius = 1;
const votePanelRadius = 3;
const maximumSlope = 2;

@Injectable()
export class TerrainGenerationService {

    private track: Track;

    private trees: THREE.Vector3[] = [];

    private scale: number;

    private textureSky: THREE.Texture;

    private heightMap: number[][] = [[]];

    private heightMapSteps = 10;

    constructor(private decorElementsService: DecorElementsService) {
        console.log('constroctor begin');
        for (let i = 0; i < Math.pow(2, this.heightMapSteps); i++) {
            this.heightMap.push([]);
        }
        const width = Math.pow(2, this.heightMapSteps);
        this.heightMap[0][0] = Math.random() * 128;
        this.heightMap[0][width] = Math.random() * 128;
        this.heightMap[width][0] = Math.random() * 128;
        this.heightMap[width][width] = Math.random() * 128;

        let stepSize = width;
        console.log('terrain generation begin');
        while (stepSize > 1) {
            for (let i = 0; i < width / stepSize; i++) {
                for (let j = 0; j < width / stepSize; j++) {
                    this.diamondStep(i * stepSize, j * stepSize, stepSize);
                }
            }

            stepSize /= 2;

            for (let i = 0; i <= width / stepSize; i ++) {
                for (let j = 0; j <= width / stepSize; j ++) {
                    if ((i + j) % 2 === 1) {
                        this.squareStep(i * stepSize, j * stepSize, stepSize);
                    }
                }
            }
        }
        console.log('terrain generation end, constroctor end');
    }

    private diamondStep(x, y, stepSize) {
        const minimumValue = Math.min(
            this.heightMap[x][y],
            this.heightMap[x + stepSize][y],
            this.heightMap[x][y + stepSize],
            this.heightMap[x + stepSize][y + stepSize]
        );
        const maximumValue = Math.max(
            this.heightMap[x][y],
            this.heightMap[x + stepSize][y],
            this.heightMap[x][y + stepSize],
            this.heightMap[x + stepSize][y + stepSize]
        );

        const maximumRandomValue = Math.min(minimumValue + (maximumSlope * stepSize / 2), 128);
        const minimumRandomValue = Math.max(maximumValue - (maximumSlope * stepSize / 2), 0);

        let randomValue = Math.random();
        if (randomValue < 0.5) {
            randomValue = Math.random();
        }

        this.heightMap[x + stepSize / 2][y + stepSize / 2] = minimumRandomValue + randomValue * (maximumRandomValue - minimumRandomValue);
    }

    private squareStep(x, y, stepSize) {
        const width = Math.pow(2, this.heightMapSteps);
        const minimumValue = Math.min(
            x + stepSize > width ? Infinity : this.heightMap[x + stepSize][y],
            y + stepSize > width ? Infinity : this.heightMap[x][y + stepSize],
            x - stepSize < 0 ? Infinity : this.heightMap[x - stepSize][y],
            y - stepSize < 0 ? Infinity : this.heightMap[x][y - stepSize]
        );
        const maximumValue = Math.max(
            x + stepSize > width ? -Infinity : this.heightMap[x + stepSize][y],
            y + stepSize > width ? -Infinity : this.heightMap[x][y + stepSize],
            x - stepSize < 0 ? -Infinity : this.heightMap[x - stepSize][y],
            y - stepSize < 0 ? -Infinity : this.heightMap[x][y - stepSize]
        );

        const maximumRandomValue = Math.min(minimumValue + (maximumSlope * stepSize / 2), 128);
        const minimumRandomValue = Math.max(maximumValue - (maximumSlope * stepSize / 2), 0);

        let randomValue = Math.random();
        if (randomValue < 0.5) {
            randomValue = Math.random();
        }

        this.heightMap[x][y] = minimumRandomValue + randomValue * (maximumRandomValue - minimumRandomValue);
    }

    public generate(scene: THREE.Scene, scale: number, track: Track, textureSky: THREE.Texture): void {
        console.log('generate method begin');
        this.track = track;
        this.scale = scale;
        this.textureSky = textureSky;

        this.decorElementsService.placeDecor(scene, scale, track);
        this.addObjectsInScene(scene);
        console.log('generate method end');
    }

    private addObjectsInScene(scene: THREE.Scene) {

        console.log('table');
        this.generateTable(scene).forEach(triangle => {
            scene.add(triangle);
        });
        console.log('plaid');
        scene.add(this.generateRaceStartPlaid());

        console.log('intersection');
        this.generateIntersections().forEach(instersection => {
            scene.add(instersection);
        });

        console.log('segemnt');
        this.generateSegments().forEach(instersection => {
            scene.add(instersection);
        });
    }

    private addTrees(scene: THREE.Scene) {

        new THREE.ObjectLoader().load('/assets/tree.json', treeMesh => {
            treeMesh.scale.set(this.scale, this.scale, this.scale);
            this.trees.forEach(position => {
                const tree = treeMesh.clone();
                tree.position.set(position.x * this.scale, position.y * this.scale, position.z * this.scale);
                tree.rotateY(Math.PI * 2 * Math.random());
                scene.add(tree);
            });
        });
    }

    private generateTable(scene: THREE.Scene): THREE.Mesh[] {
        const maximumX = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.x)) + 100;
        const minimumX = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.x)) - 100;
        const maximumY = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.y)) + 100;
        const minimumY = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.y)) - 100;
        const extreme = Math.max(Math.abs(maximumX), Math.abs(minimumX), Math.abs(maximumY), Math.abs(minimumY));
        const mapWidth = 2 * extreme;

        const pixelWidth = 256;
        const dummyRGB = new Uint8Array(3 * pixelWidth * pixelWidth);
        for (let i = 0; i < pixelWidth; i++) {
            for (let j = 0; j < pixelWidth; j++) {
                const height = this.heightAtPoint(
                    j / pixelWidth * mapWidth - mapWidth / 2, -(i / pixelWidth * mapWidth - mapWidth / 2)
                ) + 64;

                if (height > 64 && height < 76 && Math.random() < 0.1) {
                    this.trees.push( new THREE.Vector3(
                        j / pixelWidth * mapWidth - mapWidth / 2, height - 64, -(i / pixelWidth * mapWidth - mapWidth / 2)
                    ));
                }

                dummyRGB[3 * i * pixelWidth + 3 * j] =
                dummyRGB[3 * i * pixelWidth + 3 * j + 1] =
                dummyRGB[3 * i * pixelWidth + 3 * j + 2] =
                height;
            }
        }

        const bumpTexture = new THREE.DataTexture( dummyRGB, pixelWidth, pixelWidth, THREE.RGBFormat );
        bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
        bumpTexture.needsUpdate = true;

        const bumpScale   = 255 * this.scale;

        const oceanTexture = THREE.ImageUtils.loadTexture( 'assets/dirt-512.jpg' );
        oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;

        const sandyTexture = THREE.ImageUtils.loadTexture( 'assets/sand-512.jpg' );
        sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping;

        const grassTexture = THREE.ImageUtils.loadTexture( 'assets/grass-512.jpg' );
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;

        const rockyTexture = THREE.ImageUtils.loadTexture( 'assets/rock-512.jpg' );
        rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping;

        const snowyTexture = THREE.ImageUtils.loadTexture( 'assets/snow-512.jpg' );
        snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;

        const customUniforms = {
            bumpTexture:	{ type: 't', value: bumpTexture },
            bumpScale:	    { type: 'f', value: bumpScale },
            oceanTexture:	{ type: 't', value: oceanTexture },
            sandyTexture:	{ type: 't', value: sandyTexture },
            grassTexture:	{ type: 't', value: grassTexture },
            rockyTexture:	{ type: 't', value: rockyTexture },
            snowyTexture:	{ type: 't', value: snowyTexture },
        };

        const customMaterial = new THREE.ShaderMaterial({
            uniforms: customUniforms,
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        });

        const planeGeo = new THREE.PlaneGeometry( mapWidth * this.scale, mapWidth * this.scale, pixelWidth, pixelWidth );
        const plane = new THREE.Mesh(	planeGeo, customMaterial );
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -64 * this.scale;

        const waterGeo = new THREE.PlaneGeometry( mapWidth * this.scale, mapWidth * this.scale, 1, 1 );
        const waterTex = THREE.ImageUtils.loadTexture( 'assets/water512.jpg' );
        waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;
        waterTex.repeat.set( 5 , 5 );
        const waterMat = new THREE.MeshBasicMaterial( {map: waterTex, transparent: true, opacity: 0.40} );
        const water = new THREE.Mesh(	waterGeo, waterMat );
        water.rotation.x = -Math.PI / 2;
        water.position.y = -5;

        this.addTrees(scene);
        return [plane, water];

    }

    private heightAtPoint(x: number, y: number) {
        const availableRadius = this.availableRadius(new THREE.Vector2(x, y));
        const maximumX = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.x)) + 100;
        const minimumX = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.x)) - 100;
        const maximumY = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.y)) + 100;
        const minimumY = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.y)) - 100;
        const extreme = Math.max(Math.abs(maximumX), Math.abs(minimumX), Math.abs(maximumY), Math.abs(minimumY));
        return availableRadius < trackRadius / 2 ? 0 : ((this.heightMap[
            Math.floor((x + extreme) * Math.pow(2, this.heightMapSteps) / 2 / extreme)
        ][
            Math.floor((y + extreme) * Math.pow(2, this.heightMapSteps) / 2 / extreme)
        ] - 64) * this.sigmoid(1, trackRadius - 3 - availableRadius / 3));
    }

    private sigmoid(L: number, x: number) {
        return L / (1 + Math.pow(Math.E, x));
    }

    private generateSegments(): THREE.Mesh[] {
        const material = new THREE.MeshStandardMaterial({color: 0x000000, metalness: 0, roughness: 0, envMap: this.textureSky});

        return this.track.trackIntersections.map((intersection, index, array) => {
            const fromPosition = intersection;
            const toPosition = array[index + 1 < array.length ? index + 1 : 0];

            const geometry = new THREE.PlaneGeometry(
                this.scale * this.getDistance(fromPosition, toPosition),
                this.scale * trackRadius * 2
            );
            geometry.rotateX(Math.PI / -2);

            const segmentMesh = new THREE.Mesh(geometry, material);

            segmentMesh.rotateY(- Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
            segmentMesh.position.x = (((toPosition.x - fromPosition.x) / 2) + fromPosition.x) * this.scale;
            segmentMesh.position.z = (((toPosition.y - fromPosition.y) / 2) + fromPosition.y) * this.scale;
            segmentMesh.position.y = 2;
            segmentMesh.castShadow = true;
            segmentMesh.receiveShadow = true;
            return segmentMesh;
        });
    }

    private getDistance(fromPosition: THREE.Vector2, toPosition: THREE.Vector2) {
        return Math.sqrt(Math.pow(fromPosition.x - toPosition.x, 2) + Math.pow(fromPosition.y - toPosition.y, 2));
    }

    private generateIntersections(): THREE.Mesh[] {
        const geometry = new THREE.CircleGeometry(this.scale * trackRadius, 32);
        geometry.rotateX(Math.PI / -2);
        const material = new THREE.MeshStandardMaterial({color: 0x000000, metalness: 0, roughness: 0, envMap: this.textureSky});

        return this.track.trackIntersections.map(intersection => {
            const intersectionMesh = new THREE.Mesh(geometry, material);
            intersectionMesh.position.x = intersection.x * this.scale;
            intersectionMesh.position.z = intersection.y * this.scale;
            intersectionMesh.position.y = 2;
            intersectionMesh.castShadow = true;
            intersectionMesh.receiveShadow = true;
            return intersectionMesh;
        });
    }

    private generateRaceStartPlaid(): THREE.Mesh {
        const geometry = new THREE.PlaneGeometry(this.scale * trackRadius * 2 / 20 * 3, this.scale * trackRadius * 2);
        geometry.rotateX(Math.PI / -2);
        const texture = THREE.ImageUtils.loadTexture('assets/plaid_start_v2.jpg');
        const material = new THREE.MeshStandardMaterial({map: texture, metalness: 0, roughness: 0, envMap: this.textureSky});
        const plaidMesh = new THREE.Mesh(geometry, material);

        const fromPosition = this.track.trackIntersections[0];
        const toPosition = this.track.trackIntersections[1];
        plaidMesh.rotateY(- Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
        plaidMesh.position.x = (((toPosition.x - fromPosition.x) / 2) + fromPosition.x) * this.scale;
        plaidMesh.position.z = (((toPosition.y - fromPosition.y) / 2) + fromPosition.y) * this.scale;
        plaidMesh.position.y = 3;

        return plaidMesh;
    }

    private getFreePropSpot(requiredRadius: number): { position: THREE.Vector2, rotation: number } {
        const segment = Math.floor(Math.random() * this.track.trackIntersections.length);
        const line = new THREE.Vector2().subVectors(this.track.trackIntersections[
            segment + 1 === this.track.trackIntersections.length ? 0 : segment + 1
        ], this.track.trackIntersections[segment]);
        const lineAngle = Math.atan(line.x / line.y) + Math.PI / 2;

        const randomPosition = line.multiplyScalar(Math.random()).add(this.track.trackIntersections[segment]);
        const randomOffset = new THREE.Vector2(Math.sin(lineAngle), Math.cos(lineAngle)).multiplyScalar(trackRadius + requiredRadius);
        return { position: randomPosition.add(randomOffset.multiplyScalar(Math.random() < 0.5 ? 1 : -1)), rotation: lineAngle};
    }

    private availableRadius(point: THREE.Vector2): number {
        const minimumDistanceToTrack = Math.min.apply(null, this.track.trackIntersections.map( (intersection, index, array) => {
            const line = {point1: intersection, point2: array[index + 1 === array.length ? 0 : index + 1]};
            return this.distanceFromPointToLine(point, line) - trackRadius;
        }));

        return minimumDistanceToTrack;
    }

    private distanceFromPointToLine(point: THREE.Vector2, line: {point1: THREE.Vector2, point2: THREE.Vector2}): number {
        const optimalPoint = this.getNearestPointOnLine(point, line);

        if (
            Math.min(line.point1.x, line.point2.x) <= optimalPoint.x &&
            Math.max(line.point1.x, line.point2.x) >= optimalPoint.x
        ) {
            return this.distance(point, optimalPoint);
        } else {
            return Math.min(this.distance(point, line.point1), this.distance(point, line.point2));
        }
    }

    public distance(point1: THREE.Vector2, point2: THREE.Vector2): number {
        return Math.sqrt(
            Math.pow((point1.x - point2.x), 2) +
            Math.pow((point1.y - point2.y), 2)
        );
    }

    private getNearestPointOnLine(point: THREE.Vector2, line: {point1: THREE.Vector2, point2: THREE.Vector2}) {
        const lineParameters = this.getLineParameters(line);
        const permenticularParameters = {
            a: lineParameters.b,
            b: -lineParameters.a,
            c: -((lineParameters.b * point.x) + (-lineParameters.a * point.y))
        };

        return this.twoLineIntersection(lineParameters, permenticularParameters);
    }

    private getLineParameters(line): { a: number, b: number, c: number } {
        const a = line.point1.y - line.point2.y;
        const b = line.point2.x - line.point1.x;
        const c = (line.point1.x * line.point2.y) - (line.point2.x * line.point1.y);
        return { a, b, c };
    }

    private twoLineIntersection(line1, line2): THREE.Vector2 {
        if (line1.a === 0) {
            const x = ((line1.c * line2.b) - (line1.b * line2.c)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return new THREE.Vector2(x, this.solveLineEquationWithX(x, line1));
        } else {
            const y = ((line1.a * line2.c) - (line1.c * line2.a)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return new THREE.Vector2(this.solveLineEquationWithY(y, line1), y);
        }
    }

    private solveLineEquationWithX(x, lineParameters): number {
        return ((lineParameters.a * x) + lineParameters.c) / -lineParameters.b;
    }

    private solveLineEquationWithY(y, lineParameters): number {
        return ((lineParameters.b * y) + lineParameters.c) / -lineParameters.a;
    }
}

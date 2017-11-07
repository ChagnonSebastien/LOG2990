import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const trackRadius = 10;
const coneRadius = 20;
const votePanelRadius = 4;

@Injectable()
export class TerrainGenerationService {

    private track: Track;

    private scale: number;

    private textureSky: THREE.Texture;

    private decorElements: {object: THREE.Mesh, radius: number}[] = [];

    constructor() {

    }

    public generate(scene: THREE.Scene, scale: number, track: Track, textureSky: THREE.Texture): void {
        this.track = track;
        this.scale = scale;
        this.textureSky = textureSky;

        this.addObjectsInScene(scene);
    }

    private addObjectsInScene(scene: THREE.Scene) {

        this.generateTable().forEach(triangle => {
            scene.add(triangle);
        });
        scene.add(this.generateRaceStartPlaid());

        this.generateIntersections().forEach(instersection => {
            scene.add(instersection);
        });

        this.generateSegments().forEach(instersection => {
            scene.add(instersection);
        });

        this.generateCones().then(cones => {
            cones.forEach(cone => {
                scene.add(cone);
            });
        });

        this.generateMichelElectionPanels().then(cones => {
            cones.forEach(cone => {
                scene.add(cone);
            });
        });

        this.generateDylanElectionPanels().then(cones => {
            cones.forEach(cone => {
                scene.add(cone);
            });
        });
    }

    private generateTable(): THREE.Mesh[] {
        const maximumX = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.x)) + 500;
        const minimumX = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.x)) - 500;
        const texture = THREE.ImageUtils.loadTexture('assets/GroundForest003_COL_VAR1_HIRES.jpg');
        const material = new THREE.MeshStandardMaterial( { map: texture, metalness: 0, roughness: 1, envMap: this.textureSky } );
        material.side = THREE.BackSide;
        const table: THREE.Mesh[] = [];

        for (let i = minimumX; i < maximumX; i += 5) {
            const mesh = new THREE.Mesh( this.generateTriangleStrip(i), material );
            mesh.drawMode = THREE.TriangleStripDrawMode;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            table.push(mesh);
        }

        return table;
    }

    private generateTriangleStrip(i: number): THREE.Geometry {
        const geometry = new THREE.Geometry();

        const maximumY = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.y)) + 100;
        const minimumY = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.y)) - 100;
        for (let j = minimumY; j < maximumY; j += 5) {
            geometry.vertices.push(
                new THREE.Vector3(i, this.heightAtPoint(i, j), j).multiplyScalar(this.scale),
                new THREE.Vector3((i + 5), this.heightAtPoint(i + 5, j), j).multiplyScalar(this.scale)
            );
        }

        for (let j = 0; j < (maximumY - minimumY) / 5 - 1; j++) {
            geometry.faces.push(
                new THREE.Face3( (2 * j) + 0, (2 * j) + 1, (2 * j) + 2),
                new THREE.Face3( (2 * j) + 1, (2 * j) + 2, (2 * j) + 3)
            );
            geometry.faceVertexUvs[0][2 * j] = [new THREE.Vector2(0, 0), new THREE.Vector2(0, 1), new THREE.Vector2(1, 0)];
            geometry.faceVertexUvs[0][(2 * j) + 1] = [new THREE.Vector2(0, 1), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)];
        }

        return geometry;
    }

    private heightAtPoint(x: number, y: number) {
        const availableRadius = this.availableRadius(new THREE.Vector2(x, y));
        return availableRadius > 0 ?
            this.sigmoid(1, (availableRadius - 60) / 4) * availableRadius * this.sigmoid(0.5, 6 - availableRadius / 2) : 0;
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

    private generateCones(): Promise<THREE.Mesh[]> {
        const service = this;
        const loaderPromise = new Promise<THREE.Mesh[]>(function(resolve, reject) {
            function loadDone(cone) {
                cone.scale.set(coneRadius * service.scale, coneRadius * service.scale, coneRadius * service.scale);
                const cones: THREE.Mesh[] = [];
                for (let i = 0; i < 10; i++) {
                    const newCone = <THREE.Mesh> cone.clone();
                    newCone.rotateY(Math.random() * Math.PI);
                    const newPosition = service.getFreePropSpot(coneRadius);
                    newCone.position.set(newPosition.x * service.scale, 0, newPosition.y * service.scale);
                    cones.push(newCone);
                    service.decorElements.push( {object: cone, radius: coneRadius} );
                }
                resolve(cones);
            }

            new THREE.ObjectLoader().load('/assets/cone.json', loadDone);
        });

        return loaderPromise;
    }

    private generateMichelElectionPanels(): Promise<THREE.Mesh[]> {
        const service = this;
        const loaderPromise = new Promise<THREE.Mesh[]>(function(resolve, reject) {
            function loadDone(cone) {
                cone.scale.set(votePanelRadius * service.scale, votePanelRadius * service.scale, votePanelRadius * service.scale);
                const cones: THREE.Mesh[] = [];
                for (let i = 0; i < 15; i++) {
                    const newCone = <THREE.Mesh> cone.clone();
                    newCone.rotateY(Math.random() * Math.PI);
                    const newPosition = service.getFreePropSpot(votePanelRadius);
                    newCone.position.set(newPosition.x * service.scale, 0, newPosition.y * service.scale);
                    cones.push(newCone);
                    service.decorElements.push( {object: cone, radius: votePanelRadius} );
                }
                resolve(cones);
            }

            new THREE.ObjectLoader().load('/assets/votonsmichel.json', loadDone);
        });

        return loaderPromise;
    }

    private generateDylanElectionPanels(): Promise<THREE.Mesh[]> {
        const service = this;
        const loaderPromise = new Promise<THREE.Mesh[]>(function(resolve, reject) {
            function loadDone(cone) {
                cone.scale.set(votePanelRadius * service.scale, votePanelRadius * service.scale, votePanelRadius * service.scale);
                const cones: THREE.Mesh[] = [];
                for (let i = 0; i < 15; i++) {
                    const newCone = <THREE.Mesh> cone.clone();
                    newCone.rotateY(Math.random() * Math.PI);
                    const newPosition = service.getFreePropSpot(votePanelRadius);
                    newCone.position.set(newPosition.x * service.scale, 0, newPosition.y * service.scale);
                    cones.push(newCone);
                    service.decorElements.push( {object: cone, radius: votePanelRadius} );
                }
                resolve(cones);
            }

            new THREE.ObjectLoader().load('/assets/votonsdylan.json', loadDone);
        });

        return loaderPromise;
    }

    private getFreePropSpot(requiredRadius: number) {
        const maximumX = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const minimumX = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.x));
        const maximumY = Math.max.apply(null, this.track.trackIntersections.map(intersection => intersection.y));
        const minimumY = Math.min.apply(null, this.track.trackIntersections.map(intersection => intersection.y));
        let point;
        let x = 100;
        do {
            point = new THREE.Vector2(
                minimumX + (Math.random() * (maximumX - minimumX)),
                minimumY + (Math.random() * (maximumY - minimumY))
            );
            x--;
        } while (this.availableRadius(point) < requiredRadius && x > 0);

        return point;
    }

    private availableRadius(point: THREE.Vector2): number {
        const minimumDistanceToTrack = Math.min.apply(null, this.track.trackIntersections.map( (intersection, index, array) => {
            const line = {point1: intersection, point2: array[index + 1 === array.length ? 0 : index + 1]};
            return this.distanceFromPointToLine(point, line) - trackRadius;
        }));

        const minimumDistanceToObject = Math.min.apply(null, this.decorElements.map( element => {
            return this.distance(
                new THREE.Vector2(
                    element.object.position.x / this.scale,
                    element.object.position.z / this.scale
                ), point
            ) - element.radius;
        }));

        return Math.min(minimumDistanceToObject, minimumDistanceToTrack);
    }

    private distanceFromPointToLine(point, line): number {
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

    public distance(point1: { x: number, y: number }, point2: { x: number, y: number }): number {
        return Math.sqrt(
            Math.pow((point1.x - point2.x), 2) +
            Math.pow((point1.y - point2.y), 2)
        );
    }

    private getNearestPointOnLine(point, line) {
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

    private twoLineIntersection(line1, line2): { x: number, y: number } {
        if (line1.a === 0) {
            const x = ((line1.c * line2.b) - (line1.b * line2.c)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return { x, y: this.solveLineEquationWithX(x, line1) };
        } else {
            const y = ((line1.a * line2.c) - (line1.c * line2.a)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return { x: this.solveLineEquationWithY(y, line1), y };
        }
    }

    private solveLineEquationWithX(x, lineParameters): number {
        return ((lineParameters.a * x) + lineParameters.c) / -lineParameters.b;
    }

    private solveLineEquationWithY(y, lineParameters): number {
        return ((lineParameters.b * y) + lineParameters.c) / -lineParameters.a;
    }
}

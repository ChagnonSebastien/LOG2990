import { ObstaclePositionService } from '../obstacle-position.service';
import { Obstacle, ObstacleType } from '../draw-track/obstacle';
import { LineCalculationService } from '../line-calculation.service';
import { Track } from '../track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Settings } from '../settings';

const trackRadius = 10;

const assetsPath = '/assets';

const coneAmount = 100;
const coneRadius = 1;
const conePath = 'cone.json';

const panelAmount = 10;
const panelRadius = 3;
const dylanPanelAmount = 'votonsdylan.json';
const michelPanelAmount = 'votonsmichel.json';

const treeMinimumHeight = 0.1;
const treeMaximumHeight = 12;
const treeRarity = 0.1;
const treePath = 'tree.json';

const boosterPath = 'booster.json';
const potholePath = 'pothole.json';
const puddlePath = 'puddle.json';

@Injectable()
export class DecorElementsService {

    private scene: THREE.Scene;

    private track: Track;

    private treesPositions: THREE.Vector3[] = [];

    constructor(private lineCalculationService: LineCalculationService, private obstacleService: ObstaclePositionService) {
    }

    public initialize(scene: THREE.Scene, track: Track): void {
        this.scene = scene;
        this.track = track;
    }

    public placeObstacles(): void {
        this.placeObstacleType(ObstacleType.Booster, this.track.boosters, boosterPath);
        this.placeObstacleType(ObstacleType.Pothole, this.track.potholes, potholePath);
        this.placeObstacleType(ObstacleType.Puddle, this.track.puddles, puddlePath);
    }

    public placeObstacleType(type: ObstacleType, obstacles: Obstacle[], path: string): void {
        this.loadMesh(path).then( obstacleMesh => {
            obstacleMesh.scale.set(Settings.SCENE_SCALE, Settings.SCENE_SCALE, Settings.SCENE_SCALE);
            this.obstacleService.getObstacles(type).forEach(obstaclePosition => {
                const obstacleClone = obstacleMesh.clone();
                obstacleClone.position.set(
                    (obstaclePosition.x) * Settings.SCENE_SCALE, 2, (obstaclePosition.y) * Settings.SCENE_SCALE);

                obstacleClone.rotateY(Math.PI * 2 * Math.random());
                this.scene.add(obstacleClone);
            });
        });
    }

    public placeDecor(): void {
        this.placeDecorElement(coneAmount, coneRadius, conePath);
        this.placeDecorElement(panelAmount, panelRadius, dylanPanelAmount);
        this.placeDecorElement(panelAmount, panelRadius, michelPanelAmount);
    }

    public addTree(x, y, z): void {
        if (y > treeMinimumHeight && y < treeMaximumHeight && Math.random() < treeRarity) {
            this.treesPositions.push( new THREE.Vector3(x, y, z));
        }
    }

    public placeTrees(): void {
        this.loadMesh(treePath).then( tree => {
            tree.scale.set(Settings.SCENE_SCALE, Settings.SCENE_SCALE, Settings.SCENE_SCALE);
            this.treesPositions.forEach(position => {
                const treeClone = tree.clone();
                treeClone.position.set(
                    position.x * Settings.SCENE_SCALE, position.y * Settings.SCENE_SCALE, position.z * Settings.SCENE_SCALE);
                treeClone.rotateY(Math.PI * 2 * Math.random());
                this.scene.add(treeClone);
            });
        });
    }

    private loadMesh(path: string): Promise<THREE.Mesh> {
        return new Promise<THREE.Mesh>((resolve, reject) => {
            new THREE.ObjectLoader().load(`${assetsPath}/${path}`, mesh => {
                resolve(<THREE.Mesh> mesh);
            });
        });
    }

    private placeDecorElement(amount: number, distanceFromTrack: number, path: string): void {
        this.loadMesh(path).then(mesh => {
            mesh.scale.set(Settings.SCENE_SCALE, Settings.SCENE_SCALE, Settings.SCENE_SCALE);

            for (let i = 0; i < amount; i++) {
                let availablePlacement: { position: THREE.Vector2, rotation: number };
                do {
                    availablePlacement = this.getFreePropPlacement(distanceFromTrack);
                } while (this.availableRadius(availablePlacement.position) < 1);

                const meshClone = <THREE.Mesh> mesh.clone();
                meshClone.position.set(
                    availablePlacement.position.x * Settings.SCENE_SCALE, 0, availablePlacement.position.y * Settings.SCENE_SCALE);
                meshClone.rotateY(availablePlacement.rotation);
                this.scene.add(meshClone);
            }
        });
    }

    private getFreePropPlacement(requiredRadius: number): { position: THREE.Vector2, rotation: number } {
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
        return Math.min.apply(null, this.track.trackIntersections.map( (intersection, index, array) => {
            const line = {point1: intersection, point2: array[index + 1 === array.length ? 0 : index + 1]};
            const nearestPoint = this.lineCalculationService.getNearestPointOnLineWithClamping(point, line);
            return this.lineCalculationService.distance(nearestPoint, point) - trackRadius;
        }));
    }
}

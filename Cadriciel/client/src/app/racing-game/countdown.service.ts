import { CountdownDecreaseEventService } from './events/countdown-decrease-event';
import { AudioService } from './audio.service';
import { Injectable } from '@angular/core';
import { Track } from './track';
import * as THREE from 'three';
import { CommandsService } from './events/commands.service';
import { Settings } from './settings';
import { RacingSceneService } from './racing-scene.service';

@Injectable()
export class CountdownService {
    public countdownMesh: THREE.Mesh;
    private font: THREE.Font;
    private count: number;
    public countdownStarted: boolean;
    public countdownEnded: boolean;

    constructor(
        private audioService: AudioService,
        commandService: CommandsService,
        private countdownDecreaseEventService: CountdownDecreaseEventService,
        private sceneService: RacingSceneService
    ) {
        this.count = 6;
        this.countdownStarted = false;
        this.countdownEnded = false;
    }

    public startGame() {
        this.countdownEnded = true;
    }

    public startCountdown() {
        if (!this.countdownStarted) {
            this.countdownStarted = true;
            this.startAudio();
            this.countdownDecreaseEventService.startCountDown(this.count);
        }
    }

    private startAudio() {
        this.audioService.startCountdown();
    }

    public createCountdown(track: Track): void {
        const loader = new THREE.FontLoader();
        let textGeometry: THREE.TextGeometry;
        const trackCenter = this.getCenterOfTrack(track);
        const service = this;
        loader.load('../../assets/font_samuel_regular.json', function (font) {
            service.font = font;
            textGeometry = new THREE.TextGeometry((service.count - 1).toString(), {
                font: font,
                size: 200,
                height: 0,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 1
            });
            const material = new THREE.MeshPhongMaterial({
                color: 0xffff00
            });
            service.countdownMesh = new THREE.Mesh(textGeometry, material);
            service.countdownMesh.position.setX(trackCenter.x * Settings.SCENE_SCALE);
            service.countdownMesh.position.setY((Settings.SCENE_SCALE * 20 / 25) + 3);
            service.countdownMesh.position.setZ(trackCenter.y * Settings.SCENE_SCALE);
            service.countdownMesh.geometry.rotateY(Math.PI / 2);
            service.sceneService.addObjectWithName(service.countdownMesh, 'countdown');
        });
    }

    public updateCountdown(count: number) {
        const countText = count.toString();

        const textGeometry = new THREE.TextGeometry(countText, {
            font: this.font,
            size: 200,
            height: 0,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 1
        });
        this.countdownMesh.geometry = textGeometry;
        this.countdownMesh.geometry.rotateY(Math.PI / 2);
    }

    private getCenterOfTrack(track: Track): THREE.Vector2 {
        const fromPosition = track.trackIntersections[0];
        const toPosition = track.trackIntersections[1];
        const xCenter = ((toPosition.x - fromPosition.x) / 2) + fromPosition.x;
        const yCenter = ((toPosition.y - fromPosition.y) / 2) + fromPosition.y;
        const center = new THREE.Vector2(xCenter, yCenter);

        return center;
    }
}

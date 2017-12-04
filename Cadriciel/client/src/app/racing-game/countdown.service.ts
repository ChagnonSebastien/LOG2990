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
        this.count = Settings.COUNTDOWN_TIME;
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
        loader.load(`${Settings.ASSETS_FOLDER}/${Settings.PATH_FONT_SAMUEL_REGULAR}`, function (font) {
            service.font = font;
            textGeometry = new THREE.TextGeometry((service.count - 1).toString(), {
                font: font,
                size: Settings.COUNTDOWN_TEXT_SIZE,
                height: Settings.COUNTDOWN_TEXT_HEIGHT,
                curveSegments: Settings.COUNTDOWN_TEXT_CURVE_SEGMENTS,
                bevelEnabled: Settings.COUNTDOWN_TEXT_BEVEL_ENABLES,
                bevelThickness: Settings.COUNTDOWN_TEXT_BEVEL_THICKNESS,
                bevelSize: Settings.COUNTDOWN_TEXT_BEVEL_SIZE
            });
            const material = new THREE.MeshPhongMaterial({
                color: Settings.COUNTDOWN_TEXT_COLOR
            });
            service.countdownMesh = new THREE.Mesh(textGeometry, material);
            service.countdownMesh.position.setX(trackCenter.x * Settings.SCENE_SCALE);
            service.countdownMesh.position.setY(Settings.TRACK_HEIGHT);
            service.countdownMesh.position.setZ(trackCenter.y * Settings.SCENE_SCALE);
            service.countdownMesh.geometry.rotateY(Settings.ASSETS_INITIAL_Y_ROTATION);
            service.sceneService.addObjectWithName(service.countdownMesh, Settings.COUNTDOWN_NAME);
        });
    }

    public updateCountdown(count: number) {
        const countText = count.toString();

        const textGeometry = new THREE.TextGeometry(countText, {
            font: this.font,
            size: Settings.COUNTDOWN_TEXT_SIZE,
            height: Settings.COUNTDOWN_TEXT_HEIGHT,
            curveSegments: Settings.COUNTDOWN_TEXT_CURVE_SEGMENTS,
            bevelEnabled: Settings.COUNTDOWN_TEXT_BEVEL_ENABLES,
            bevelThickness: Settings.COUNTDOWN_TEXT_BEVEL_THICKNESS,
            bevelSize: Settings.COUNTDOWN_TEXT_BEVEL_SIZE
        });
        this.countdownMesh.geometry = textGeometry;
        this.countdownMesh.geometry.rotateY(Settings.ASSETS_INITIAL_Y_ROTATION);
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

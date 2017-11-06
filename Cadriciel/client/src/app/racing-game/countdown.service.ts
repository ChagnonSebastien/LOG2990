import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as THREE from 'three';
@Injectable()
export class CountdownService {
    private countdownSubject: Subject<any>;

    public startCountdown(countdown: Observable<number>, count: number): Observable<number> {
        countdown = Observable.timer(0, 1000)
            .take(count)
            .map(() => --count);
        return countdown;
    }

    public async createCountdown() {
        const loader = new THREE.FontLoader();
        await loader.load('../../assets/font_samuel_regular.json', function(font) {
            const geometry = new THREE.TextGeometry('Hello world!', {
                font: font,
                size: 80,
                height: 5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
            });
            const textMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, specular: 0xffffff});
            const mesh = new THREE.Mesh(geometry, textMaterial);
            this.alertCountdownCreated(mesh);
        });
    }

    private alertCountdownCreated(countdown: THREE.Mesh) {
        this.countdownSubject.next(countdown);
    }

    public countdownCreatedAlerts(): Observable<any> {
        return this.countdownSubject.asObservable();
    }
}

import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class LineCalculationService {

    constructor() {
    }

    public getNearestPointOnLineWithClamping(point: THREE.Vector2, line: {point1: THREE.Vector2, point2: THREE.Vector2}): THREE.Vector2 {
        const optimalPoint = this.getNearestPointOnLineWithoutClamping(point, line);

        if (
            Math.min(line.point1.x, line.point2.x) <= optimalPoint.x &&
            Math.max(line.point1.x, line.point2.x) >= optimalPoint.x &&
            Math.min(line.point1.y, line.point2.y) <= optimalPoint.y &&
            Math.max(line.point1.y, line.point2.y) >= optimalPoint.y
        ) {
            return optimalPoint;
        } else {
            if (this.distance(point, line.point1) < this.distance(point, line.point2)) {
                return line.point1;
            } else {
                return line.point2;
            }
        }
    }

    public getNearestPointOnLineWithoutClamping(point: THREE.Vector2, line: {point1: THREE.Vector2, point2: THREE.Vector2}): THREE.Vector2 {
        const lineParameters = this.getLineParameters(line);
        const permenticularParameters = {
            a: lineParameters.b,
            b: -lineParameters.a,
            c: -((lineParameters.b * point.x) + (-lineParameters.a * point.y))
        };

        return this.twoLineIntersection(lineParameters, permenticularParameters);
    }

    public distance(point1: THREE.Vector2, point2: THREE.Vector2): number {
        return Math.sqrt(
            Math.pow((point1.x - point2.x), 2) +
            Math.pow((point1.y - point2.y), 2)
        );
    }

    public getLineParameters(line: {point1: THREE.Vector2, point2: THREE.Vector2}): { a: number, b: number, c: number } {
        const a = line.point1.y - line.point2.y;
        const b = line.point2.x - line.point1.x;
        const c = (line.point1.x * line.point2.y) - (line.point2.x * line.point1.y);
        return { a, b, c };
    }

    public twoLineIntersection(line1: { a: number, b: number, c: number }, line2: { a: number, b: number, c: number }): THREE.Vector2 {
        if (line1.a === 0) {
            const x = ((line1.c * line2.b) - (line1.b * line2.c)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return new THREE.Vector2(x, this.solveLineEquationWithX(x, line1));
        } else {
            const y = ((line1.a * line2.c) - (line1.c * line2.a)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return new THREE.Vector2(this.solveLineEquationWithY(y, line1), y);
        }
    }

    public solveLineEquationWithX(x: number, lineParameters: { a: number, b: number, c: number }): number {
        return ((lineParameters.a * x) + lineParameters.c) / -lineParameters.b;
    }

    public solveLineEquationWithY(y: number, lineParameters: { a: number, b: number, c: number }): number {
        return ((lineParameters.b * y) + lineParameters.c) / -lineParameters.a;
    }

}

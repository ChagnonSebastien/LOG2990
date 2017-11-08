import { LineCalculationService } from './line-calculation.service';
import { DecorElementsService } from './decor-elements.service';
import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const assetsPath = '/assets';

const startPlaidPath = 'plaid_start_v2.jpg';
const oceanTexturePath = 'dirt-512.jpg';
const sandyTexturePath = 'sand-512.jpg';
const grassyTexturePath = 'grass-512.jpg';
const rockyTexturePath = 'rock-512.jpg';
const snowyTexturePath = 'snow-512.jpg';
const waterTexturePath = 'water512.jpg';

const trackColor = 0x000000;
const trackRoughness = 0;
const trackHeight = 64;
const heightMapPixelWidth = 256;
const heightMapStrength = 255;
const trackRadius = 10;
const maximumSlope = 2;

@Injectable()
export class DiamondSquareAlgorithmService {

    public generate(heightMapSteps: number): number[][] {
        const heightTable: number[][] = this.initializeheightTable(heightMapSteps);
        this.populateTable(heightTable, heightMapSteps);
        return heightTable;
    }

    private initializeheightTable(heightMapSteps: number): number[][] {
        const heightTable: number[][] = [[]];
        for (let i = 0; i < Math.pow(2, heightMapSteps); i++) {
            heightTable.push([]);
        }

        const width = Math.pow(2, heightMapSteps);
        heightTable[0][0] = Math.random() * 128;
        heightTable[0][width] = Math.random() * 128;
        heightTable[width][0] = Math.random() * 128;
        heightTable[width][width] = Math.random() * 128;
        return heightTable;
    }

    private populateTable(heightTable: number[][], heightMapSteps: number) {
        const width = Math.pow(2, heightMapSteps);
        let stepSize = width;
        while (stepSize > 1) {
            for (let i = 0; i < width / stepSize; i++) {
                for (let j = 0; j < width / stepSize; j++) {
                    this.diamondStep(heightTable, i * stepSize, j * stepSize, stepSize);
                }
            }

            stepSize /= 2;

            for (let i = 0; i <= width / stepSize; i ++) {
                for (let j = 0; j <= width / stepSize; j ++) {
                    if ((i + j) % 2 === 1) {
                        this.squareStep(heightTable, i * stepSize, j * stepSize, stepSize, heightMapSteps);
                    }
                }
            }
        }
    }

    private diamondStep(heightTable: number[][], x, y, stepSize) {
        const minimumValue = Math.min(
            heightTable[x][y],
            heightTable[x + stepSize][y],
            heightTable[x][y + stepSize],
            heightTable[x + stepSize][y + stepSize]
        );
        const maximumValue = Math.max(
            heightTable[x][y],
            heightTable[x + stepSize][y],
            heightTable[x][y + stepSize],
            heightTable[x + stepSize][y + stepSize]
        );

        const maximumRandomValue = Math.min(minimumValue + (maximumSlope * stepSize / 2), 128);
        const minimumRandomValue = Math.max(maximumValue - (maximumSlope * stepSize / 2), 0);

        heightTable[x + stepSize / 2][y + stepSize / 2] = minimumRandomValue + this.random() * (maximumRandomValue - minimumRandomValue);
    }

    private squareStep(heightTable: number[][], x, y, stepSize, heightMapSteps) {
        const width = Math.pow(2, heightMapSteps);
        const minimumValue = Math.min(
            x + stepSize > width ? Infinity : heightTable[x + stepSize][y],
            y + stepSize > width ? Infinity : heightTable[x][y + stepSize],
            x - stepSize < 0 ? Infinity : heightTable[x - stepSize][y],
            y - stepSize < 0 ? Infinity : heightTable[x][y - stepSize]
        );
        const maximumValue = Math.max(
            x + stepSize > width ? -Infinity : heightTable[x + stepSize][y],
            y + stepSize > width ? -Infinity : heightTable[x][y + stepSize],
            x - stepSize < 0 ? -Infinity : heightTable[x - stepSize][y],
            y - stepSize < 0 ? -Infinity : heightTable[x][y - stepSize]
        );

        const maximumRandomValue = Math.min(minimumValue + (maximumSlope * stepSize / 2), 128);
        const minimumRandomValue = Math.max(maximumValue - (maximumSlope * stepSize / 2), 0);

        heightTable[x][y] = minimumRandomValue + this.random() * (maximumRandomValue - minimumRandomValue);
    }

    private random(): number {
        let randomValue = Math.random();
        if (randomValue < 0.5) {
            // Doubles the chances of the terrain going up
            randomValue = Math.random();
        }
        return randomValue;
    }
}

export class Track {

    id: number;
    name: string;
    description: string = '';
    type: string;
    trackIntersections: [{ x: number, y: number }];
    puddles: [{ distance: number, offset: number }];
    potholes: [{ distance: number, offset: number }];
    boosters: [{ distance: number, offset: number }];

    constructor(id: number, name: string, description: string, type: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
    }

    public addIntersections([distance, offset]) {
        this.trackIntersections.push(distance, offset);
    }

    public addPuddles([distance, offset]) {
        this.puddles.push(distance, offset);
    }

    public addPotholes([distance, offset]) {
        this.potholes.push(distance, offset);
    }

    public addBoosters([distance, offset]) {
        this.boosters.push(distance, offset);
    }
}

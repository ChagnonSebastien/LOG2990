export class Track {

    public trackId: number;
    public name: string;
    public description = '';
    public type: string;
    public trackIntersections: { x: number, y: number }[] = [];
    public puddles: { segment: number, distance: number, offset: number }[] = [];
    public potholes: { segment: number, distance: number, offset: number }[] = [];
    public boosters: { segment: number, distance: number, offset: number }[] = [];

    constructor(
        id: number,
        name: string,
        description: string,
        type: string,
        intersections: { x: number, y: number }[],
        puddles: { segment: number, distance: number, offset: number }[],
        potholes: { segment: number, distance: number, offset: number }[],
        boosters: { segment: number, distance: number, offset: number }[]
    ) {
        this.trackId = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.trackIntersections = intersections;
        this.puddles = puddles;
        this.potholes = potholes;
        this.boosters = boosters;
    }
}

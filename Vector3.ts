class Vector3
{
    x : number;
    y : number;
    z : number;

    constructor (x : number, y: number, z: number)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public GetVector2() : Vector2
    {
        return new Vector2(this.x, this.y);
    }

    public static Distance(one: Vector3, two: Vector3)
    {
        return Math.sqrt (
            Math.pow(one.x - two.x, 2) +
            Math.pow(one.y - two.y, 2) +
            Math.pow(one.z - two.z, 2)
        )
    }
}
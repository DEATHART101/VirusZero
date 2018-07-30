class Vector2
{
    x : number;
    y : number;

    constructor (x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    public Minus(other: Vector2)
    {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    public Add(other: Vector2)
    {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    public Dot(other: Vector2)
    {
        return this.x * other.x + this.y * other.y;
    }

    public Multiple(factor: number)
    {
        return new Vector2(this.x * factor, this.y * factor);
    }

    public GetVector3() : Vector3
    {
        return new Vector3(this.x, this.y, 0);
    }

    public static Distance(one: Vector2, two: Vector2) : number
    {
        return Math.sqrt(
            Math.pow(one.x - two.x, 2) + Math.pow(one.y - two.y, 2)
            );
    }
}

class Camera extends Component
{
    public static main : Camera = null;

    private static m_renderers = new List<SpriteRenderer>();

    private m_screenWidth : number;
    private m_screenRatio : number;

    private m_aspectRatio = 1.777;
    private m_width = 1400;

    private m_transform : Transform;

    constructor ()
    {
        super();

        Camera.main = this;
        this.m_transform = null;
        this.m_screenWidth = 1334;
        this.m_screenRatio = 1.7777;
    }

    public Awake() : void
    {
        this.m_transform = this.GetGameObject().GetTransform();
    }

    public Update() : void
    {
        this.RenderGame();
    }

    // Public to XEngine.
    public static RegesiterRenderer(rd: SpriteRenderer)
    {
        this.m_renderers.push(rd);
    }

    // Public to XEngine.
    public static UnRegesiterRenderer(rd: SpriteRenderer)
    {
        this.m_renderers.remove(rd);
    }

    public SetWidht(width: number) : void
    {
        this.m_width = width;
    }

    private RenderGame()
    {
        let iter = Camera.m_renderers.GetIterator();
        while (iter.has_value())
        {
            let value = iter.next();
            if (value.GetSprite() === null)
            {
                continue;
            }

            value.PositionSprite();
        }
    }

    public ScreenToWorldPosition(position: Vector3) : Vector3
    {
        let camera_pos = this.m_transform.GetPosition();
        let screen_height = this.m_screenWidth / this.m_screenRatio;
        let height = this.m_width / this.m_aspectRatio;
        let screen2world_w = this.m_width / this.m_screenWidth;
        let screen2world_h = height / screen_height;

        let result_pos = new Vector3(0, 0, position.z);
        result_pos.x = position.x - this.m_screenWidth / 2;
        result_pos.y = screen_height / 2 - position.y;

        result_pos.x = result_pos.x * screen2world_w;
        result_pos.y = result_pos.y * screen2world_h;

        result_pos.x = result_pos.x + camera_pos.x;
        result_pos.y = result_pos.y + camera_pos.y;

        return result_pos;
    }

    public WorldToScreenPosition(position: Vector3) : Vector3
    {
        let camera_pos = this.m_transform.GetPosition();
        let screen_height = this.m_screenWidth / this.m_screenRatio;
        let height = this.m_width / this.m_aspectRatio;
        let screen2world_w = this.m_width / this.m_screenWidth;
        let screen2world_h = height / screen_height;

        let result_pos = new Vector3(0, 0, position.z);
        result_pos.x = position.x - camera_pos.x;
        result_pos.y = position.y - camera_pos.y;
        
        result_pos.x = result_pos.x / screen2world_w;
        result_pos.y = result_pos.y / screen2world_h;

        result_pos.x = result_pos.x + this.m_screenWidth / 2;
        result_pos.y = screen_height / 2 - result_pos.y;

        return result_pos;
    }
}
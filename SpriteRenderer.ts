class SpriteRenderer extends Component
{
    private m_sprite : Sprite;

    constructor ()
    {
        super();
        this.m_componentType = ComponentTypes.SpriteRenderer;

        this.m_sprite = null;
    }

    public SetSprite(sprite : Sprite)
    {
        if (this.m_sprite !== null)
        {
            Laya.stage.removeChild(this.m_sprite);
        }
        this.m_sprite = sprite;
        if (this.m_sprite !== null)
        {
            this.PositionSprite();
            Laya.stage.addChild(this.m_sprite);
        }
    }

    public GetSprite() : Sprite
    {
        return this.m_sprite;
    }

    // public to: Camera.
    public PositionSprite() : void
    {
        let screen_pos = Camera.main.WorldToScreenPosition(this.GetGameObject().GetTransform().GetPosition());
        this.m_sprite.pos(
            screen_pos.x,
            screen_pos.y
            );
    }
}
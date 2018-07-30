class Transform extends Component
{
    private m_position : Vector3;

    constructor (position : Vector3)
    {
        super();
        this.m_componentType = ComponentTypes.Transform;
        this.m_position = position;
    }

    public SetPosition(position : Vector3) : void 
    {
        this.m_position = position;
    }

    public GetPosition() : Vector3
    {
        return this.m_position;
    }
}
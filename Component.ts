// Thanks to javascript, I have to do this instead of dynamic cast.
enum ComponentTypes {
    Transform = 0,
    Camera,
    GameController,
    PlayerController,
    SpriteRenderer,
    Cell,
    Tentacle
};

class Component
{
    private m_gameObject : GameObject;
    private m_enabled : Boolean;
    protected m_componentType : ComponentTypes;

    constructor ()
    {
        this.m_enabled = false;
        this.m_gameObject = null;
        this.m_componentType = undefined;
    }

    // Called when game is initialized.
    public Awake () : void
    {
        
    }

    // Called per frame
    public Update () : void
    {

    }

    public GetComponentType() : ComponentTypes
    {
        return this.m_componentType;
    }

    // Return the gameobject that this component is attached to.
    public GetGameObject() : GameObject
    {
        return this.m_gameObject;
    }

    // Public to: GameObject
    public SetParentGameObject(parent_go : GameObject) : void
    {
        this.m_gameObject = parent_go;
    }

    public Destroy() : void
    {
        this.OnDestroy();
        this.GetGameObject().RemoveComponent(this);
    }

    public OnDestroy() : void
    {
        
    }
}
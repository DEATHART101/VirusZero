class GameObject
{
    private m_name : string;
    private m_transform : Transform;
    private m_components = new List<Component>();

    constructor (name : string, position : Vector3) 
    {
        this.m_name = name;
        this.m_transform = new Transform(position);
    }

    public GetName() : string
    {
        return this.m_name;
    }

    public AwakeComponents () : void
    {
        let call_awake = function (value : Component) : void
        {
            value.Awake();
        }
        this.m_components.enumerate(call_awake);
    }

    public UpdateComponents () : void
    {
        let call_update = function (value : Component) : void
        {
            value.Update();
        }
        this.m_components.enumerate(call_update);
    }

    public GetTransform() : Transform
    {
        return this.m_transform;
    }

    public GetComponent(component_type : ComponentTypes) : Component
    {
        let list_iterator = this.m_components.GetIterator();
        while (list_iterator.has_value())
        {
            let comp = list_iterator.next();
            if (comp.GetComponentType() === component_type)
            {
                return comp;
            }
        }

        return null;
    }

    public AddComponent(component_type : ComponentTypes) : any
    {
        let new_com : Component;

        switch (component_type)
        {
            case ComponentTypes.Transform:
            alert("Component of type Transform Cannot be created mannuly.");
            break;
            case ComponentTypes.Camera:
            new_com = new Camera();
            this.m_components.push(new_com);
            break;
            case ComponentTypes.GameController:
            new_com = new GameController();
            this.m_components.push(new_com);
            break;
            case ComponentTypes.PlayerController:
            new_com = new PlayerController();
            this.m_components.push(new_com);
            break;
            case ComponentTypes.SpriteRenderer:
            let sr = new SpriteRenderer();
            new_com = sr;
            this.m_components.push(new_com);
            XEngine.RegisterRenderer(sr);
            break;
            case ComponentTypes.Cell:
            new_com = new Cell();
            this.m_components.push(new_com);
            break;
            case ComponentTypes.Tentacle:
            new_com = new Tentacle();
            this.m_components.push(new_com);
            break;
            default:
            break;
        }

        if (new_com === null)
        {
            alert("Component creation failed.");
        }
        else
        {
            new_com.SetParentGameObject(this);
            new_com.Awake();
        }

        return new_com;
    } 

    public RemoveComponent(component: Component) : void
    {
        this.m_components.remove(component);
    }

    public Destroy() : void
    {
        XEngine.DestroyGameObject(this);
    }
}
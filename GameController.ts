enum TeamTypes {
    Red,
    Green,
    Neutral
}

class GameController extends Component
{
    public static main : GameController = null;

    private m_cells = new List<Cell>();

    constructor ()
    {
        super();
        this.m_componentType = ComponentTypes.GameController;
    }

    public static RegisterCell(cell : Cell)
    {
        this.main.m_cells.push(cell);
    }

    public static UnRegisterCell(cell : Cell)
    {
        this.main.m_cells.remove(cell);
    }

    public GetCells() : List<Cell>
    {
        return this.m_cells;
    }

    public Awake() : void
    {
        GameController.main = this;
    }

    public Update() : void
    {
        if (XScene.GetCurrentSceneName() !== undefined)
        {
            XScene.GetCurrentSceneName() === SceneName.Level1;

            let iter = this.m_cells.GetIterator();
            while (iter.has_value())
            {
                let value = iter.next();
                if (value.GetTeamType() === TeamTypes.Red)
                {
                    return;
                }
            }

            XScene.LoadScene(SceneName.Level2);
        }
    }
}
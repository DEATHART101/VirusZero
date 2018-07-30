enum CellClasses {
    Spore,
    Embryo,
    Pulsar_a,
    Pulsar_b,
    Ant,
    Predator
}

enum CellEvents
{
    OnSpawn = 0, // When a cell is spawned, A is the cell.
    OnCellOutOfProtons,   // When a cell is used out of protons, A is the tentacle using protons.
    OnOutTentacle, // When a cell is attacking another, A is the tentacle created.
    OnTentacleReachCell, // When a tentacle reached the victim, A is the tentacle instance.
    OnTentacleReachTentacle, // When a tentacle reached the victim's tentacle, A and B are the tentacles, this event will be called twice.
    OnTentacleReachMiddle,  // When a tentacle reached middle, A is owener's tentacle, this event will be called on both side.
    OnTentacleBreak, // When a tentacle is breaked, A is the tentacle, B is the tentacle state.
    OnTentacleRetrieved, // When a tentacle is retrieved, A is the tentacle.
    OnTentacleSuoHaed, // When a tentacle completely enter destination cell, A is the tentacle.
}

class Cell extends Component
{
    private m_growSpeed : number = 0;

    private m_selected : boolean = false;
    
    // None null class
    private m_belongTeam : TeamTypes = TeamTypes.Neutral;
    private m_cellClass : CellClasses = CellClasses.Spore;
    private m_currentProton : number = 5;
    private m_maxProton : number = 200;

    // Null class
    private m_occupiedProntons : number = 0;
    private m_occupiedMax : number = 3;
    private m_occupiedTeam : TeamTypes = TeamTypes.Neutral;

    // Tentacles
    private m_outTentacles : List<Tentacle> = new List<Tentacle>();

    m_tenAttackingTo = new List<Cell>();
    m_tenAttackingFrom = new List<Cell>();

    private static GetMaxTentacleCount(cls: CellClasses) : number
    {
        return 2;
    }

    constructor ()
    {
        super();

        GameController.RegisterCell(this);
    }

    // public to: XEngine.
    public SetCell(team: TeamTypes, current_proton: number = 10) : void
    {
        this.m_belongTeam = team;
        this.m_currentProton = current_proton;
    }

    // public to: Tentacle.
    public GetTentacles() : List<Tentacle>
    {
        return this.m_outTentacles;
    }

    public GetCellClass() : CellClasses
    {
        return this.m_cellClass;
    }

    public GetTeamType() : TeamTypes
    {
        return this.m_belongTeam;
    }

    // public to: Tentacle.
    public TakeProton(to_go: number, hostile: boolean = false) : boolean
    {
        if (this.m_currentProton - to_go < 0)
        {
            if (!hostile)
            {
                return false;
            }
            else
            {
                this.TakeOver();
                this.m_currentProton += to_go;
            }
        }
        else if (this.m_currentProton - to_go > this.m_maxProton)
        {
            this.m_currentProton = this.m_maxProton;
            return true;
        }
        else
        {
            this.m_currentProton -= to_go;
            return true;
        }        
    }

    public TakeOver()
    {
        if (this.m_belongTeam === TeamTypes.Neutral)
        {
            this.m_belongTeam = this.m_occupiedTeam;
            this.m_occupiedProntons = 0;
        }
        else
        {
            if (this.m_belongTeam === TeamTypes.Green)
            {
                this.m_belongTeam = TeamTypes.Red;
            }
            else
            {
                this.m_belongTeam = TeamTypes.Green;
            }

            this.m_currentProton = 10;
        }
    }

    public SetSelected(selected: boolean) : void
    {
        this.m_selected = selected;
    }

    public ConnectTo(cell: Cell) : void
    {
        // If reached max tentacle count.
        if (this.m_outTentacles.length() >= Cell.GetMaxTentacleCount(this.m_cellClass))
        {
            return;
        }

        // If this cell has already connected to cell.
        let iter = this.m_outTentacles.GetIterator();
        while (iter.has_value())
        {
            let value = iter.next();
            if (value.GetVictim() === cell)
            {
                return;
            }
        }

        let go = XEngine.CreateGameObject("tentacle", this.GetGameObject().GetTransform().GetPosition());
        let ten = <Tentacle>go.AddComponent(ComponentTypes.Tentacle);
        ten.SetTentacle(this, cell);
        this.m_outTentacles.push(ten);
    }

    // Update the class of the cell according to the current protons.
    private UpdateClass()
    {
        switch (this.m_cellClass)
        {
            case CellClasses.Spore:
            {
                if (this.m_currentProton >= 15)
                {
                    this.m_cellClass = CellClasses.Embryo;
                }
            }
            break;
            case CellClasses.Embryo:
            {
                if (this.m_currentProton <= 10)
                {
                    this.m_cellClass = CellClasses.Spore;
                }
                else if (this.m_currentProton >= 30)
                {
                    this.m_cellClass = CellClasses.Pulsar_a;
                }
            }
            break;
            case CellClasses.Pulsar_a:
            {
                if (this.m_currentProton <= 24)
                {
                    this.m_cellClass = CellClasses.Embryo;
                }
                else if (this.m_currentProton >= 60)
                {
                    this.m_cellClass = CellClasses.Pulsar_b;
                }
            }
            break;
            case CellClasses.Pulsar_b:
            {
                if (this.m_currentProton <= 50)
                {
                    this.m_cellClass = CellClasses.Pulsar_a;
                }
                else if (this.m_currentProton >= 100)
                {
                    this.m_cellClass = CellClasses.Ant;
                }
            }
            break;
            case CellClasses.Ant:
            {
                if (this.m_currentProton <= 80)
                {
                    this.m_cellClass = CellClasses.Pulsar_b;
                }
                else if (this.m_currentProton >= 150)
                {
                    this.m_cellClass = CellClasses.Predator;
                }
            }
            break;
            case CellClasses.Predator:
            {
                if (this.m_currentProton <= 130)
                {
                    this.m_cellClass = CellClasses.Ant;
                }
            }
            break;
            default:
            this.m_cellClass = CellClasses.Spore;
            break;
        }
    }

    public Update()
    {
        // Update growspeed.
        if (this.m_belongTeam === TeamTypes.Neutral)
        {
            this.m_growSpeed = 0;

            if (this.m_tenAttackingFrom.length() !== 0)
            {
                let red_speed = 0;
                let green_speed = 0;

                let iter = this.m_tenAttackingFrom.GetIterator();
                while (iter.has_value())
                {
                    let value = iter.next();
                    if (value.m_belongTeam === TeamTypes.Green)
                    {
                        green_speed += Cell.GetAttackSpeed(value.m_cellClass);
                    }
                    else
                    {
                        red_speed += Cell.GetAttackSpeed(value.m_cellClass);
                    }
                }

                if (this.m_occupiedTeam === TeamTypes.Neutral)
                {
                    if (red_speed !== 0 || green_speed !== 0)
                    {
                        if (red_speed > green_speed)
                        {
                            this.m_growSpeed = red_speed - green_speed;
                            this.m_occupiedTeam = TeamTypes.Red;
                        }
                        else if (green_speed > red_speed)
                        {
                            this.m_growSpeed = green_speed - red_speed;
                            this.m_occupiedTeam = TeamTypes.Green;
                        }
                    }
                }
                else
                {
                    if (this.m_occupiedTeam === TeamTypes.Red)
                    {
                        this.m_growSpeed = red_speed - green_speed;
                    }
                    else
                    {
                        this.m_growSpeed = green_speed - red_speed;
                    }
                }
            }
        }
        else
        {
            this.m_growSpeed = Cell.GetProtonGenSpeed(this.m_cellClass);
            this.m_growSpeed -= Cell.GetAttackSpeed(this.m_cellClass) * this.m_tenAttackingTo.length();

            let iter = this.m_tenAttackingFrom.GetIterator();
            while (iter.has_value())
            {
                let value = iter.next();
                if (value.IsEnemy(this))
                {
                    this.m_growSpeed -= Cell.GetAttackSpeed(value.m_cellClass);
                }
                else
                {
                    this.m_growSpeed += Cell.GetAttackSpeed(value.m_cellClass);
                }
            }    
        }

        // Apply growspeed.
        if (this.m_belongTeam === TeamTypes.Neutral)
        {
            this.m_occupiedProntons += this.m_growSpeed * Time.GetDeltaTime();
            if (this.m_occupiedProntons >= this.m_occupiedMax)
            {
                this.m_occupiedProntons = 0;
                this.TakeOver();
            }
            else if (this.m_occupiedProntons === 0)
            {
                this.m_occupiedTeam = TeamTypes.Neutral;
            }
            else if (this.m_occupiedProntons < 0)
            {
                this.m_occupiedProntons = -this.m_occupiedProntons;
                if (this.m_occupiedTeam === TeamTypes.Green)
                {
                    this.m_occupiedTeam = TeamTypes.Red;
                }
                else if (this.m_occupiedTeam === TeamTypes.Red)
                {
                    this.m_occupiedTeam = TeamTypes.Green;
                }
            }
        }
        else
        {
            this.m_currentProton += this.m_growSpeed * Time.GetDeltaTime();
            if (this.m_currentProton < 0)
            {
                this.TakeOver();
            }
        }

        this.DrawCell();

        this.UpdateClass();
    }

    public OnDestroy()
    {
        GameController.UnRegisterCell(this);
    }

    public OnEvent(
        event_id: CellEvents,
         event_object1: Object = null,
          event_object2: Object = null,
           event_object3: Object = null
           ) : void
    {
        switch (event_id)
        {
            case CellEvents.OnSpawn:
            {
                
            }
            break;
            case CellEvents.OnCellOutOfProtons:
            {
                
            }
            break;
            case CellEvents.OnOutTentacle:
            {
                
            }
            break;
            case CellEvents.OnTentacleReachCell:
            {
                let ten = <Tentacle>event_object1;
                this.m_tenAttackingTo.push(ten.GetVictim());
                ten.GetVictim().m_tenAttackingFrom.push(this);
            }
            break;
            case CellEvents.OnTentacleReachMiddle:
            {
                let ten = <Tentacle>event_object1;
                this.m_tenAttackingTo.push(ten.GetVictim());
            }
            break;
            case CellEvents.OnTentacleRetrieved:
            {
                this.m_outTentacles.remove(<Tentacle>event_object1);
            }
            break;
            case CellEvents.OnTentacleReachTentacle:
            {
                
            }
            break;
            case CellEvents.OnTentacleBreak:
            {
                let ten = <Tentacle>event_object1;
                if (ten.GetOwner().GetTeamType() === this.m_belongTeam)
                {
                    this.m_tenAttackingTo.remove(ten.GetVictim());
                    ten.GetVictim().m_tenAttackingFrom.remove(this);
                }
                else
                {
                    let state = <TentacleStates>event_object2;
                    if (state === TentacleStates.ReachedMiddle ||
                        state === TentacleStates.RetrievingToMiddle ||
                        state === TentacleStates.ToAgrsiveEnemy
                    )
                    {
                        let iter = this.m_outTentacles.GetIterator();
                        while (iter.has_value())
                        {
                            let value = iter.next();
                            if (value.GetVictim() === ten.GetOwner())
                            {
                                value.ChangeTentacleState(TentacleStates.ToVulnerableEnemy);
                            }
                        }
                    }
                }
            }
            break;
            default:
            {

            }
            break;
        }
    }

    private DrawCell() : void
    {
        if (this.m_selected)
        {
            XGui.DrawCircle(
                this.GetGameObject().GetTransform().GetPosition(),
                Cell.GetCellRadius(this.m_cellClass) * 1.08,
                Cell.GetSelectedColor(),
                Cell.GetSelectedColor(),
                0
            );
        }

        XGui.DrawCircle(
            this.GetGameObject().GetTransform().GetPosition(),
            Cell.GetCellRadius(this.m_cellClass),
            Cell.GetCellColor(this.m_belongTeam),
            "#ffffff",
            Cell.GetCellRadius(this.m_cellClass) / 10
        );

        let pro_str : String = new String(Math.floor(this.m_currentProton));
        XGui.DrawText(
            <string>pro_str,
            this.GetGameObject().GetTransform().GetPosition(),
            "#ffffff"
        );
    }

    private IsEnemy(cell: Cell) : Boolean
    {
        if (cell.m_belongTeam != this.m_belongTeam)
        {
            return true;
        }
        return false;
    }

    public static GetProtonGenSpeed(cell_class: CellClasses)
    {
        switch (cell_class)
        {
            case CellClasses.Spore:
            return 1;
            case CellClasses.Embryo:
            return 2;
            case CellClasses.Pulsar_a:
            return 3;
            case CellClasses.Pulsar_b:
            return 3;
            case CellClasses.Ant:
            return 3;
            case CellClasses.Predator:
            return 4;
            default:
            return 0;
        }
    }

    public static GetAttackSpeed(cell_class: CellClasses)
    {
        switch (cell_class)
        {
            case CellClasses.Spore:
            return 1;
            case CellClasses.Embryo:
            return 1;
            case CellClasses.Pulsar_a:
            return 1;
            case CellClasses.Pulsar_b:
            return 2;
            case CellClasses.Ant:
            return 2;
            case CellClasses.Predator:
            return 3;
            default:
            return 0;
        }
    }

    public static GetCellRadius(cell_class: CellClasses)
    {
        switch (cell_class)
        {
            case CellClasses.Spore:
            return 30;
            case CellClasses.Embryo:
            return 45;
            case CellClasses.Pulsar_a:
            return 60;
            case CellClasses.Pulsar_b:
            return 75;
            case CellClasses.Ant:
            return 90;
            case CellClasses.Predator:
            return 105;
            default:
            return 0;
        }
    }

    public static GetCellColor(team: TeamTypes)
    {
        switch (team)
        {
            case TeamTypes.Red:
            return "#ff0000";
            case TeamTypes.Green:
            return "#00ff00";
            case TeamTypes.Neutral:
            return "#555555";
        }
    }

    public static GetSelectedColor() : string
    {
        return "#ff6600";
    }
}


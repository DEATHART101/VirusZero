enum TentacleStates
{
    None = 0,
    ToVulnerableEnemy,
    ReachedEnemy,
    ToAgrsiveEnemy,
    RetrievingToMiddle,
    ReachedMiddle,
    Retrieving,
    SuoHa
}

enum TentacleEvents
{
    Break,  // When the tentacle is break manully.
}

class Tentacle extends Component
{
    private readonly METER_PER_PROTON = 20;

    private m_moveSpeed : number;
    private m_fastMoveSpeed : number;

    private m_containProtons : number;

    private m_tentacleState : TentacleStates;

    private m_owner : Cell;
    private m_victim : Cell;
    
    private m_currentLength : number;

    constructor()
    {
        super();

        this.m_moveSpeed = 100;
        this.m_fastMoveSpeed = 200;

        this.m_containProtons = 0;
        this.m_currentLength = 0;

        this.m_tentacleState = TentacleStates.None;
    }

    // public to: Cell.
    public SetTentacle(owner: Cell, victim: Cell)
    {
        this.m_owner = owner;
        this.m_victim = victim;
    }

    public GetOwner() : Cell
    {
        return this.m_owner;
    }

    public GetVictim() : Cell
    {
        return this.m_victim;
    }

    public GetLength() : number
    {
        return this.m_currentLength;
    }

    public GetContainPronts() : number
    {
        return this.m_containProtons;
    }

    // public to: Cell.
    public ChangeTentacleState(state: TentacleStates) : void
    {
        this.m_tentacleState = state;
    }

    public Update() : void
    {
        switch (this.m_tentacleState)
        {
            case TentacleStates.None:
            {
                this.m_tentacleState = TentacleStates.ToVulnerableEnemy;

                // If the owner is already a victim to the victim.
                let iter = this.m_victim.GetTentacles().GetIterator();
                while (iter.has_value())
                {
                    let value = iter.next();
                    if (value.m_victim === this.m_owner)
                    {
                        if (value.m_tentacleState === TentacleStates.ToVulnerableEnemy)
                        {
                            this.m_tentacleState = TentacleStates.ToAgrsiveEnemy;
                            break;
                        }
                        else if (this.m_tentacleState = TentacleStates.ReachedEnemy)
                        {
                            this.m_tentacleState = TentacleStates.RetrievingToMiddle;
                            value.m_tentacleState = TentacleStates.RetrievingToMiddle;
                            value.GetOwner().m_tenAttackingTo.remove(this.m_owner);
                        }
                    }
                }
            }
            break;
            case TentacleStates.ToVulnerableEnemy:
            {
                let dest_length = Vector2.Distance(
                    this.m_owner.GetGameObject().GetTransform().GetPosition().GetVector2(),
                    this.m_victim.GetGameObject().GetTransform().GetPosition().GetVector2()
                )

                let enemy_tl : Tentacle = null;
                let enemy_tl_length : number = -1;
                let iter = this.m_victim.GetTentacles().GetIterator();
                while (iter.has_value())
                {
                    let value = iter.next();
                    if (value.GetVictim() === this.m_owner && value.m_tentacleState !== TentacleStates.Retrieving)
                    {
                        enemy_tl = value;
                        enemy_tl_length = value.m_currentLength;
                        break;
                    }
                }

                if (enemy_tl !== null)
                {
                    this.m_tentacleState = TentacleStates.ToAgrsiveEnemy;
                    break;
                }

                if (!this.Grow(true, true, false))
                {
                    this.m_owner.OnEvent(
                        CellEvents.OnCellOutOfProtons,
                        this
                    );
                    this.m_tentacleState = TentacleStates.Retrieving;
                }
                if (dest_length < this.m_currentLength)
                {
                    dest_length = this.m_currentLength;
                    this.m_tentacleState = TentacleStates.ReachedEnemy;
                    this.m_owner.OnEvent(CellEvents.OnTentacleReachCell, this);
                }
            }
            break;
            case TentacleStates.ReachedEnemy:
            {
                
            }
            break;
            case TentacleStates.ToAgrsiveEnemy:
            {
                let total_dist = Vector2.Distance(
                    this.m_owner.GetGameObject().GetTransform().GetPosition().GetVector2(),
                    this.m_victim.GetGameObject().GetTransform().GetPosition().GetVector2()
                )

                let enemy_tl : Tentacle = null;
                let enemy_tl_length : number = -1;
                let iter = this.m_victim.GetTentacles().GetIterator();
                while (iter.has_value())
                {
                    let value = iter.next();
                    if (value.GetVictim() === this.m_owner)
                    {
                        enemy_tl = value;
                        enemy_tl_length = value.m_currentLength;
                        break;
                    }
                }

                if (enemy_tl === null || enemy_tl.m_tentacleState === TentacleStates.Retrieving)
                {
                    this.m_tentacleState = TentacleStates.ToVulnerableEnemy;
                    break;
                }

                this.Grow(true, true, false);
                if (this.m_currentLength + enemy_tl_length > total_dist)
                {
                    this.m_tentacleState = TentacleStates.RetrievingToMiddle;
                }
            }
            break;
            case TentacleStates.RetrievingToMiddle:
            {
                let total_dist = Vector2.Distance(
                    this.m_owner.GetGameObject().GetTransform().GetPosition().GetVector2(),
                    this.m_victim.GetGameObject().GetTransform().GetPosition().GetVector2()
                )

                if (this.m_currentLength > total_dist / 2)
                {
                    this.Grow(false, true, false);
                    if (this.m_currentLength < total_dist / 2)
                    {
                        this.m_tentacleState = TentacleStates.ReachedMiddle;
                        this.m_owner.OnEvent(
                            CellEvents.OnTentacleReachMiddle,
                            this
                        );
                    }
                }
                else 
                {
                    this.Grow(true, true, false);
                    if (this.m_currentLength > total_dist / 2)
                    {
                        this.m_tentacleState = TentacleStates.ReachedMiddle;
                        this.m_owner.OnEvent(
                            CellEvents.OnTentacleReachMiddle,
                            this
                        );
                    }
                }
            }
            break;
            case TentacleStates.ReachedMiddle:
            {
                
            }
            break;
            case TentacleStates.Retrieving:
            {
                this.Grow(false, true, true);
                if (this.m_containProtons <= 0)
                {
                    this.m_owner.OnEvent(
                        CellEvents.OnTentacleRetrieved,
                        this
                    )
                    this.GetGameObject().Destroy();
                }
            }
            break;
            case TentacleStates.SuoHa:
            {
                this.Grow(false, false, true);
                if (this.m_containProtons <= 0)
                {
                    this.m_owner.OnEvent(
                        CellEvents.OnTentacleSuoHaed,
                        this
                    )
                    this.GetGameObject().Destroy();
                }
            }
            break;
            default:
            alert("Unknow tentacle state.");
            break;
        }

        this.DrawTentacle();
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
                
            }
            break;
            case CellEvents.OnTentacleReachTentacle:
            {
                
            }
            break;
            case CellEvents.OnTentacleBreak:
            {
                
            }
            break;
            default:
            {

            }
            break;
        }
    }

    private DrawTentacle() : void
    {
        if (this.m_tentacleState === TentacleStates.None)
        {
            return;
        }

        let start_pos = this.m_owner.GetGameObject().GetTransform().GetPosition();
        let enemy_pos = this.m_victim.GetGameObject().GetTransform().GetPosition();
        let total_length = Vector3.Distance(start_pos, enemy_pos);
        let length_ratio = this.m_currentLength / total_length;
        let owner_radius = Cell.GetCellRadius(this.m_owner.GetCellClass());
        let victim_radius = Cell.GetCellRadius(this.m_victim.GetCellClass());

        let sc_ratio = owner_radius / total_length;
        let ec_ratio = victim_radius / total_length;

        let circle_start = new Vector3(0, 0, start_pos.z);
        let circle_end = new Vector3(0, 0, start_pos.z);

        circle_start.x = start_pos.x + (enemy_pos.x - start_pos.x) * sc_ratio;
        circle_start.y = start_pos.y + (enemy_pos.y - start_pos.y) * sc_ratio;

        circle_end.x = enemy_pos.x - (enemy_pos.x - start_pos.x) * ec_ratio;
        circle_end.y = enemy_pos.y - (enemy_pos.y - start_pos.y) * ec_ratio;

        let end_pos = new Vector3(0, 0, start_pos.z);

        if (this.m_tentacleState === TentacleStates.ToVulnerableEnemy ||
            this.m_tentacleState === TentacleStates.ToAgrsiveEnemy ||
            this.m_tentacleState === TentacleStates.RetrievingToMiddle ||
            this.m_tentacleState === TentacleStates.Retrieving ||
            this.m_tentacleState === TentacleStates.ReachedMiddle
        )
        {
            end_pos.x = circle_start.x + (circle_end.x - circle_start.x) * length_ratio;
            end_pos.y = circle_start.y + (circle_end.y - circle_start.y) * length_ratio;

            XGui.DrawLine(circle_start, end_pos,
             Tentacle.GetTentacleColor(this.m_owner.GetTeamType()),
             Tentacle.GetTentacleWidth(Cell.GetAttackSpeed(this.m_owner.GetCellClass()))
            );
        }
        else if (this.m_tentacleState === TentacleStates.ReachedEnemy)
        {
            end_pos.x = circle_start.x + (circle_end.x - circle_start.x) * length_ratio;
            end_pos.y = circle_start.y + (circle_end.y - circle_start.y) * length_ratio;

            XGui.DrawLine(circle_start, circle_end,
             Tentacle.GetTentacleColor(this.m_owner.GetTeamType()),
             Tentacle.GetTentacleWidth(Cell.GetAttackSpeed(this.m_owner.GetCellClass()))
            );
        }
        else if (this.m_tentacleState === TentacleStates.SuoHa)
        {
            end_pos.x = circle_start.x + (circle_end.x - circle_start.x) * (1 - length_ratio);
            end_pos.y = circle_start.y + (circle_end.y - circle_start.y) * (1 - length_ratio);

            XGui.DrawLine(end_pos, circle_end,
             Tentacle.GetTentacleColor(this.m_owner.GetTeamType()),
             Tentacle.GetTentacleWidth(Cell.GetAttackSpeed(this.m_owner.GetCellClass()))
            );
        }

    }

    private Grow(bigger: Boolean, user_owner: Boolean, fast: Boolean) : boolean
    {
        let spd : number;
        if (fast)
        {
            spd = this.m_fastMoveSpeed;
        }
        else
        {
            spd = this.m_moveSpeed;
        }

        if (bigger)
        {
            this.m_currentLength += spd * Time.GetDeltaTime();
        }
        else
        {
            this.m_currentLength -= spd * Time.GetDeltaTime();
        }

        let dest_proton = this.m_currentLength / this.METER_PER_PROTON;
        let to_take = dest_proton - this.m_containProtons;
        if (Math.abs(to_take) >= 1)
        {
            if (user_owner)
            {
                if (this.m_owner.TakeProton(to_take) === true)
                {
                    this.m_containProtons += to_take;
                    return true;
                }
                return false;
            }
            else
            {
                if (this.m_victim.GetTeamType() !== this.m_owner.GetTeamType())
                {
                    this.m_victim.TakeProton(-to_take, true);
                    this.m_containProtons += to_take;
                    return true;
                }
                else
                {
                    this.m_victim.TakeProton(to_take, false);
                    this.m_containProtons += to_take;
                    return true;
                }
            }
        }

        return true;
    }

    public Split(ratio: number) : void
    {
        if (ratio > 1)
        {
            ratio = 1;
        }
        else if (ratio < 0)
        {
            ratio = 0;
        }

        this.m_owner.OnEvent(
            CellEvents.OnTentacleBreak,
            this,
            this.m_tentacleState
        );

        this.m_victim.OnEvent(
            CellEvents.OnTentacleBreak,
            this,
            this.m_tentacleState
        );

        switch (this.m_tentacleState)
        {
            case TentacleStates.None:
            {

            }
            break;
            case TentacleStates.ToVulnerableEnemy:
            {
                this.m_tentacleState = TentacleStates.Retrieving;
            }
            break;
            case TentacleStates.ReachedEnemy:
            {
                let new_ten_go = XEngine.CreateGameObject("temp_ten", new Vector3(0, 0, 0));
                let ten = <Tentacle>new_ten_go.AddComponent(ComponentTypes.Tentacle);
                let total_protons = this.m_containProtons;
                this.m_containProtons = total_protons * ratio;
                ten.m_containProtons = total_protons - this.m_containProtons;

                ten.m_owner = this.m_owner;
                ten.m_victim = this.m_victim;

                this.m_tentacleState = TentacleStates.Retrieving;
                ten.m_tentacleState = TentacleStates.SuoHa;

                this.m_currentLength = this.m_containProtons * this.METER_PER_PROTON;
                ten.m_currentLength = ten.m_containProtons * ten.METER_PER_PROTON; 

                this.m_owner.OnEvent(
                    CellEvents.OnTentacleBreak,
                    this,
                    this.m_tentacleState
                );
            }
            break;
            case TentacleStates.ToAgrsiveEnemy:
            {
                this.m_tentacleState = TentacleStates.Retrieving;
            }
            break;
            case TentacleStates.RetrievingToMiddle:
            {
                this.m_tentacleState = TentacleStates.Retrieving;
            }
            break;
            case TentacleStates.ReachedMiddle:
            {
                this.m_tentacleState = TentacleStates.Retrieving;
            }
            break;
            case TentacleStates.Retrieving:
            {

            }
            break;
            case TentacleStates.SuoHa:
            {

            }
            break;
            default:
            alert("Unknow tentacle state.");
            break;
        }
    }

    public static GetTentacleColor(team: TeamTypes)
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

    public static GetTentacleWidth(attack_spd: number)
    {
        return attack_spd * 5;
    }
}
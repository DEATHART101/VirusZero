class Ten_Cross
{
    m_tentacle : Tentacle;
    m_crossPoint : Vector2;
}

class PlayerController extends Component
{
    public static main : PlayerController;

    private m_currentSelectingCell : Cell = null;
    private m_hoveringTarget : Cell = null;

    private m_mouseStartPosition : Vector2 = new Vector2(0, 0);

    private m_inSelectionMode : boolean = false;

    constructor()
    {
        super();

        PlayerController.main = this;
    }

    public Update() : void
    {
        // Get input
        let hovering = null;
        let crosses : List<Ten_Cross>;

        hovering = this.GetCellByMouse();
        if (!this.m_inSelectionMode)
        {
            if (hovering !== null)
            {
                if (this.m_currentSelectingCell !== null && this.m_currentSelectingCell !== hovering)
                {
                    this.m_currentSelectingCell.SetSelected(false);
                    this.m_currentSelectingCell = hovering;
                    this.m_currentSelectingCell.SetSelected(true);
                }
                else if (this.m_currentSelectingCell === null)
                {
                    this.m_currentSelectingCell = hovering;
                    this.m_currentSelectingCell.SetSelected(true);
                }
            }
            else
            {
                if (this.m_currentSelectingCell !== null)
                {
                    this.m_currentSelectingCell.SetSelected(false);
                    this.m_currentSelectingCell = null;
                }
            }
        }
        else
        {                
            if (hovering === null && this.m_hoveringTarget !== null)
            {
                this.m_hoveringTarget.SetSelected(false);
                this.m_hoveringTarget = null;
            }

            if (this.m_currentSelectingCell !== null && hovering !== null)
            {
                if (this.m_currentSelectingCell !== hovering)
                {
                    if (this.m_hoveringTarget !== null && this.m_hoveringTarget !== hovering)
                    {
                        this.m_hoveringTarget.SetSelected(false);
                        this.m_hoveringTarget = hovering;
                        this.m_hoveringTarget.SetSelected(true);
                    }
                    else if (this.m_hoveringTarget === null)
                    {
                        this.m_hoveringTarget = hovering;
                        this.m_hoveringTarget.SetSelected(true);
                    }
                }
            }
            else if (this.m_currentSelectingCell === null && this.m_hoveringTarget === null)
            {
                
                crosses = this.GetTentacleCrosses();
                this.RenderCrossNodes(crosses);
            }
            this.RenderSelectionLine();
        }

        if (XInput.GetMouseDown())
        {
            if (this.m_currentSelectingCell !== null)
            {
                if (PlayerController.Controllable(this.m_currentSelectingCell))
                {
                    this.m_inSelectionMode = true;
                }
            }
            else
            {
                this.m_mouseStartPosition = XInput.GetMousePosition();
                this.m_inSelectionMode = true;
            }
        }

        if (XInput.GetMouseUp())
        {
            if (this.m_inSelectionMode)
            {
                this.m_inSelectionMode = false;

                if (this.m_currentSelectingCell !== null && this.m_hoveringTarget !== null)
                {
                    this.m_currentSelectingCell.ConnectTo(this.m_hoveringTarget);
                    this.m_currentSelectingCell.SetSelected(false);
                    this.m_hoveringTarget.SetSelected(false);
                    this.m_currentSelectingCell = null;
                    this.m_hoveringTarget = null;
                }
                else if (this.m_currentSelectingCell !== null)
                {
                    this.m_currentSelectingCell.SetSelected(false);
                    this.m_currentSelectingCell = null;
                }
                else if (this.m_currentSelectingCell === null)
                {
                    // Split tentacles.
                    this.m_mouseStartPosition = undefined;
                    let iter = crosses.GetIterator();
                    while (iter.has_value())
                    {
                        let value = iter.next();
                        let total_length = Vector3.Distance(
                            value.m_tentacle.GetOwner().GetGameObject().GetTransform().GetPosition(),
                            value.m_tentacle.GetVictim().GetGameObject().GetTransform().GetPosition()
                        );

                        let ratio = Vector3.Distance(
                            value.m_tentacle.GetOwner().GetGameObject().GetTransform().GetPosition(),
                            value.m_crossPoint.GetVector3()
                        ) / total_length;

                        value.m_tentacle.Split(ratio)
                    }
                }
            }
        }
    }

    private GetCellByMouse() : Cell
    {
        let mouse_world_pos = Camera.main.ScreenToWorldPosition(XInput.GetMousePosition().GetVector3());
        
        let iter = GameController.main.GetCells().GetIterator();
        while (iter.has_value())
        {
            let value = iter.next();
            if (Vector3.Distance(
                value.GetGameObject().GetTransform().GetPosition(),
                mouse_world_pos
            ) <= Cell.GetCellRadius(value.GetCellClass()))
            {
                return value;
            }
        }

        return null;
    }

    private GetTentacleCrosses() : List<Ten_Cross>
    {
        let result = new List<Ten_Cross>();

        let a = Camera.main.ScreenToWorldPosition(this.m_mouseStartPosition.GetVector3()).GetVector2();
        let b = Camera.main.ScreenToWorldPosition(XInput.GetMousePosition().GetVector3()).GetVector2();

        // foreach cell
        let cell_iter = GameController.main.GetCells().GetIterator();
        while (cell_iter.has_value())
        {
            let cell_value = cell_iter.next();
            if (!PlayerController.Controllable(cell_value))
            {
                continue;
            }
            // foreach tentacle
            let ten_iter = cell_value.GetTentacles().GetIterator();
            while (ten_iter.has_value())
            {
                let value = ten_iter.next();
                // If tentacle cross with selection line;
                let c = value.GetOwner().GetGameObject().GetTransform().GetPosition().GetVector2();
                let d = value.GetVictim().GetGameObject().GetTransform().GetPosition().GetVector2();

                // 三角形abc 面积的2倍  
                let area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);  

                // 三角形abd 面积的2倍  
                let area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);   

                // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);  
                if ( area_abc * area_abd >= 0 ) {  
                    continue; 
                }  

                // 三角形cda 面积的2倍  
                let area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);  
                // 三角形cdb 面积的2倍  
                // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.  
                let area_cdb = area_cda + area_abc - area_abd ;  
                if (  area_cda * area_cdb >= 0 ) {  
                    continue; 
                }  

                //计算交点坐标  
                let t = area_cda / ( area_abd- area_abc );  
                let dx= t*(b.x - a.x),  
                    dy= t*(b.y - a.y);  
                
                let new_ten_cross = new Ten_Cross();
                new_ten_cross.m_tentacle = value;
                new_ten_cross.m_crossPoint = new Vector2(a.x + dx, a.y + dy);

                result.push(new_ten_cross);
            }
        }

        return result;
    }

    private RenderSelectionLine()
    {
        let start_pos : Vector3;
        let end_pos : Vector3;
        if (this.m_currentSelectingCell !== null)
        {
            start_pos = this.m_currentSelectingCell.GetGameObject().GetTransform().GetPosition();
            if (this.m_hoveringTarget !== null)
            {
                end_pos = this.m_hoveringTarget.GetGameObject().GetTransform().GetPosition();
            }
            else
            {
                end_pos = Camera.main.ScreenToWorldPosition(XInput.GetMousePosition().GetVector3());
            }
        }
        else
        {
            start_pos = Camera.main.ScreenToWorldPosition(this.m_mouseStartPosition.GetVector3());
            end_pos = Camera.main.ScreenToWorldPosition(XInput.GetMousePosition().GetVector3());            
        }

        if (start_pos === undefined || end_pos === undefined)
        {
            return;
        }

        XGui.DrawLine(
            start_pos,
            end_pos,
            Cell.GetSelectedColor(),
            5
        )
    }

    private RenderCrossNodes(crosses: List<Ten_Cross> = null)
    {
        if (crosses === null || crosses.length() === 0)
        {
            return;
        }
        let iter = crosses.GetIterator();
        while (iter.has_value())
        {
            let value = iter.next();
            XGui.DrawCircle(
                value.m_crossPoint.GetVector3(),
                Cell.GetAttackSpeed(value.m_tentacle.GetOwner().GetCellClass()) * 5,
                "#ffffff"
            );
        }
    }

    private static Controllable(cell: Cell) : boolean
    {
        if (cell.GetTeamType() === TeamTypes.Green)
        {
            return true;
        }
        return false;
    }
}
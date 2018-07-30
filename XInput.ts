class XInput
{
    private static m_mouseDown: boolean = false;
    private static m_mouseUp: boolean = false;

    private static m_currentMousePosition : Vector2 = new Vector2(0, 0);
    
    constructor ()
    {

    }

    public static InitializeInput()
    {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, XInput.Proc_OnMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, XInput.Proc_OnMouseUp);
    }

    // public to: XEngine.
    public static UpdateInput()
    {
        this.m_currentMousePosition.x = Laya.stage.mouseX;
        this.m_currentMousePosition.y = Laya.stage.mouseY;
    }

    // public to: laya.stage.
    public static Proc_OnMouseDown(e: any) : void
    {
        this.m_mouseDown = true;
    }

    // public to: laya.stage.
    public static Proc_OnMouseUp(e: any) : void
    {
        this.m_mouseUp = true;
    }

    public static GetMousePosition()
    {
        return new Vector2(
            this.m_currentMousePosition.x,
            this.m_currentMousePosition.y
        );
    }

    public static GetMouseDown() : boolean
    {
        if (this.m_mouseDown)
        {
            this.m_mouseDown = false;
            return true;
        }
        return false;
    }

    public static GetMouseUp() : boolean
    {
        if (this.m_mouseUp)
        {
            this.m_mouseUp = false;
            return true;
        }
        return false;
    }
}
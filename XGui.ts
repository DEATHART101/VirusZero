class XGui
{
    private m_gameCanvas : Sprite = null;

    constructor()
    {
        this.m_gameCanvas = new Sprite();
    }

    // public to: XEngine.
    public GetGameCanvas() : Sprite
    {
        return this.m_gameCanvas;
    }

    // The follow gui functions are considered to be in game coordinate.
    public static DrawCircle(
        position: Vector3,
        radius: number,
        fill_color: any,
        line_color: any = null,
        line_width: number = 1
    )
    {
        let two_pos = new Vector3(position.x, position.y, position.z);
        two_pos.x += radius;

        let one_screen_pos = Camera.main.WorldToScreenPosition(position);
        let two_screen_pos = Camera.main.WorldToScreenPosition(two_pos);

        XEngine.GetGameGUI().m_gameCanvas.graphics.drawCircle(
            one_screen_pos.x,
            one_screen_pos.y,
            Vector3.Distance(one_screen_pos, two_screen_pos),
            fill_color,
            line_color,
            line_width
        );
    }

    public static DrawLine(
        one_pos: Vector3,
        two_pos : Vector3,
        line_color: any = null,
        line_width: number = 1
    )
    {
        let one_screen_pos = Camera.main.WorldToScreenPosition(one_pos);
        let two_screen_pos = Camera.main.WorldToScreenPosition(two_pos);

        XEngine.GetGameGUI().m_gameCanvas.graphics.drawLine(
            one_screen_pos.x,
            one_screen_pos.y,
            two_screen_pos.x,
            two_screen_pos.y,
            line_color,
            line_width
        );
    }

    public static DrawText(
        text: string,
        position: Vector3,
        color: string
    )
    {
        let screen_pos = Camera.main.WorldToScreenPosition(position);

        XEngine.GetGameGUI().m_gameCanvas.graphics.fillText(
            text,
            screen_pos.x,
            screen_pos.y,
            "Arial",
            color,
            "center"
        );
    }
}
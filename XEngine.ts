import Sprite = Laya.Sprite;
import Stage = Laya.Stage;
import Texture = Laya.Texture;
import Browser = Laya.Browser;
import Handler = Laya.Handler;
import WebGL = Laya.WebGL;
import Graphic = Laya.Graphics;

class XEngine
{
    private static DEFAULT_SCENE = SceneName.Test;

    private static m_currentScene : XScene = null;
    private static m_currentXGui : XGui = null;

    public static RegisterGameObject(go : GameObject) : void
    {
        this.m_currentScene.RegisterGameObject(go);
    }

    public static RegisterRenderer(rd: SpriteRenderer) : void
    {
        Camera.RegesiterRenderer(rd);
    }

    public static UnRegisterGameObject(go : GameObject) : void
    {
        this.m_currentScene.UnRegisterGameObject(go);
    }

    public static UnRegisterRenderer(rd: SpriteRenderer) : void
    {
        Camera.UnRegesiterRenderer(rd);
    }

    // public to: XGui.
    public static GetGameGUI() : XGui
    {
        return this.m_currentXGui;
    }

    // public to: XScene.
    public static UnLoadScene()
    {
        XEngine.m_currentXGui.GetGameCanvas().graphics.clear();
        XEngine.m_currentScene = null;
    }

    // public to: XScene.
    public static CreateScene() : XScene
    {
        if (XEngine.m_currentScene !== null)
        {
            this.UnLoadScene();
        }

        this.m_currentScene = new XScene();
        return this.m_currentScene;
    }

    // public to: XScene.
    public static GetCurrentScene() : XScene
    {
        return XEngine.m_currentScene;
    }
  
    public static StartGame () : void
    {
        this.m_currentXGui = new XGui();
        Laya.stage.addChild(this.m_currentXGui.GetGameCanvas());

        XInput.InitializeInput();

        this.PreGameSettings();

        if (this.m_currentScene === null)
        {
            XScene.LoadScene(this.DEFAULT_SCENE);
        }
        
        setInterval(XEngine.UpdateGame, Time.GetDeltaTime() * 1000);
    }

    // Called throw setInterval.
    private static UpdateGame() : void
    {
        if (this.m_currentScene === null)
        {
            return;
        }

        XInput.UpdateInput();
        XEngine.m_currentXGui.GetGameCanvas().graphics.clear();
        XEngine.m_currentScene.UpdateScene();
    }

    // Add GameOjects to a newly craete sence then start the game using it.
    private static PreGameSettings() : void
    {
        XScene.LoadScene(SceneName.Level1);
    }

    public static CreateGameObject(name : string, position : Vector3) : GameObject
    {
        let go_pos = new Vector3(position.x, position.y, position.z);
        let new_object = new GameObject(name, go_pos);
        this.RegisterGameObject(new_object);

        return new_object;
    }

    public static DestroyGameObject(game_object: GameObject) : void
    {
        this.UnRegisterGameObject(game_object);
    }
}
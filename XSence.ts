enum SceneName
{
    Test,
    Level1,
    Level2,
}

class XScene
{
    private m_sceneName : SceneName;
    private m_gameObjects : List<GameObject>;

    constructor ()
    {
        this.m_gameObjects = new List<GameObject>();
    }

    public RegisterGameObject(go : GameObject) : void
    {
        this.m_gameObjects.push(go);
    }

    public UnRegisterGameObject(go : GameObject) : void
    {
        this.m_gameObjects.remove(go);
    }

    // Called throw setInterval.
    public UpdateScene() : void
    {
        let iter = this.m_gameObjects.GetIterator();
        while (iter.has_value())
        {
            let value = iter.next();
            value.UpdateComponents();
        }
    }

    public static GetCurrentSceneName() : SceneName
    {
        if (XEngine.GetCurrentScene() !== null)
        {
            return XEngine.GetCurrentScene().m_sceneName;
        }
        return undefined;
    }

    public static GetAllGameObjectsIterator() : ListIterator<GameObject>
    {
        return XEngine.GetCurrentScene().m_gameObjects.GetIterator();
    }

    public static LoadScene(scene_name: SceneName) : void
    {
        XEngine.UnLoadScene();
        XEngine.CreateScene().m_sceneName = scene_name; 

        switch(scene_name)
        {
            case SceneName.Test:
            {
                // Camera
                let go_camera = XEngine.CreateGameObject("Camera", new Vector3(0, 0, 0));
                go_camera.AddComponent(ComponentTypes.Camera);

                // Game with some components
                let go_game = XEngine.CreateGameObject("Game", new Vector3(0, 0, 0));
                go_game.AddComponent(ComponentTypes.GameController);
                go_game.AddComponent(ComponentTypes.PlayerController);

                // Create Cells
                let cell = XEngine.CreateGameObject("Cell1", new Vector3(-300, 200, 0));
                let ce1 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce1.SetCell(TeamTypes.Green, 30);

                cell = XEngine.CreateGameObject("Cell2", new Vector3(-300, -200, 0));
                let ce2 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce2.SetCell(TeamTypes.Green, 30);

                cell = XEngine.CreateGameObject("Cell1", new Vector3(300, 200, 0));
                let ce3 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce3.SetCell(TeamTypes.Red, 40);

                cell = XEngine.CreateGameObject("Cell2", new Vector3(300, -200, 0));
                let ce4 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce4.SetCell(TeamTypes.Red, 40);

                ce3.ConnectTo(ce4);
            }
            break;
            case SceneName.Level1:
            {
                // Camera
                let go_camera = XEngine.CreateGameObject("Camera", new Vector3(0, 0, 0));
                go_camera.AddComponent(ComponentTypes.Camera);

                // Game with some components
                let go_game = XEngine.CreateGameObject("Game", new Vector3(0, 0, 0));
                go_game.AddComponent(ComponentTypes.GameController);
                go_game.AddComponent(ComponentTypes.PlayerController);

                // Create Cells
                let cell = XEngine.CreateGameObject("Cell1", new Vector3(-300, 200, 0));
                let ce1 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce1.SetCell(TeamTypes.Green, 30);

                cell = XEngine.CreateGameObject("Cell2", new Vector3(-300, -200, 0));
                let ce2 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce2.SetCell(TeamTypes.Green, 30);

                cell = XEngine.CreateGameObject("Cell1", new Vector3(300, 200, 0));
                let ce3 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce3.SetCell(TeamTypes.Red, 40);

                cell = XEngine.CreateGameObject("Cell2", new Vector3(300, -200, 0));
                let ce4 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce4.SetCell(TeamTypes.Red, 40);

                ce3.ConnectTo(ce4);
            }
            break;
            case SceneName.Level2:
            {
                // Camera
                let go_camera = XEngine.CreateGameObject("Camera", new Vector3(0, 0, 0));
                go_camera.AddComponent(ComponentTypes.Camera);

                // Game with some components
                let go_game = XEngine.CreateGameObject("Game", new Vector3(0, 0, 0));
                go_game.AddComponent(ComponentTypes.GameController);
                go_game.AddComponent(ComponentTypes.PlayerController);

                // Create Cells
                let cell = XEngine.CreateGameObject("Cell1", new Vector3(-300, 200, 0));
                let ce1 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce1.SetCell(TeamTypes.Green, 30);

                cell = XEngine.CreateGameObject("Cell2", new Vector3(-300, -200, 0));
                let ce2 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce2.SetCell(TeamTypes.Red, 30);

                cell = XEngine.CreateGameObject("Cell1", new Vector3(300, 200, 0));
                let ce3 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce3.SetCell(TeamTypes.Red, 40);

                cell = XEngine.CreateGameObject("Cell2", new Vector3(300, -200, 0));
                let ce4 = <Cell>cell.AddComponent(ComponentTypes.Cell);
                ce4.SetCell(TeamTypes.Red, 40);

                ce3.ConnectTo(ce4);
                ce2.ConnectTo(ce4);
                ce2.ConnectTo(ce3);
            }
            break;
            default:
            {

            }
            break;
        }
    }
}
// 程序入口
class GameMain{
    constructor()
    {
        Laya.MiniAdpter.init();
        Laya.init(1334,750);
        //Laya.loader.load("res/atlas/comp.atlas", Handler.create(this, this.OnLoaded));
        this.OnLoaded();
    }

    private OnLoaded() : void
    {
        let start_scene = new view.StartScene();
        Laya.stage.addChild(start_scene);
    }
}

//TS或JS版本初始化微信小游戏的适配
var GAME = new GameMain();
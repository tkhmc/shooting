(function() {
  var ASSETS, ENEMY_SIZE, SCREEN_BACKGROUND_COLOR, SCREEN_HEIGHT, SCREEN_WIDTH, SHOOTER_BOTTOM_LIMIT, SHOOTER_LEFT_LIMIT, SHOOTER_RIGHT_LIMIT, SHOOTER_SIZE, SHOOTER_TOP_LIMIT, SOUNDS;

  SCREEN_WIDTH = 640;

  SCREEN_HEIGHT = 960;

  SCREEN_BACKGROUND_COLOR = "#555555";

  ASSETS = {
    "shooter": "img/shooter.png",
    "enemy": "img/enemy.png"
  };

  SOUNDS = {
    "start": "sound/btn09.mp3",
    "died": "sound/btn11.mp3",
    "bgm": "sound/nv_01.mp3"
  };

  SHOOTER_SIZE = 32;

  ENEMY_SIZE = 16;

  SHOOTER_RIGHT_LIMIT = SCREEN_WIDTH - SHOOTER_SIZE / 2;

  SHOOTER_LEFT_LIMIT = SHOOTER_SIZE / 2;

  SHOOTER_TOP_LIMIT = SHOOTER_SIZE / 2;

  SHOOTER_BOTTOM_LIMIT = SCREEN_HEIGHT - SHOOTER_SIZE / 2;

  tm.main(function() {
    var app, loadingScene;
    app = tm.display.CanvasApp("#app");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    app.background = SCREEN_BACKGROUND_COLOR;
    loadingScene = tm.game.LoadingScene({
      assets: ASSETS,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT
    });
    loadingScene.onload = function() {
      app.replaceScene(TitleScene());
    };
    app.replaceScene(loadingScene);
    app.run();
  });


  /*
    シーン
   */

  tm.define("TitleScene", {
    superClass: "tm.app.Scene",
    init: function() {
      this.superInit();
      this.fromJSON({
        children: [
          {
            type: "Label",
            name: "titleLabel",
            text: "Shooting!",
            x: SCREEN_WIDTH / 2,
            y: 360,
            fillStyle: "#FFFFFF",
            fontSize: 60,
            fontFamily: "メイリオ",
            align: "center",
            baseline: "middle"
          }, {
            type: "Label",
            name: "soundCautionLabel",
            text: "音が流れます",
            x: SCREEN_WIDTH / 2,
            y: 700,
            fillStyle: "#FFFFFF",
            fontSize: 26,
            fontFamily: "メイリオ",
            align: "center",
            baseline: "middle"
          }, {
            type: "Label",
            name: "startLabel",
            text: "Start",
            x: SCREEN_WIDTH / 2,
            y: 800,
            fillStyle: "#FFFFFF",
            fontSize: 26,
            fontFamily: "メイリオ",
            align: "center",
            baseline: "middle"
          }
        ]
      });
      this.startLabel.tweener.fadeOut(500).fadeIn(1000).setLoop(true);
    },
    onpointingstart: function() {
      tm.sound.Sound(SOUNDS.start).play();
      this.app.replaceScene(GameScene());
    }
  });

  tm.define("GameScene", {
    superClass: "tm.app.Scene",
    init: function() {
      this.superInit();
      this.bgm = tm.sound.Sound(SOUNDS.bgm);
      this.bgm.play();
      this.shooter = Shooter().addChildTo(this);
      this.shooter.position.set(SCREEN_WIDTH / 2, 800);
      this.shooter.gotoAndPlay("test");
      this.enemyGroup = tm.app.CanvasElement().addChildTo(this);
      this.timer = 0;
      this.seconds = tm.display.Label("").setPosition(SCREEN_WIDTH - 10, 10).setBaseline("top").setAlign("right").addChildTo(this);
      this.seconds.update = (function(_this) {
        return function(app) {
          _this.seconds.text = (Math.floor(_this.timer * 100 / 30) / 100).toFixed(2) + "秒";
        };
      })(this);
    },
    update: function(app) {
      var enemy, i, j, n, ref;
      this.timer++;
      if (this.timer % 30 === 0) {
        n = this.timer / 300;
        for (i = j = 0, ref = n; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          enemy = Enemy().addChildTo(this.enemyGroup);
          enemy.x = Math.rand(0, SCREEN_WIDTH);
          enemy.y = 0 - enemy.height;
        }
      }
      this.enemyGroup.children.each((function(_this) {
        return function(enemy) {
          if (_this.shooter.isHitElement(enemy)) {
            _this.bgm.stop();
            tm.sound.Sound(SOUNDS.died).play();
            app.replaceScene(ResultScene(_this.timer));
          }
        };
      })(this));
    }
  });

  tm.define("ResultScene", {
    superClass: "tm.app.Scene",
    init: function(time) {
      this.superInit();
      this.fromJSON({
        children: [
          {
            type: "FlatButton",
            name: "creditButton",
            init: [
              {
                text: "クレジット",
                fontSize: 14,
                fontFamily: "メイリオ",
                width: 100,
                height: 40
              }
            ],
            x: SCREEN_WIDTH - 70,
            y: 40
          }, {
            type: "Label",
            name: "titleLabel",
            text: "Result",
            x: SCREEN_WIDTH / 2,
            y: 360,
            fillStyle: "#FFFFFF",
            fontSize: 60,
            fontFamily: "メイリオ",
            align: "center",
            baseline: "middle"
          }, {
            type: "Label",
            name: "titleLabel",
            text: (Math.floor(time * 100 / 30) / 100) + "秒",
            x: SCREEN_WIDTH / 2,
            y: 500,
            fillStyle: "#CCCCFF",
            fontSize: 36,
            fontFamily: "メイリオ",
            align: "center",
            baseline: "middle"
          }, {
            type: "FlatButton",
            name: "backButton",
            init: [
              {
                text: "タイトルに戻る",
                fontSize: 26,
                fontFamily: "メイリオ"
              }
            ],
            x: SCREEN_WIDTH / 2,
            y: 800
          }
        ]
      });
      this.creditButton.onpointingstart = (function(_this) {
        return function() {
          _this.app.replaceScene(CreditScene(time));
        };
      })(this);
      this.backButton.onpointingstart = (function(_this) {
        return function() {
          _this.app.replaceScene(TitleScene());
        };
      })(this);
    }
  });

  tm.define("CreditScene", {
    superClass: "tm.app.Scene",
    init: function(time) {
      this.superInit();
      this.fromJSON({
        children: [
          {
            type: "Label",
            name: "titleLabel",
            text: "Credit",
            x: SCREEN_WIDTH / 2,
            y: 100,
            fillStyle: "#FFFFFF",
            fontSize: 60,
            fontFamily: "メイリオ",
            align: "center",
            baseline: "middle"
          }, {
            type: "Label",
            name: "titleLabel",
            text: "--- Build Tools etc. ---\nbower\nnpm\ngulp\n--- Libraries ---\npure\ntmlib.js\n--- Sounds ---\nMusMus",
            x: SCREEN_WIDTH / 2,
            y: 200,
            fillStyle: "#CCCCFF",
            fontSize: 36,
            fontFamily: "メイリオ",
            align: "center",
            baseline: "middle"
          }, {
            type: "FlatButton",
            name: "backButton",
            init: [
              {
                text: "戻る",
                fontSize: 26,
                fontFamily: "メイリオ",
                align: "center",
                baseline: "middle"
              }
            ],
            x: SCREEN_WIDTH / 2,
            y: 800
          }
        ]
      });
      this.backButton.onpointingstart = (function(_this) {
        return function() {
          _this.app.replaceScene(ResultScene(time));
        };
      })(this);
    }
  });


  /*
    物体
   */

  tm.define("Shooter", {
    superClass: "tm.app.AnimationSprite",
    init: function() {
      this.superInit(tm.asset.SpriteSheet({
        image: "shooter",
        frame: {
          width: 32,
          height: 32,
          count: 8
        },
        animations: {
          test: [0, 8, "test", 20]
        }
      }));
      this.speed = 8;
    },
    update: function(app) {
      if (app.keyboard.getKey("D") || app.keyboard.getKey("right")) {
        this.goRight();
      }
      if (app.keyboard.getKey("A") || app.keyboard.getKey("left")) {
        this.goLeft();
      }
      if (app.keyboard.getKey("W") || app.keyboard.getKey("up")) {
        this.goUp();
      }
      if (app.keyboard.getKey("s") || app.keyboard.getKey("down")) {
        this.goDown();
      }
      this.ensureMoveLimit();
    },
    goRight: function() {
      this.x += this.speed;
    },
    goLeft: function() {
      this.x -= this.speed;
    },
    goUp: function() {
      this.y -= this.speed;
    },
    goDown: function() {
      this.y += this.speed;
    },
    ensureMoveLimit: function() {
      if (this.x < SHOOTER_LEFT_LIMIT) {
        this.x = SHOOTER_LEFT_LIMIT;
      }
      if (this.x > SHOOTER_RIGHT_LIMIT) {
        this.x = SHOOTER_RIGHT_LIMIT;
      }
      if (this.y < SHOOTER_TOP_LIMIT) {
        this.y = SHOOTER_TOP_LIMIT;
      }
      if (this.y > SHOOTER_BOTTOM_LIMIT) {
        this.y = SHOOTER_BOTTOM_LIMIT;
      }
    }
  });

  tm.define("Enemy", {
    superClass: "tm.app.Sprite",
    init: function() {
      this.superInit("enemy", ENEMY_SIZE, ENEMY_SIZE);
      this.speed = Math.rand(6, 12);
    },
    update: function() {
      this.y += this.speed;
      if (this.y > SCREEN_HEIGHT + this.height) {
        return this.remove();
      }
    }
  });

}).call(this);

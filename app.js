var ASSETS, ENEMY_SIZE, SCREEN_BACKGROUND_COLOR, SCREEN_HEIGHT, SCREEN_WIDTH, SHOOTER_BOTTOM_LIMIT, SHOOTER_LEFT_LIMIT, SHOOTER_RIGHT_LIMIT, SHOOTER_SIZE, SHOOTER_TOP_LIMIT, screen_direction;

SCREEN_WIDTH = 640;

SCREEN_HEIGHT = 960;

SCREEN_BACKGROUND_COLOR = "#555555";

screen_direction = 0;

ASSETS = {
  "shooter": "img/shooter.png",
  "enemy": "img/enemy.png",
  "speaker0": "img/speaker0.png",
  "speaker1": "img/speaker1.png",
  "start": "sound/btn09." + tm.sound.Sound.SUPPORT_EXT,
  "died": "sound/btn11." + tm.sound.Sound.SUPPORT_EXT,
  "bgm": "sound/nv_01." + tm.sound.Sound.SUPPORT_EXT
};

SHOOTER_SIZE = 32;

ENEMY_SIZE = 16;

SHOOTER_RIGHT_LIMIT = SCREEN_WIDTH - SHOOTER_SIZE / 2;

SHOOTER_LEFT_LIMIT = SHOOTER_SIZE / 2;

SHOOTER_TOP_LIMIT = SHOOTER_SIZE / 2;

SHOOTER_BOTTOM_LIMIT = SCREEN_HEIGHT - SHOOTER_SIZE / 2;


/*
  起動処理
 */

tm.main(function() {
  var app, b, event, func, loadScene;
  app = tm.display.CanvasApp("#app");
  app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
  app.fitWindow();
  app.background = SCREEN_BACKGROUND_COLOR;
  loadScene = LoadScene({
    assets: ASSETS,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  });
  loadScene.onload = function() {
    app.replaceScene(TitleScene());
  };
  app.replaceScene(loadScene);
  b = false;
  document.getElementById("app").addEventListener("touchstart", func = function(e) {
    if (b) {
      return false;
    }
    b = true;
    tm.sound.WebAudio.unlock();
    return window.removeEventListener("touchstart", func);
  });
  screen_direction = getDirection();
  if (isIOS) {
    event = "orientationchange";
  } else {
    event = "resize";
  }
  window.addEventListener(event, function() {
    screen_direction = getDirection();
  });
  app.run();
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
        normal: [0, 1, "normal"],
        right: [1, 2, "right"],
        left: [2, 3, "left"],
        explode: [4, 8, "died"],
        died: [7, 8, "died"]
      }
    }));
    this.speed = 8;
    this.gotoAndStop("normal");
  },
  update: function(app) {
    var ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, rotate;
    this.moved = false;
    if (app.keyboard.getKey("D") || app.keyboard.getKey("right")) {
      this.goRight();
    }
    if (app.keyboard.getKey("A") || app.keyboard.getKey("left")) {
      this.goLeft();
    }
    if (app.keyboard.getKey("W") || app.keyboard.getKey("up")) {
      this.goUp();
    }
    if (app.keyboard.getKey("S") || app.keyboard.getKey("down")) {
      this.goDown();
    }
    if (isMobile) {
      rotate = app.accelerometer.orientation;
      switch (screen_direction) {
        case 0:
          if ((10 < (ref = rotate.gamma) && ref < 90)) {
            this.goRight();
          }
          if ((-90 < (ref1 = rotate.gamma) && ref1 < -10)) {
            this.goLeft();
          }
          if ((-180 < (ref2 = rotate.beta) && ref2 < -10)) {
            this.goUp();
          }
          if ((10 < (ref3 = rotate.beta) && ref3 < 180)) {
            this.goDown();
          }
          break;
        case 1:
          if ((10 < (ref4 = rotate.gamma) && ref4 < 90)) {
            this.goUp();
          }
          if ((-90 < (ref5 = rotate.gamma) && ref5 < -10)) {
            this.goDown();
          }
          if ((-180 < (ref6 = rotate.beta) && ref6 < -10)) {
            this.goLeft();
          }
          if ((10 < (ref7 = rotate.beta) && ref7 < 180)) {
            this.goRight();
          }
          break;
        case 2:
          if ((10 < (ref8 = rotate.gamma) && ref8 < 90)) {
            this.goLeft();
          }
          if ((-90 < (ref9 = rotate.gamma) && ref9 < -10)) {
            this.goRight();
          }
          if ((-180 < (ref10 = rotate.beta) && ref10 < -10)) {
            this.goDown();
          }
          if ((10 < (ref11 = rotate.beta) && ref11 < 180)) {
            this.goUp();
          }
          break;
        case 3:
          if ((10 < (ref12 = rotate.gamma) && ref12 < 90)) {
            this.goDown();
          }
          if ((-90 < (ref13 = rotate.gamma) && ref13 < -10)) {
            this.goUp();
          }
          if ((-180 < (ref14 = rotate.beta) && ref14 < -10)) {
            this.goRight();
          }
          if ((10 < (ref15 = rotate.beta) && ref15 < 180)) {
            this.goLeft();
          }
      }
    }
    if (!this.moved && this.currentAnimation.next !== "died") {
      this.gotoAndPlay("normal");
    }
    this.ensureMoveLimit();
  },
  goRight: function() {
    this.moved = true;
    this.x += this.speed;
    this.gotoAndPlay("right");
  },
  goLeft: function() {
    this.moved = true;
    this.x -= this.speed;
    this.gotoAndPlay("left");
  },
  goUp: function() {
    this.moved = true;
    this.y -= this.speed;
    this.gotoAndPlay("normal");
  },
  goDown: function() {
    this.moved = true;
    this.y += this.speed;
    this.gotoAndPlay("normal");
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
    this.willStop = false;
  },
  update: function() {
    if (!this.willStop) {
      this.y += this.speed;
    }
    if (this.y > SCREEN_HEIGHT + this.height) {
      this.remove();
    }
  },
  stop: function() {
    this.willStop = true;
  }
});


/*
  シーン
 */
tm.define("LoadScene", {
  superClass: "tm.game.LoadingScene",
  init: function(param) {
    this.superInit(param);
  }
});

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
          type: "FlatButton",
          name: "startButton",
          init: [
            {
              text: "Start",
              fontFamily: "メイリオ",
              fontSize: 26,
              width: 160,
              height: 40
            }
          ],
          x: SCREEN_WIDTH / 2,
          y: 800
        }, {
          type: "FlatButton",
          name: "discriptionButton",
          init: [
            {
              text: "操作方法",
              fontSize: 20,
              fontFamily: "メイリオ",
              width: 160,
              height: 40
            }
          ],
          x: SCREEN_WIDTH / 2,
          y: 900
        }, {
          type: "FlatButton",
          name: "muteButton",
          init: [
            {
              text: "",
              fontFamily: "メイリオ",
              width: 60,
              height: 60
            }
          ],
          x: 30,
          y: 30
        }
      ]
    });
    this.startButton.label.tweener.fadeOut(500).fadeIn(1000).setLoop(true);
    if (tm.sound.SoundManager.isMute()) {
      this.muteIcon = tm.display.Sprite("speaker0", 32, 32).addChildTo(this.muteButton);
    } else {
      this.muteIcon = tm.display.Sprite("speaker1", 32, 32).addChildTo(this.muteButton);
    }
    this.muteButton.onpointingstart = (function(_this) {
      return function() {
        tm.sound.SoundManager.mute();
        if (tm.sound.SoundManager.isMute()) {
          _this.muteIcon.setImage("speaker0");
        } else {
          _this.muteIcon.setImage("speaker1");
        }
      };
    })(this);
    this.startButton.onpointingstart = (function(_this) {
      return function() {
        tm.sound.SoundManager.play("start", 1.0, 0, false);
        _this.app.replaceScene(GameScene());
      };
    })(this);
    this.discriptionButton.onpointingstart = (function(_this) {
      return function() {
        window.open("help.html");
      };
    })(this);
  },
  update: function(app) {
    if (app.keyboard.getKey("ctrl")) {
      tm.sound.SoundManager.mute();
      if (tm.sound.SoundManager.isMute()) {
        this.muteIcon.setImage("speaker0");
      } else {
        this.muteIcon.setImage("speaker1");
      }
    }
  }
});

tm.define("GameScene", {
  superClass: "tm.app.Scene",
  init: function() {
    this.superInit();
    this.fromJSON({
      children: [
        {
          type: "FlatButton",
          name: "pauseButton",
          init: [
            {
              text: "||",
              fontSize: 40,
              fontFamily: "メイリオ",
              width: 60,
              height: 60
            }
          ],
          x: 30,
          y: 30
        }, {
          type: "FlatButton",
          name: "muteButton",
          init: [
            {
              text: "",
              fontFamily: "メイリオ",
              width: 60,
              height: 60
            }
          ],
          x: 30,
          y: 90
        }
      ]
    });
    this.pauseButton.onpointingstart = (function(_this) {
      return function() {
        _this.app.pushScene(PauseScene());
      };
    })(this);
    tm.sound.SoundManager.playMusic("bgm", true, 1.0);
    if (tm.sound.SoundManager.isMute()) {
      this.muteIcon = tm.display.Sprite("speaker0", 32, 32).addChildTo(this.muteButton);
    } else {
      this.muteIcon = tm.display.Sprite("speaker1", 32, 32).addChildTo(this.muteButton);
    }
    this.muteButton.onpointingstart = (function(_this) {
      return function() {
        tm.sound.SoundManager.mute();
        if (tm.sound.SoundManager.isMute()) {
          _this.muteIcon.setImage("speaker0");
        } else {
          _this.muteIcon.setImage("speaker1");
        }
      };
    })(this);
    this.shooter = Shooter().addChildTo(this);
    this.shooter.position.set(SCREEN_WIDTH / 2, 800);
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
    if (app.keyboard.getKey("shift")) {
      this.app.pushScene(PauseScene());
    }
    if (app.keyboard.getKey("ctrl")) {
      tm.sound.SoundManager.mute();
      if (tm.sound.SoundManager.isMute()) {
        this.muteIcon.setImage("speaker0");
      } else {
        this.muteIcon.setImage("speaker1");
      }
    }
    if (this.timer % 30 === 0) {
      n = this.timer / 300;
      for (i = j = 0, ref = n; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        enemy = Enemy().addChildTo(this.enemyGroup);
        enemy.x = Math.rand(ENEMY_SIZE, SCREEN_WIDTH - ENEMY_SIZE);
        enemy.y = 0 - enemy.height;
      }
    }
    this.enemyGroup.children.each((function(_this) {
      return function(enemy) {
        if (_this.shooter.isHitElement(enemy)) {
          tm.sound.SoundManager.stopMusic();
          tm.sound.SoundManager.play("died", 1.0, 0, false);
          enemy.stop();
          _this.shooter.gotoAndPlay("explode");
          setTimeout(function() {
            app.replaceScene(ResultScene(_this.timer));
          }, 100);
        }
      };
    })(this));
  }
});

tm.define("PauseScene", {
  superClass: "tm.app.Scene",
  init: function() {
    this.superInit();
    this.fromJSON({
      children: [
        {
          type: "RectangleShape",
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          fillStyle: "rgba(0, 0, 0, 0.4)",
          originX: 0,
          originY: 0
        }, {
          type: "Label",
          name: "titleLabel",
          text: "Pause",
          x: SCREEN_WIDTH / 2,
          y: 360,
          fillStyle: "#FFFFFF",
          fontSize: 60,
          fontFamily: "メイリオ",
          align: "center",
          baseline: "middle"
        }, {
          type: "FlatButton",
          name: "backButton",
          init: [
            {
              text: "再開する",
              fontSize: 26,
              fontFamily: "メイリオ"
            }
          ],
          x: SCREEN_WIDTH / 2,
          y: 800
        }
      ]
    });
    this.backButton.onpointingstart = (function(_this) {
      return function() {
        return _this.app.popScene();
      };
    })(this);
  },
  update: function(app) {
    if (app.keyboard.getKey("escape")) {
      return this.app.popScene();
    }
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
  Util
 */
var getDirection, isIOS, isMobile;

isIOS = function() {
  return navigator.userAgent.match(/(?:iPhone|iPod|iPad)/);
};

isMobile = function() {
  return navigator.userAgent.match(/(?:iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile|Touch|Tablet)/);
};

getDirection = function() {
  var d;
  d = 0;
  if (window.orientation != null) {
    switch (window.orientation) {
      case 0:
        d = 0;
        break;
      case 90:
        d = 1;
        break;
      case 180:
        d = 2;
        break;
      case -90:
        d = 3;
    }
  }
  return d;
};

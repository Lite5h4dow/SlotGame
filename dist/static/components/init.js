"use strict";
//please forgive the lack of semicolons. i know they should be there technically but i have my TSC compiler set to input them for me and i was recently working on a bunch of python projects.
var Prize = /** @class */ (function () {
    function Prize(n, pos, app) {
        var _this = this;
        this.render = function (app) {
            app.stage.addChild(_this.sprite);
            _this.sprite.play();
            app.stage.addChild(_this.label);
        };
        var prizeX = 200;
        var prizeY = 164;
        this.multiplier = 16 + n;
        var baseSprites = [
            new PIXI.BaseTexture.from(app.loader.resources["Coins"].url),
            new PIXI.BaseTexture.from(app.loader.resources["Notes"].url),
            new PIXI.BaseTexture.from(app.loader.resources["Diamond"].url),
            new PIXI.BaseTexture.from(app.loader.resources["Ring"].url),
            new PIXI.BaseTexture.from(app.loader.resources["Gold"].url),
        ];
        var items = [];
        baseSprites.map(function (i) {
            items.push({
                static: [new PIXI.Texture(i, new PIXI.Rectangle(0, 0, prizeX, prizeY))],
                anim: [
                    new PIXI.Texture(i, new PIXI.Rectangle(0, 0, prizeX, prizeY)),
                    new PIXI.Texture(i, new PIXI.Rectangle(prizeX, 0, prizeX, prizeY))
                ]
            });
        });
        this.static = items[n].static;
        this.animated = items[n].anim;
        var Offset = { x: 20, y: 4 };
        this.sprite = new PIXI.AnimatedSprite(this.static);
        this.sprite.anchor.set(0.5);
        this.sprite.x = pos.x + Offset.x;
        this.sprite.y = pos.y + Offset.y;
        this.sprite.animationSpeed = 1;
        this.sprite.loop = true;
        this.label = new PIXI.Text("x" + this.multiplier);
        this.label.style = new PIXI.TextStyle({
            fontFamily: 'Dimbo',
            fontSize: 60,
            fill: 0xFFFFFF,
            strokeThickness: 10,
            padding: 20
        });
        this.label.x = pos.x + Offset.x;
        this.label.y = pos.y + Offset.y;
    }
    return Prize;
}());
var Safe = /** @class */ (function () {
    function Safe(Num, position, app) {
        var _this = this;
        this.openSafe = function () {
            _this.label.visible = false;
            _this.sprite.texture = _this.app.loader.resources["SafeOpen"].texture;
            _this.prize.render(_this.app);
        };
        this.assignRandomPrize = function () {
            var prize = Math.ceil(Math.random() * 5);
        };
        this.render = function (app) {
            app.stage.addChild(_this.sprite);
            app.stage.addChild(_this.label);
        };
        this.app = app;
        this.open = false;
        this.sprite = PIXI.Sprite.from(app.loader.resources["SafeClosed"].texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = position.x;
        this.sprite.y = position.y;
        // this.sprite.interactive = true
        // this.sprite.buttonMode = true
        // this.sprite.on("pointerdown", this.openSafe)
        var Offset = { x: 0, y: -10 };
        this.label = new PIXI.Text(Num.toString());
        this.label.style = new PIXI.TextStyle({
            fontFamily: 'Dimbo',
            fill: 0xFFFFFF
        });
        this.label.x = position.x + Offset.x;
        this.label.y = position.y + Offset.y;
        this.prize = new Prize(Math.floor(Math.random() * 4), position, app);
    }
    return Safe;
}());
var Blinker = /** @class */ (function () {
    function Blinker(position, app) {
        var _this = this;
        this.render = function (app) {
            app.stage.addChild(_this.blinker);
            _this.blinker.play();
        };
        //Create Blinkers  
        var ledSheet = new PIXI.BaseTexture.from(app.loader.resources['Blinkers'].url);
        var w = 118;
        var h = 44;
        // Initialise Blinker Frames in Texture Array
        var blinkerTextures = [
            new PIXI.Texture(ledSheet, new PIXI.Rectangle(0, 0, w, h)),
            new PIXI.Texture(ledSheet, new PIXI.Rectangle(w, 0, w, h)),
            new PIXI.Texture(ledSheet, new PIXI.Rectangle(w * 2, 0, w, h))
        ];
        this.blinker = new PIXI.AnimatedSprite(blinkerTextures);
        this.blinker.animationSpeed = .1;
        this.blinker.anchor.set(0.5);
        this.blinker.x = position.x;
        this.blinker.y = position.y;
        this.blinker.loop = true;
    }
    return Blinker;
}());
var DialDisplay = /** @class */ (function () {
    function DialDisplay(position, app) {
        var _this = this;
        this.updateDisplay = function () {
            _this.displayText.text = _this.rolls.join(' ');
        };
        this.setDisplayText = function (text) {
            _this.displayText.text = text;
        };
        this.winState = function () {
            _this.app.stage.addChild(_this.winDisp);
            _this.app.stage.addChild(_this.winText);
        };
        this.render = function (app) {
            app.stage.addChild(_this.displayBG);
            app.stage.addChild(_this.display);
            app.stage.addChild(_this.displayText);
        };
        this.rollCount = 0;
        this.app = app;
        //assigning both number of rolls and the display's text in one go. i could create a blank array and run a for loop to populate it but this is faster.
        this.rolls = Array.from("----");
        this.displayText = new PIXI.Text(this.rolls.join(' '));
        this.displayText.style = new PIXI.TextStyle({
            fontFamily: "Titan",
            fontSize: 50,
            fill: 0xFFFFFF,
            padding: 20
        });
        this.displayText.anchor.set(0.5);
        this.displayText.x = position.x;
        this.displayText.y = position.y;
        this.displayBG = new PIXI.Sprite.from(app.loader.resources['DialDisplayBG'].texture);
        this.displayBG.anchor.set(0.5);
        this.displayBG.x = position.x;
        this.displayBG.y = position.y;
        this.display = new PIXI.Sprite.from(app.loader.resources['DialDisplayNorm'].texture);
        this.display.anchor.set(0.5);
        this.display.x = position.x;
        this.display.y = position.y;
        this.winDisp = new PIXI.Sprite.from(app.loader.resources['DialDisplayWin'].texture);
        this.winDisp.anchor.set(0.5);
        this.winDisp.x = position.x;
        this.winDisp.y = position.y;
        this.winText = new PIXI.Text('WIN');
        this.winText.style = new PIXI.TextStyle({
            fontFamily: 'Dimbo',
            fontSize: 60,
            fill: 0xFFFFFF,
            padding: 20
        });
        this.winText.anchor.set(0.5);
        this.winText.x = position.x;
        this.winText.y = position.y;
    }
    return DialDisplay;
}());
var Dial = /** @class */ (function () {
    function Dial(position, dialRef, mainRef, safes, app) {
        var _this = this;
        this.blinkers = [];
        this.dialState = {};
        this.changeState = function (v) {
        };
        this.randomSelection = function () {
            var i = Math.ceil(Math.random() * 9) - 1;
            // console.log(`${i}, ${this.dialDisplay.rolls.includes(i.toString())}`)
            while (_this.selection == i || _this.dialDisplay.rolls.includes((i + 1).toString())) {
                i = Math.ceil(Math.random() * 9) - 1;
                // console.log(`${i}, ${this.dialDisplay.rolls.includes(i.toString())}`)
            }
            _this.selection = i;
        };
        this.dialClick = function (e) {
            _this.randomSelection();
            _this.dialDisplay.rolls[_this.dialDisplay.rollCount] = (_this.selection + 1).toString();
            // console.log(this.dialDisplay.rolls)
            // this.dialDisplay.updateDisplay()
            _this.rotateScale = _this.positions[_this.selection].rot.forward;
            _this.dialDisplay.rollCount++;
            // console.log(`dial clicked ${this.rotateScale}, ${this.selection + 1}, ${this.dialDisplay.rollCount}`)
        };
        this.render = function (app) {
            app.stage.addChild(_this.dialBackground);
            app.stage.addChild(_this.dialFront);
            app.stage.addChild(_this.dialSpin);
            _this.dialFront.play();
        };
        this.winCon = false;
        this.dialDisplay = dialRef;
        this.mainDisplay = mainRef;
        this.rotateScale = 0;
        this.positions = [];
        this.isRotating = false;
        this.selection = 0;
        this.safes = safes;
        // ngl this was a pain in the backside to debug. i could probably find a more efficient method, but this is the best method that allows for numbers to change that i could think of 😴
        var dialCount = 9;
        var angle = 360 / dialCount;
        var displacement = 1;
        for (var i = dialCount; i > 0; i--) {
            this.positions.push({
                rot: {
                    forward: -(360 - ((i + displacement) * angle)),
                    backward: (i + displacement) * angle
                }
            });
        }
        // console.log(this.positions)
        //initialise dial background
        this.dialBackground = PIXI.Sprite.from(app.loader.resources["DialBackground"].texture);
        this.dialBackground.anchor.set(0.5);
        this.dialBackground.x = position.x;
        this.dialBackground.y = position.y;
        //initialise Base Texture & co-ordinates
        var base = new PIXI.BaseTexture.from(app.loader.resources["Dial"].url);
        var baseX = 275;
        var baseY = 275;
        //initialise Dial Foreground textures
        this.dialState["normal"] = {
            textures: [new PIXI.Texture(base, new PIXI.Rectangle(0, 0, baseX, baseY))],
            animSpeed: 0
        };
        this.dialState["fail"] = {
            textures: [
                new PIXI.Texture(base, new PIXI.Rectangle(0, 0, baseX, baseY)),
                new PIXI.Texture(base, new PIXI.Rectangle(baseX, 0, baseX, baseY))
            ],
            animSpeed: 0.05
        };
        this.dialState["success"] = {
            textures: [
                new PIXI.Texture(base, new PIXI.Rectangle(0, 0, baseX, baseY)),
                new PIXI.Texture(base, new PIXI.Rectangle(baseX * 2, 0, baseX, baseY))
            ],
            animSpeed: 0.05
        };
        var Offset = {
            x: 0,
            y: 10
        };
        //initialise sprite data
        this.dialFront = new PIXI.AnimatedSprite(this.dialState["normal"].textures);
        this.dialFront.animationSpeed = this.dialState["normal"].animSpeed;
        this.dialFront.anchor.set(0.5);
        this.dialFront.x = position.x + Offset.x;
        this.dialFront.y = position.y + Offset.y;
        this.dialFront.loop = true;
        this.dialFront.interactive = true;
        this.dialFront.buttonMode = true;
        this.dialFront.on('pointerdown', this.dialClick);
        //initialise spin button
        this.dialSpin = new PIXI.Sprite.from(app.loader.resources['SpinLabel'].texture);
        this.dialSpin.anchor.set(0.5);
        this.dialSpin.x = position.x + Offset.x;
        this.dialSpin.y = position.y + Offset.y;
        this.rotateDial = new PIXI.Ticker();
        //im putting game logic here for now because it just naturally ended up here. I dont like it and it looks messy but it works.
        this.rotateDial.add(function (delta) {
            // console.log("Ticker Running")
            // console.log(this.rotateScale)
            // console.log(this.dialFront.angle)
            // console.log(this.dialFront.angle >= this.rotateScale - 3 && this.dialFront.angle <= this.rotateScale + 3)
            //If you're wondering why im rounding here, ill keep it short. Floating point errors. took me way too long to find this. 
            var mults = [];
            if (Math.round(_this.dialFront.angle) == _this.rotateScale) {
                _this.dialDisplay.rolls.map(function (i) {
                    if (i == '-')
                        return;
                    var x = parseInt(i) - 1;
                    if (mults.includes(_this.safes[x].prize.multiplier))
                        _this.winCon = true;
                    mults.push(_this.safes[x].prize.multiplier);
                });
                if (!_this.winCon && !_this.dialFront.playing) {
                    _this.dialFront.textures = _this.dialState['fail'].textures;
                    _this.dialFront.animationSpeed = _this.dialState['fail'].animSpeed;
                    _this.dialFront.loop = true;
                    _this.dialFront.play();
                }
                if (_this.winCon && !_this.dialFront.playing) {
                    _this.dialFront.textures = _this.dialState['success'].textures;
                    _this.dialFront.animationSpeed = _this.dialState['success'].animSpeed;
                    _this.dialFront.loop = true;
                    _this.dialFront.play();
                }
                _this.dialFront.interactive = true;
                _this.dialFront.buttonMode = true;
                _this.dialSpin.visible = true;
                // console.log(this.dialDisplay.rolls)
                for (var i in _this.dialDisplay.rolls) {
                    // console.log("Loop running")
                    if (_this.dialDisplay.rolls[i] == '-')
                        break;
                    var n = parseInt(_this.dialDisplay.rolls[i]) - 1;
                    if (_this.safes[n].open)
                        break;
                    _this.safes[n].openSafe();
                }
                if (_this.dialDisplay.rollCount >= 4) {
                    _this.dialSpin.visible = false;
                    _this.dialFront.interactive = false;
                    _this.dialFront.buttonMode = false;
                    // console.log("REEEEEEE")
                    _this.rotateDial.stop();
                }
                if (!_this.isRotating)
                    _this.isRotating = false;
                _this.dialDisplay.updateDisplay();
                _this.mainDisplay.currentMessage.text = _this.dialDisplay.rollCount - 1 >= 0 ? "Safe " + _this.dialDisplay.rolls[_this.dialDisplay.rollCount - 1] + "!" : "Match a pair of symbols for a safe busting multiplier \n TOUCH THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION";
                if (_this.winCon) {
                    _this.dialFront.interactive = false;
                    _this.dialFront.buttonMode = false;
                    _this.dialSpin.visible = false;
                    _this.dialDisplay.winState();
                    _this.rotateDial.stop();
                }
                return;
            }
            //snap to angle if within a degree.... this was an arguable addition but since the delta tends to be around a second it will be needed if it gets close but will overshoot. also if the speed is increased the margin needs increasing. about 1:1.25....
            var margin = 3;
            var speed = 2;
            if (_this.dialFront.angle >= _this.rotateScale - margin && _this.dialFront.angle <= _this.rotateScale + margin) {
                _this.dialDisplay.updateDisplay();
                _this.dialFront.angle = _this.rotateScale;
                return;
            }
            var dir = (_this.rotateScale - _this.dialFront.angle) < 0 ? -1 : 1;
            // console.log(delta * dir);
            //this currently isnt really needed since gamelogic endded up in here, but its here if needed....
            _this.isRotating = true;
            _this.mainDisplay.currentMessage.text = "Spinning!";
            _this.dialFront.interactive = false;
            _this.dialFront.buttonMode = false;
            _this.dialSpin.visible = false;
            _this.dialFront.angle += (delta * dir) * speed;
            _this.dialFront.textures = _this.dialState['normal'].textures;
            _this.dialFront.stop();
        });
        this.rotateDial.start();
    }
    return Dial;
}());
var Background = /** @class */ (function () {
    function Background(app) {
        var _this = this;
        this.render = function (app) {
            app.stage.addChild(_this.background);
        };
        //render background
        this.background = PIXI.Sprite.from(app.loader.resources['Background'].texture);
        this.background.anchor.set(0);
        this.background.x = 0;
        this.background.y = 0;
    }
    return Background;
}());
var MainDisplay = /** @class */ (function () {
    function MainDisplay(position, app) {
        var _this = this;
        this.setText = function (text) {
            _this.currentMessage.text = text;
        };
        this.render = function (app) {
            // app.stage.addChild(this.displaySprite)
            app.stage.addChild(_this.currentMessage);
        };
        this.currentMessage = new PIXI.Text();
        this.currentMessage.style = new PIXI.TextStyle({
            fontFamily: 'Dimbo',
            align: 'center',
            fontSize: 40,
            padding: 20,
            dropShadow: true,
            dropShadowAlpha: 0.3
        });
        this.currentMessage.anchor.set(0.5);
        this.currentMessage.x = position.x;
        this.currentMessage.y = position.y;
        this.displaySprite = new PIXI.Sprite.from(app.loader.resources['DisplayPanelBG'].texture);
        this.displaySprite.anchor.set(0.5);
        this.displaySprite.x = position.x;
        this.displaySprite.y = position.y;
    }
    return MainDisplay;
}());
var LoadResources = function (app) {
    console.log("Loading Resources");
    app.loader.add('SafeClosed', '../assets/graphics/safe_minigame.png');
    app.loader.add('SafeOpen', '../assets/graphics/safe_open_minigame.png');
    app.loader.add('Background', '../assets/graphics/background_safe_minigame.png');
    app.loader.add('DialBackground', '../assets/graphics/support_safe_dial_minigame.png');
    app.loader.add('Dial', '../assets/graphics/safe_dial_minigame.png');
    app.loader.add('Blinkers', '../assets/graphics/leds_safe_dial_minigame.png');
    app.loader.add('SpinLabel', '../assets/graphics/text_spin_safe_dial_minigame.png');
    app.loader.add('DisplayPanelBG', '../assets/graphics/display_panel_background.png');
    app.loader.add('DialDisplayBG', '../assets/graphics/screen_safe_background.png');
    app.loader.add('DialDisplayNorm', '../assets/graphics/screen_safe_minigame.png');
    app.loader.add('DialDisplayWin', '../assets/graphics/screen_safe_win.png');
    app.loader.add('Coins', '../assets/graphics/coins.png');
    app.loader.add('Notes', '../assets/graphics/notes.png');
    app.loader.add('Ring', '../assets/graphics/ring.png');
    app.loader.add('Diamond', '../assets/graphics/diamond.png');
    app.loader.add('Gold', '../assets/graphics/gold.png');
    app.loader.add('mainFont', '../assets/fonts/Dimbo Italic.ttf');
    app.loader.add('dialFont', '../assets/fonts/TitanOne-Regular.ttf');
    app.loader.load(StartGame);
};
var canvas = new PIXI.Application({
    width: 916,
    height: 623,
    transparent: true
});
var StartGame = function () {
    console.log("Resources Loaded... Rendering Game");
    //initialize the Background and remder it
    var bg = new Background(canvas);
    bg.render(canvas);
    //initialize and render Main Display
    var disp = new MainDisplay({ x: 460, y: 70 }, canvas);
    disp.render(canvas);
    //initialize new Dial Display and render
    var dialDisplay = new DialDisplay({ x: 735, y: 220 }, canvas);
    dialDisplay.render(canvas);
    //initialize array of blinker positions
    var BlinkerPositions = [
        { x: 650, y: 290 },
        { x: 820, y: 290 }
    ];
    //initialize an empty array of blinkers incase they need referenceing
    var blinkers = [];
    //Create Blinkers Ready for rendering with positions applied
    BlinkerPositions.map(function (pos) {
        blinkers.push(new Blinker(pos, canvas));
    });
    //render all the blinky things
    blinkers.map(function (b) {
        b.render(canvas);
    });
    //initialise Safe Positions
    var sPositions = [
        { x: 125, y: 235 },
        { x: 300, y: 235 },
        { x: 475, y: 235 },
        { x: 125, y: 380 },
        { x: 300, y: 380 },
        { x: 475, y: 380 },
        { x: 125, y: 525 },
        { x: 300, y: 525 },
        { x: 475, y: 525 },
    ];
    //Create Safe instances with safe positions
    var safes = [];
    //Generate New Safes for each position
    sPositions.forEach(function (i, index) {
        safes.push(new Safe(index + 1, i, canvas));
    });
    //Render Safes
    safes.map(function (i) {
        i.render(canvas);
    });
    //initialise a new Dial and render it
    var dial = new Dial({ x: 735, y: 440 }, dialDisplay, disp, safes, canvas);
    dial.render(canvas);
};
document.body.appendChild(canvas.view);
LoadResources(canvas);
//# sourceMappingURL=init.js.map
declare var PIXI: any

//please forgive the lack of semicolons. i know they should be there technically but i have my TSC compiler set to input them for me and i was recently working on a bunch of python projects.

class Prize {
  sprite: any
  multiplier: number
  label: any
  static: any
  animated: any
  constructor(n: number, pos: { x: number, y: number }, app: any) {
    let prizeX = 200
    let prizeY = 164

    this.multiplier = 16 + n

    let baseSprites = [
      new PIXI.BaseTexture.from(app.loader.resources["Coins"].url),
      new PIXI.BaseTexture.from(app.loader.resources["Notes"].url),
      new PIXI.BaseTexture.from(app.loader.resources["Diamond"].url),
      new PIXI.BaseTexture.from(app.loader.resources["Ring"].url),
      new PIXI.BaseTexture.from(app.loader.resources["Gold"].url),
    ]

    let items: Array<{ static: Array<any>, anim: Array<any> }> = []

    baseSprites.map((i) => {
      items.push({
        static: [new PIXI.Texture(i, new PIXI.Rectangle(0, 0, prizeX, prizeY))],
        anim: [
          new PIXI.Texture(i, new PIXI.Rectangle(0, 0, prizeX, prizeY)),
          new PIXI.Texture(i, new PIXI.Rectangle(prizeX, 0, prizeX, prizeY))
        ]
      })
    })

    this.static = items[n].static
    this.animated = items[n].anim

    let Offset = { x: 20, y: 4 }

    this.sprite = new PIXI.AnimatedSprite(this.static)
    this.sprite.anchor.set(0.5)
    this.sprite.x = pos.x + Offset.x
    this.sprite.y = pos.y + Offset.y
    this.sprite.animationSpeed = 1
    this.sprite.loop = true

    this.label = new PIXI.Text(`x${this.multiplier}`)
    this.label.style = new PIXI.TextStyle({
      fontFamily: 'Dimbo',
      fontSize: 60,
      fill: 0xFFFFFF,
      strokeThickness: 10,
      padding: 20
    })
    this.label.x = pos.x + Offset.x
    this.label.y = pos.y + Offset.y

  }

  render = (app: any) => {
    app.stage.addChild(this.sprite)
    this.sprite.play()

    app.stage.addChild(this.label)
  }
}

class Safe {
  open: boolean
  label: any
  sprite: any
  prize: Prize
  app: any

  timer: number
  dir: number
  constructor(Num: number, position: { x: number, y: number }, app: any) {
    this.app = app
    this.open = false
    this.timer = 0
    this.dir = 1

    this.sprite = PIXI.Sprite.from(app.loader.resources["SafeClosed"].texture)
    this.sprite.anchor.set(0.5)
    this.sprite.x = position.x
    this.sprite.y = position.y
    // this.sprite.interactive = true
    // this.sprite.buttonMode = true
    // this.sprite.on("pointerdown", this.openSafe)

    let Offset = { x: 0, y: -10 }
    this.label = new PIXI.Text(Num.toString())
    this.label.style = new PIXI.TextStyle({
      fontFamily: 'Dimbo',
      fill: 0xFFFFFF
    })
    this.label.x = position.x + Offset.x
    this.label.y = position.y + Offset.y

    this.prize = new Prize(Math.floor(Math.random() * 4), position, app)
  }

  winState = () => {
    this.prize.sprite.textures = this.prize.animated
    this.prize.sprite.loop = true
    this.prize.sprite.animationSpeed = .05
    this.prize.sprite.play()

    var Flasher = new PIXI.Ticker().add((delta: number) => {
      this.timer += delta
      if (this.timer >= 10) {
        this.dir *= -1
        this.timer = 0
      }
      this.prize.sprite.scale.x += (delta * this.dir) / 20
      this.prize.sprite.scale.y += (delta * this.dir) / 20
      if (this.prize.sprite.scale.x < 1) this.prize.sprite.scale.x = 1
      if (this.prize.sprite.scale.y < 1) this.prize.sprite.scale.y = 1

      if (this.prize.sprite.scale.x > 1.2) this.prize.sprite.scale.x = 1.2
      if (this.prize.sprite.scale.y > 1.2) this.prize.sprite.scale.y = 1.2
    })
    Flasher.start()
  }

  openSafe = () => {
    this.label.visible = false
    this.sprite.texture = this.app.loader.resources["SafeOpen"].texture
    this.prize.render(this.app)
  }

  assignRandomPrize = () => {
    let prize = Math.ceil(Math.random() * 5)
  }

  render = (app: any) => {
    app.stage.addChild(this.sprite)
    app.stage.addChild(this.label)
  }
}

class Blinker {
  blinker: any
  constructor(position: { x: number, y: number }, app: any) {
    //Create Blinkers  
    let ledSheet = new PIXI.BaseTexture.from(app.loader.resources['Blinkers'].url)
    let w = 118
    let h = 44

    // Initialise Blinker Frames in Texture Array
    let blinkerTextures = [
      new PIXI.Texture(ledSheet, new PIXI.Rectangle(0, 0, w, h)),
      new PIXI.Texture(ledSheet, new PIXI.Rectangle(w, 0, w, h)),
      new PIXI.Texture(ledSheet, new PIXI.Rectangle(w * 2, 0, w, h))
    ]

    this.blinker = new PIXI.AnimatedSprite(blinkerTextures)
    this.blinker.animationSpeed = .1
    this.blinker.anchor.set(0.5)
    this.blinker.x = position.x
    this.blinker.y = position.y
    this.blinker.loop = true
  }

  render = (app: any) => {
    app.stage.addChild(this.blinker)
    this.blinker.play()
  }
}

class DialDisplay {
  rolls: Array<string>
  rollCount: number
  displayText: any
  displayBG: any
  display: any
  winDisp: any
  winText: any
  app: any
  constructor(position: { x: number, y: number }, app: any) {
    this.rollCount = 0
    this.app = app
    //assigning both number of rolls and the display's text in one go. i could create a blank array and run a for loop to populate it but this is faster.
    this.rolls = Array.from("----")

    this.displayText = new PIXI.Text(this.rolls.join(' '))
    this.displayText.style = new PIXI.TextStyle({
      fontFamily: "Titan",
      fontSize: 50,
      fill: 0xFFFFFF,
      padding: 20
    })
    this.displayText.anchor.set(0.5)
    this.displayText.x = position.x
    this.displayText.y = position.y

    this.displayBG = new PIXI.Sprite.from(app.loader.resources['DialDisplayBG'].texture)
    this.displayBG.anchor.set(0.5)
    this.displayBG.x = position.x
    this.displayBG.y = position.y

    this.display = new PIXI.Sprite.from(app.loader.resources['DialDisplayNorm'].texture)
    this.display.anchor.set(0.5)
    this.display.x = position.x
    this.display.y = position.y


    this.winDisp = new PIXI.Sprite.from(app.loader.resources['DialDisplayWin'].texture)
    this.winDisp.anchor.set(0.5)
    this.winDisp.x = position.x
    this.winDisp.y = position.y

    this.winText = new PIXI.Text('WIN')
    this.winText.style = new PIXI.TextStyle({
      fontFamily: 'Dimbo',
      fontSize: 60,
      fill: 0xFFFFFF,
      padding: 20
    })
    this.winText.anchor.set(0.5)
    this.winText.x = position.x
    this.winText.y = position.y
  }

  updateDisplay = () => {
    this.displayText.text = this.rolls.join(' ')
  }

  setDisplayText = (text: string) => {
    this.displayText.text = text
  }

  winState = () => {
    this.app.stage.addChild(this.winDisp)
    this.app.stage.addChild(this.winText)
  }

  render = (app: any) => {
    app.stage.addChild(this.displayBG)
    app.stage.addChild(this.display)
    app.stage.addChild(this.displayText)
  }
}

class Dial {
  blinkers: Array<Blinker> = []
  dialBackground: any
  dialSpin: any
  dialFront: any
  dialState: { [id: string]: { textures: Array<any>, animSpeed: number } } = {}
  rotateDial: any
  rotateScale: number
  positions: Array<{ rot: { forward: number, backward: number } }>
  isRotating: boolean
  dialDisplay: DialDisplay
  mainDisplay: MainDisplay
  selection: number
  safes: Array<Safe>
  winCon: boolean

  amount: number

  constructor(position: { x: number, y: number }, dialRef: DialDisplay, mainRef: MainDisplay, safes: Array<Safe>, app: any) {
    this.winCon = false
    this.dialDisplay = dialRef
    this.mainDisplay = mainRef
    this.rotateScale = 0
    this.positions = []
    this.isRotating = false
    this.selection = 0

    //this is only hard coded right now because i have nothing to tie this into, but this would probably be done in initialisation and then calculated in a proper place for game logic instead of where it is now.
    this.amount = 5

    this.safes = safes
    // ngl this was a pain in the backside to debug. i could probably find a more efficient method, but this is the best method that allows for numbers to change that i could think of 😴

    let dialCount = 9
    let angle = 360 / dialCount
    let displacement = 1

    for (var i = dialCount; i > 0; i--) {
      this.positions.push({
        rot: {
          forward: - (360 - ((i + displacement) * angle)),
          backward: (i + displacement) * angle
        }
      })
    }

    //initialise dial background
    this.dialBackground = PIXI.Sprite.from(app.loader.resources["DialBackground"].texture)
    this.dialBackground.anchor.set(0.5)
    this.dialBackground.x = position.x
    this.dialBackground.y = position.y

    //initialise Base Texture & co-ordinates
    let base = new PIXI.BaseTexture.from(app.loader.resources["Dial"].url)
    let baseX = 275
    let baseY = 275

    //initialise Dial Foreground textures
    this.dialState["normal"] = {
      textures: [new PIXI.Texture(base, new PIXI.Rectangle(0, 0, baseX, baseY))],
      animSpeed: 0
    }

    this.dialState["fail"] = {
      textures: [
        new PIXI.Texture(base, new PIXI.Rectangle(0, 0, baseX, baseY)),
        new PIXI.Texture(base, new PIXI.Rectangle(baseX, 0, baseX, baseY))
      ],
      animSpeed: 0.05
    }

    this.dialState["success"] = {
      textures: [
        new PIXI.Texture(base, new PIXI.Rectangle(0, 0, baseX, baseY)),
        new PIXI.Texture(base, new PIXI.Rectangle(baseX * 2, 0, baseX, baseY))
      ],
      animSpeed: 0.05
    }

    let Offset = {
      x: 0,
      y: 10
    }

    //initialise sprite data
    this.dialFront = new PIXI.AnimatedSprite(this.dialState["normal"].textures)
    this.dialFront.animationSpeed = this.dialState["normal"].animSpeed
    this.dialFront.anchor.set(0.5)
    this.dialFront.x = position.x + Offset.x
    this.dialFront.y = position.y + Offset.y
    this.dialFront.loop = true
    this.dialFront.interactive = true
    this.dialFront.buttonMode = true
    this.dialFront.on('pointerdown', this.dialClick)

    //initialise spin button
    this.dialSpin = new PIXI.Sprite.from(app.loader.resources['SpinLabel'].texture)
    this.dialSpin.anchor.set(0.5)
    this.dialSpin.x = position.x + Offset.x
    this.dialSpin.y = position.y + Offset.y

    this.rotateDial = new PIXI.Ticker()

    //im putting game logic here for now because it just naturally ended up here. I dont like it and it looks messy but it works.
    this.rotateDial.add((delta: number) => {

      //If you're wondering why im rounding here, ill keep it short. Floating point errors. took me way too long to find this. 
      let mults: Array<number> = []
      let winMult: number = 0
      if (Math.round(this.dialFront.angle) == this.rotateScale) {
        this.dialDisplay.rolls.map(i => {
          if (i == '-') return
          var x = parseInt(i) - 1
          if (mults.includes(this.safes[x].prize.multiplier)) {
            winMult = this.safes[x].prize.multiplier
            this.winCon = true
          }
          mults.push(this.safes[x].prize.multiplier)
        })

        if (!this.winCon && !this.dialFront.playing) {
          this.dialFront.textures = this.dialState['fail'].textures
          this.dialFront.animationSpeed = this.dialState['fail'].animSpeed
          this.dialFront.loop = true
          this.dialFront.play()
        }

        if (this.winCon && !this.dialFront.playing) {
          this.dialFront.textures = this.dialState['success'].textures
          this.dialFront.animationSpeed = this.dialState['success'].animSpeed
          this.dialFront.loop = true
          this.dialFront.play()
        }

        this.dialFront.interactive = true
        this.dialFront.buttonMode = true
        this.dialSpin.visible = true

        for (var i in this.dialDisplay.rolls) {
          if (this.dialDisplay.rolls[i] == '-') break
          let n = parseInt(this.dialDisplay.rolls[i]) - 1
          if (this.safes[n].open) break
          this.safes[n].openSafe()
        }

        if (this.dialDisplay.rollCount >= 4) {

          this.dialSpin.visible = false
          this.dialFront.interactive = false
          this.dialFront.buttonMode = false
          this.rotateDial.stop()
        }

        if (!this.isRotating) this.isRotating = false
        this.dialDisplay.updateDisplay()
        this.mainDisplay.currentMessage.text = this.dialDisplay.rollCount - 1 >= 0 ? `Safe ${this.dialDisplay.rolls[this.dialDisplay.rollCount - 1]}!` : "Match a pair of symbols for a safe busting multiplier \n TOUCH THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION"

        if (this.winCon) {
          this.dialFront.interactive = false
          this.dialFront.buttonMode = false
          this.dialSpin.visible = false
          this.dialDisplay.winState()

          this.mainDisplay.setText(`You Have Won £${this.amount * winMult}`)
          this.mainDisplay.winState()

          this.safes.map(i => {
            if (i.prize.multiplier == winMult && !i.label.visible) i.winState()
            else i.openSafe()

          })

          this.rotateDial.stop()
        }

        return

      }

      //snap to angle if within a degree.... this was an arguable addition but since the delta tends to be around a second it will be needed if it gets close but will overshoot. also if the speed is increased the margin needs increasing. about 1:1.25....
      const margin = 3
      const speed = 2
      if (this.dialFront.angle >= this.rotateScale - margin && this.dialFront.angle <= this.rotateScale + margin) {
        this.dialDisplay.updateDisplay()
        this.dialFront.angle = this.rotateScale
        return
      }

      let dir = (this.rotateScale - this.dialFront.angle) < 0 ? -1 : 1

      //this currently isnt really needed since gamelogic endded up in here, but its here if needed....
      this.isRotating = true

      this.mainDisplay.currentMessage.text = "Spinning!"
      this.dialFront.interactive = false
      this.dialFront.buttonMode = false
      this.dialSpin.visible = false

      this.dialFront.angle += (delta * dir) * speed

      this.dialFront.textures = this.dialState['normal'].textures
      this.dialFront.stop()
    })
    this.rotateDial.start()
  }

  changeState = (v: string) => {

  }

  randomSelection = () => {
    let i = Math.ceil(Math.random() * 9) - 1
    while (this.selection == i || this.dialDisplay.rolls.includes((i + 1).toString())) {
      i = Math.ceil(Math.random() * 9) - 1
    }
    this.selection = i
  }

  dialClick = (e: any) => {

    this.randomSelection()

    this.dialDisplay.rolls[this.dialDisplay.rollCount] = (this.selection + 1).toString()
    // this.dialDisplay.updateDisplay()

    this.rotateScale = this.positions[this.selection].rot.forward
    this.dialDisplay.rollCount++
  }

  render = (app: any) => {
    app.stage.addChild(this.dialBackground)
    app.stage.addChild(this.dialFront)
    app.stage.addChild(this.dialSpin)
    this.dialFront.play()
  }
}

class Background {
  background: any
  constructor(app: any) {
    //render background
    this.background = PIXI.Sprite.from(app.loader.resources['Background'].texture)
    this.background.anchor.set(0)
    this.background.x = 0
    this.background.y = 0
  }

  render = (app: any) => {
    app.stage.addChild(this.background);
  }
}

class MainDisplay {
  displaySprite: any
  currentMessage: any
  timer: number
  constructor(position: { x: number, y: number }, app: any) {
    this.timer = 0
    this.currentMessage = new PIXI.Text()
    this.currentMessage.style = new PIXI.TextStyle({
      fontFamily: 'Dimbo',
      align: 'center',
      fontSize: 40,
      padding: 20,
      dropShadow: true,
      dropShadowAlpha: 0.3
    })
    this.currentMessage.anchor.set(0.5)
    this.currentMessage.x = position.x
    this.currentMessage.y = position.y

    this.displaySprite = new PIXI.Sprite.from(app.loader.resources['DisplayPanelBG'].texture)
    this.displaySprite.anchor.set(0.5)
    this.displaySprite.x = position.x
    this.displaySprite.y = position.y
  }

  setText = (text: string) => {
    this.currentMessage.text = text
  }

  winState = () => {
    var Flasher = new PIXI.Ticker().add((delta: number) => {
      this.timer += delta
      if (this.timer >= 15) {
        this.currentMessage.visible = !this.currentMessage.visible
        this.timer = 0
      }
    })
    Flasher.start()
  }

  render = (app: any) => {
    // app.stage.addChild(this.displaySprite)
    app.stage.addChild(this.currentMessage)
  }
}

const LoadResources = (app: any) => {
  console.log("Loading Resources")
  app.loader.add('SafeClosed', '../assets/graphics/safe_minigame.png')
  app.loader.add('SafeOpen', '../assets/graphics/safe_open_minigame.png')
  app.loader.add('Background', '../assets/graphics/background_safe_minigame.png')

  app.loader.add('DialBackground', '../assets/graphics/support_safe_dial_minigame.png')
  app.loader.add('Dial', '../assets/graphics/safe_dial_minigame.png')
  app.loader.add('Blinkers', '../assets/graphics/leds_safe_dial_minigame.png')
  app.loader.add('SpinLabel', '../assets/graphics/text_spin_safe_dial_minigame.png')

  app.loader.add('DisplayPanelBG', '../assets/graphics/display_panel_background.png')

  app.loader.add('DialDisplayBG', '../assets/graphics/screen_safe_background.png')
  app.loader.add('DialDisplayNorm', '../assets/graphics/screen_safe_minigame.png')
  app.loader.add('DialDisplayWin', '../assets/graphics/screen_safe_win.png')

  app.loader.add('Coins', '../assets/graphics/coins.png')
  app.loader.add('Notes', '../assets/graphics/notes.png')
  app.loader.add('Ring', '../assets/graphics/ring.png')
  app.loader.add('Diamond', '../assets/graphics/diamond.png')
  app.loader.add('Gold', '../assets/graphics/gold.png')

  app.loader.add('mainFont', '../assets/fonts/Dimbo Italic.ttf')
  app.loader.add('dialFont', '../assets/fonts/TitanOne-Regular.ttf')

  app.loader.load(StartGame)

}

const canvas = new PIXI.Application({
  width: 916,
  height: 623,
  transparent: true
});

const StartGame = () => {
  console.log("Resources Loaded... Rendering Game")

  //initialize the Background and remder it
  const bg = new Background(canvas);
  bg.render(canvas)

  //initialize and render Main Display
  const disp = new MainDisplay({ x: 460, y: 70 }, canvas)
  disp.render(canvas)

  //initialize new Dial Display and render
  const dialDisplay = new DialDisplay({ x: 735, y: 220 }, canvas)
  dialDisplay.render(canvas)



  //initialize array of blinker positions
  let BlinkerPositions = [
    { x: 650, y: 290 },
    { x: 820, y: 290 }
  ]

  //initialize an empty array of blinkers incase they need referenceing
  let blinkers: Array<Blinker> = []

  //Create Blinkers Ready for rendering with positions applied
  BlinkerPositions.map((pos) => {
    blinkers.push(new Blinker(pos, canvas))
  })

  //render all the blinky things
  blinkers.map((b) => {
    b.render(canvas)
  })

  //initialise Safe Positions
  const sPositions: Array<{ x: number, y: number }> = [
    { x: 125, y: 235 },
    { x: 300, y: 235 },
    { x: 475, y: 235 },
    { x: 125, y: 380 },
    { x: 300, y: 380 },
    { x: 475, y: 380 },
    { x: 125, y: 525 },
    { x: 300, y: 525 },
    { x: 475, y: 525 },
  ]

  //Create Safe instances with safe positions
  const safes: Array<Safe> = []

  //Generate New Safes for each position
  sPositions.forEach((i, index) => {
    safes.push(new Safe(index + 1, i, canvas))
  });

  //Render Safes
  safes.map((i: Safe) => {
    i.render(canvas)
  })

  //initialise a new Dial and render it
  const dial = new Dial({ x: 735, y: 440 }, dialDisplay, disp, safes, canvas)
  dial.render(canvas)
}


document.body.appendChild(canvas.view)

LoadResources(canvas);
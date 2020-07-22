# Run Instructions
---
in a terminal / powershell
`$ git clone https://github.com/Lite5h4dow/SlotGame.git`

Navigate To Directory
`$ cd SlotGame`

Run VS Code
`$ code .`

Press F5 and open `http://localhost:8000/`

There is a chance it wont find a match as this is 100% random.
Refresh to start over.

Typescript code in ./static/components 

its all in one monolithic file because imports break express when its used like this and i didnt want to deal with it at the time, 
if i had the free time i would have it in seperate class files.

Built With PIXI.js in HTML5 Canvas.
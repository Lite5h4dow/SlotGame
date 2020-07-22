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

KNOWN BUGS:
 - for some reason in most browsers it dosent load the fonts in time. there is a fix for the next release of chrome (document.fonts.ready.then()) But this is only available in the dev release and hasnt been added to the Typescript declaration files as of yet.
  - fix: Use a library that can handle imports and has an await function. I decided not to do it since there would be an extra library that wasnt asked for or provided. just making it known that I know a solution but cant impliment it with current browser builds, not to mention it not being backwards compatible.

Built With PIXI.js in HTML5 Canvas.
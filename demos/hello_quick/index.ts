import { Byte, double, LongInt, pointer, SmallInt, Word } from "../../experimental/units/pascal_compat";

import { i32str } from "../../experimental/units/conv";
import { cls, vgaFlush, vgaWidth } from "../../experimental/units/vga";
import { fitCanvas } from "../../experimental/units/fullscreen";
import { isKeyDown } from "../../experimental/units/keyboard";
import { getMouseX, getMouseY, updateMouse } from "../../experimental/units/mouse";
import { getLastFPS, incrementFPS, initFPSCounter } from "../../experimental/units/fps";
import { dt, initDeltaTime, updateDeltaTime } from "../../experimental/units/timing";
import { spr, sprRegion } from "../../experimental/units/img_ref_fast";

import { defaultFont, defaultFontGlyphs, imgCGA, imgCursor, imgDosuEXE, measureDefault, printDefault } from "./assets";
import { measureBMFont, printBMFontChar } from "../../experimental/units/bmfont";
import { writeLog, writeLogI32 } from "../../experimental/units/logger";

enum TGameStates {
  GameStateIntro = 1,
  GameStateLoading = 2,
  GameStatePlaying = 3
}

const
  SC_ESC: Byte = 0x01,
  CornflowerBlue = 0xFF6495ED;

// Game state variables
let
  lastEsc = false,
  actualGameState: TGameStates,
  gameTime: double;

// @ts-ignore
@external("env", "signalDone")
export declare function signalDone(): void;
// @ts-ignore
@external("env", "hideCursor")
export declare function hideCursor(): void;
// @ts-ignore
@external("env", "hideLoadingOverlay")
export declare function hideLoadingOverlay(): void;
// @ts-ignore
@external("env", "loadAssets")
export declare function loadAssets(): void;


function drawFPS(): void {
  printDefault("FPS:" + i32str(getLastFPS()), 240, 0);
}

function drawMouse(): void {
  spr(imgCursor, getMouseX(), getMouseY())
}


function beginLoadingState(): void {
  actualGameState = TGameStates.GameStateLoading;
  fitCanvas();
  loadAssets()
}

function beginPlayingState(): void {
  hideCursor();
  fitCanvas();

  // Initialise game state here
  actualGameState = TGameStates.GameStatePlaying;
  gameTime = 0.0;
}


// TODO: Call this from the glue code
function cleanup(): void {
  __free(changetype<pointer>(defaultFont));
  __free(defaultFontGlyphs)
}

function init(): void {
  // initHeapMgr();
  initDeltaTime();
  initFPSCounter();
}

function afterInit(): void {
  beginPlayingState();

  writeLog("defaultFont");
  writeLogI32(defaultFont.lineHeight);
  writeLogI32(defaultFont.imgHandle)
}

function update(): void {
  updateDeltaTime();
  incrementFPS();

  // Handle inputs
  updateMouse();

  if (lastEsc != isKeyDown(SC_ESC)) {
    lastEsc = isKeyDown(SC_ESC);

    if (lastEsc) {
      // writeLog("ESC is pressed!");
      signalDone();
    }
  }

  // Handle game state updates
  gameTime = gameTime + dt
}

function renderLoadingScreen(): void {
  cls(0xFF000000);

  vgaFlush();
}

function draw(): void {
  let w: Word;
  let s: string;

  if (actualGameState == TGameStates.GameStateLoading) {
    renderLoadingScreen();
    return
  }

  cls(CornflowerBlue);

  if ((<LongInt>(gameTime * 4) & 1) > 0)
    spr(imgDosuEXE[1], 148, 88)
  else
    spr(imgDosuEXE[0], 148, 88);

  printBMFontChar(defaultFont, defaultFontGlyphs, 65, 10, 10);

  // s = "Hello world!";
  // w = measureDefault(s);
  // printDefault(s, (vgaWidth - 96) / 2, 120);

  drawMouse();
  // drawFPS();

  vgaFlush()
}

// Everything exported here will be available
// via WebAssembly instance exports

export {
  setImgCursor, setImgDosuEXE, setImgCga,
  defaultFontPtr, defaultFontGlyphsPtr
} from "./assets";

export { initVideoMem, getSurfacePtr } from "../../experimental/units/vga";
export { initHeap, WasmGetMem } from "../../experimental/units/wasm_heap";
export { getLogBufferPtr } from "../../experimental/units/logger";
export { registerImageRef } from "../../experimental/units/img_ref";

export {
  beginLoadingState,
  init, afterInit, update, draw
};

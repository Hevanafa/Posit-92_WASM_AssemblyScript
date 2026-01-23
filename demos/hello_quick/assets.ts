import { LongInt, pointer, SmallInt, Word } from "../../experimental/units/pascal_compat";
import { measureBMFont, printBMFont, printBMFontChar, TBMFont, TBMFontGlyph } from "../../experimental/units/bmfont";

export let
  imgCursor: LongInt,
  imgCGA: LongInt,
  imgDosuEXE = new StaticArray<LongInt>(2);
  
export let
  defaultFont: TBMFont = changetype<TBMFont>(__new(offsetof<TBMFont>(), idof<TBMFont>())),
  defaultFontGlyphs: pointer = __new(127 * offsetof<TBMFontGlyph>(), idof<StaticArray<TBMFontGlyph>>());

export function setImgCursor(imgHandle: LongInt): void {
  imgCursor = imgHandle
}

export function setImgDosuEXE(imgHandle: LongInt, idx: SmallInt): void {
  imgDosuEXE[idx] = imgHandle
}

export function setImgCga(imgHandle: LongInt): void {
  imgCGA = imgHandle
}

export function defaultFontPtr(): pointer {
  return changetype<pointer>(defaultFont)
}

export function defaultFontGlyphsPtr(): pointer {
  return changetype<pointer>(defaultFontGlyphs)
}

export function printDefault(text: string, x: SmallInt, y: SmallInt): void {
  printBMFont(defaultFont, defaultFontGlyphs, text, x, y)
}

export function measureDefault(text: string): Word {
  return measureBMFont(defaultFontGlyphs, text)
}

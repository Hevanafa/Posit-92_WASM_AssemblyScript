import { sprRegion } from "./img_ref_fast";
import { Byte, LongInt, SmallInt, Word } from "./pascal_compat";

@unmanaged
export class TBMFontGlyph {
  id: Word;
  x: Word;
  y: Word;
  width: Word;
  height: Word;
  xoffset: SmallInt;
  yoffset: SmallInt;
  xadvance: SmallInt;

  constructor() {
    this.id = 0;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.xoffset = 0;
    this.yoffset = 0;
    this.xadvance = 0;
  }
}

@unmanaged
export class TBMFont {
  face: StaticArray<Byte>;
  filename: StaticArray<Byte>;
  lineHeight: Word;
  imgHandle: LongInt;

  constructor() {
    this.face = new StaticArray<Byte>(16);
    this.filename = new StaticArray<Byte>(64);
    this.lineHeight = 0;
    this.imgHandle = 0;
  }
}

/**
 * @returns `glyph.xadvance`
 */
export function printBMFontChar(
  font: TBMFont,
  fontGlyphs: StaticArray<TBMFontGlyph>,
  charcode: Byte,
  x: SmallInt, y: SmallInt): SmallInt
{
  let glyphIdx: SmallInt;
  let glyph: TBMFontGlyph;

  // Assuming the starting charcode is always 32
  // glyphIdx := charcode - 32;

  glyphIdx = charcode;

  // if (glyphIdx in [low(fontGlyphs)..high(fontGlyphs)]) {
  if (glyphIdx < fontGlyphs.length) {
    glyph = fontGlyphs[glyphIdx];

    sprRegion(
      font.imgHandle,
      glyph.x, glyph.y,
      glyph.width, glyph.height,
      x + glyph.xoffset, y + glyph.yoffset);
    
    return glyph.xadvance
  } else
    return 0;
}

export function printBMFont(
  font: TBMFont,
  fontGlyphs: StaticArray<TBMFontGlyph>,
  text: string,
  x: SmallInt, y: SmallInt): void
{
  let a: Word;
  let ch: Byte;
  let left: SmallInt = 0;

  for (a = 0; a < <Word>text.length; a++) {
    ch = <Byte>text[a].charCodeAt(0);
    left +=  printBMFontChar(font, fontGlyphs, ch, x + left, y)
  }
}

export function measureBMFont(glyphs: StaticArray<TBMFontGlyph>, text: string): SmallInt
{
  let
    a: Word, result: Word,
    glyphIdx: SmallInt,
    charcode: Byte;

  result = 0;

  // for a=1 to length(text) do begin
  for (a = 0; a < <Word>text.length; a++) {
    charcode = <Byte>text[a].charCodeAt(0);

    // { Assuming the starting charcode is always 32 }
    // glyphIdx = charcode - 32;
    glyphIdx = charcode;

    // if (glyphIdx in [low(glyphs)..high(glyphs)]) then
      // inc(result, glyphs[glyphIdx].xadvance)

    if (glyphIdx < glyphs.length)
      result += glyphs[glyphIdx].xadvance;
  }

  return result
}
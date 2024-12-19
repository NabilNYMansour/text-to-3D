/* eslint-disable */

import * as opentype from "opentype.js";

interface FontConversionOptions {
  reverseTypeface?: boolean;
  jsonFormat?: boolean;
  restrictCharacters?: string | null;
}

interface GlyphToken {
  ha: number;
  x_min: number;
  x_max: number;
  o: string;
}

interface FontResult {
  glyphs: Record<string, GlyphToken>;
  familyName: string;
  ascender: number;
  descender: number;
  underlinePosition: number;
  underlineThickness: number;
  boundingBox: {
    yMin: number;
    xMin: number;
    yMax: number;
    xMax: number;
  };
  resolution: number;
  original_font_information: any;
  cssFontWeight: string;
  cssFontStyle: string;
}

/**
 * Convert a font file to a simplified JSON representation.
 *
 * @param {File} fontFile - The font file to process (e.g., TTF, OTF).
 * @param {FontConversionOptions} options - Options for conversion.
 * @returns {Promise<string>} - A promise that resolves to the JSON or JS string representation of the font.
 */
export async function convertFontToJson(
  fontFile: File,
  options: FontConversionOptions = {}
): Promise<string> {
  const {
    reverseTypeface = false,
    jsonFormat = true,
    restrictCharacters = null,
  } = options;

  const restriction = parseRestriction(restrictCharacters);
  const font = await loadFont(fontFile);

  const scale = (1000 * 100) / ((font.unitsPerEm || 2048) * 72);
  const result: FontResult = {
    glyphs: {},
    familyName: font.names.fontFamily.en,
    ascender: Math.round(font.ascender * scale),
    descender: Math.round(font.descender * scale),
    underlinePosition: Math.round(font.tables.post.underlinePosition * scale),
    underlineThickness: Math.round(font.tables.post.underlineThickness * scale),
    boundingBox: {
      yMin: Math.round(font.tables.head.yMin * scale),
      xMin: Math.round(font.tables.head.xMin * scale),
      yMax: Math.round(font.tables.head.yMax * scale),
      xMax: Math.round(font.tables.head.xMax * scale),
    },
    resolution: 1000,
    original_font_information: font.tables.name,
    cssFontWeight: "normal",
    cssFontStyle: "normal",
  };

  // Process glyphs
  console.log();

  Object.keys(font.glyphs.glyphs).forEach((glyphIndex) => {
    const glyph = font.glyphs.glyphs[glyphIndex];
    const unicodes = collectUnicodes(glyph);

    unicodes.forEach((unicode) => {
      const glyphCharacter = String.fromCharCode(unicode);
      let needToExport = true;

      if (restriction.range) {
        needToExport = unicode >= restriction.range[0] && unicode <= restriction.range[1];
      } else if (restriction.set) {
        needToExport = restriction.set.includes(glyphCharacter);
      }

      if (needToExport) {
        result.glyphs[glyphCharacter] = processGlyph(glyph, scale, reverseTypeface);
      }
    })
  });

  return jsonFormat ? JSON.stringify(result) : generateJSOutput(result);
}

// Helper Functions

/**
 * Load a font file as an OpenType font object.
 *
 * @param {File} file - The font file to load.
 * @returns {Promise<opentype.Font>} - A promise resolving to the loaded font.
 */
function loadFont(file: File): Promise<opentype.Font> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const font = opentype.parse(event.target?.result as ArrayBuffer);
        resolve(font);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse the character restriction into a usable format.
 *
 * @param {string | null} restrictCharacters - Restriction string (e.g., "65-90" or "ABC").
 * @returns {Object} - Parsed restriction.
 */
function parseRestriction(restrictCharacters: string | null): {
  range: [number, number] | null;
  set: string | null;
} {
  const restriction: any = { range: null, set: null };

  if (restrictCharacters) {
    const rangeSeparator = "-";
    if (restrictCharacters.includes(rangeSeparator)) {
      const rangeParts = restrictCharacters.split(rangeSeparator);
      if (rangeParts.length === 2 && !isNaN(+rangeParts[0]) && !isNaN(+rangeParts[1])) {
        restriction.range = [parseInt(rangeParts[0], 10), parseInt(rangeParts[1], 10)];
      }
    }

    if (!restriction.range) {
      restriction.set = restrictCharacters;
    }
  }

  return restriction;
}

/**
 * Collect all Unicode values for a glyph.
 *
 * @param {opentype.Glyph} glyph - The glyph to process.
 * @returns {number[]} - An array of Unicode values.
 */
function collectUnicodes(glyph: opentype.Glyph): number[] {
  const unicodes: number[] = [];
  if (glyph.unicode !== undefined) unicodes.push(glyph.unicode);
  if (glyph.unicodes.length) {
    glyph.unicodes.forEach((unicode) => {
      if (!unicodes.includes(unicode)) {
        unicodes.push(unicode);
      }
    });
  }
  return unicodes;
}

/**
 * Process a glyph and return a token representation.
 *
 * @param {opentype.Glyph} glyph - The glyph to process.
 * @param {number} scale - Scale factor for the glyph.
 * @param {boolean} reverseTypeface - Whether to reverse the glyph paths.
 * @returns {GlyphToken} - Processed glyph token.
 */
function processGlyph(
  glyph: opentype.Glyph,
  scale: number,
  reverseTypeface: boolean
): GlyphToken {
  const token: GlyphToken = {
    ha: Math.round(glyph.advanceWidth! * scale),
    x_min: Math.round(glyph.xMin! * scale),
    x_max: Math.round(glyph.xMax! * scale),
    o: "",
  };

  const commands = reverseTypeface ? reverseCommands(glyph.path.commands) : glyph.path.commands;

  commands.forEach((command: any) => {
    if (command.type.toLowerCase() === "c") command.type = "b";
    token.o += command.type.toLowerCase() + " ";
    if (command.x !== undefined && command.y !== undefined) {
      token.o += `${Math.round(command.x * scale)} ${Math.round(command.y * scale)} `;
    }
    if (command.x1 !== undefined && command.y1 !== undefined) {
      token.o += `${Math.round(command.x1 * scale)} ${Math.round(command.y1 * scale)} `;
    }
    if (command.x2 !== undefined && command.y2 !== undefined) {
      token.o += `${Math.round(command.x2 * scale)} ${Math.round(command.y2 * scale)} `;
    }
  });

  return token;
}

/**
 * Reverse the drawing commands for a glyph.
 *
 * @param {opentype.PathCommand[]} commands - The glyph path commands.
 * @returns {opentype.PathCommand[]} - The reversed commands.
 */
function reverseCommands(commands: opentype.PathCommand[]): opentype.PathCommand[] {
  const paths: opentype.PathCommand[][] = [];
  let path: opentype.PathCommand[] = [];

  commands.forEach((command) => {
    if (command.type.toLowerCase() === "m") {
      if (path.length) paths.push(path);
      path = [command];
    } else if (command.type.toLowerCase() !== "z") {
      path.push(command);
    }
  });
  if (path.length) paths.push(path);

  const reversed: opentype.PathCommand[] = [];
  paths.forEach((path: any) => {
    for (let i = path.length - 1; i >= 1; i--) {
      const cmd = path[i];
      const nextCmd = path[i - 1];
      reversed.push({
        type: cmd.type,
        x: nextCmd.x,
        y: nextCmd.y,
        ...(cmd.x2 && { x1: cmd.x2, y1: cmd.y2, x2: cmd.x1, y2: cmd.y1 }),
        ...(cmd.x1 && { x1: cmd.x1, y1: cmd.y1 }),
      });
    }
  });

  return reversed;
}

/**
 * Generate JavaScript output from the font result.
 *
 * @param {FontResult} result - The processed font result.
 * @returns {string} - The JavaScript string.
 */
function generateJSOutput(result: FontResult): string {
  return `if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace(${JSON.stringify(result)});`;
}

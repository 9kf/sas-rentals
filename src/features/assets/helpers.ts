// export function generateRandomLightColor() {
//   const randomHue = Math.floor(Math.random() * 360); // Random hue value between 0 and 359 (360 degrees in HSL color space)
//   const randomSaturation = Math.floor(Math.random() * 50) + 50; // Random saturation value between 50 and 100
//   const randomLightness = Math.floor(Math.random() * 40) + 30; // Random lightness value between 30 and 70

//   return `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;
// }

export function generateRandomLightColor() {
  const randomHue = Math.floor(Math.random() * 360); // Random hue value between 0 and 359 (360 degrees in HSL color space)
  const randomSaturation = Math.floor(Math.random() * 50) + 50; // Random saturation value between 50 and 100
  const randomLightness = Math.floor(Math.random() * 40) + 30; // Random lightness value between 30 and 70

  const rgbColor = hslToRgb(
    randomHue / 360,
    randomSaturation / 100,
    randomLightness / 100
  );
  const hexCode = rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);

  return hexCode;
}

export function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hslToRgb(h: number, s: number, l: number): number[] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

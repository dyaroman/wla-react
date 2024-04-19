function hex2rgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

export function rgb2hex(rgbString) {
  // Extract RGB values from the string
  const rgbValues = rgbString.match(/\d+/g);

  // Convert each RGB value to hexadecimal
  const hexValues = rgbValues.map((value) => {
    const hex = parseInt(value, 10).toString(16); // Convert decimal to hexadecimal
    return hex.length === 1 ? '0' + hex : hex; // Ensure two-digit format
  });

  // Concatenate the hexadecimal values to form the hex color code
  const hexColor = '#' + hexValues.join('');

  return hexColor.toLowerCase();
}

// Calculate the luminance for a color.
// See https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
function luminance(color) {
  const _ = hex2rgb(color).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return _[0] * 0.2126 + _[1] * 0.7152 + _[2] * 0.0722;
}

// Calculate the contrast ratio between two colors.
// See https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
function contrast(back, front) {
  const backLum = luminance(back) + 0.05;
  const frontLum = luminance(front) + 0.05;

  return Math.max(backLum, frontLum) / Math.min(backLum, frontLum);
}

export function getContrastColor(color) {
  const lightContrast = contrast(color, '#fff');
  const darkContrast = contrast(color, '#000');

  return lightContrast > darkContrast ? '#fff' : '#000';
}

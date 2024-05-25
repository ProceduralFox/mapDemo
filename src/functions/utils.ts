export const longInputProps = {
  required: true,
  max: 180,
  min: -180,
  step: 'any',
};

export const latInputProps = {
  required: true,
  max: 90,
  min: -90,
  step: 'any',
};

export const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
export const toDegrees = (radians: number) => (radians * 180) / Math.PI;

export const toMiles = (meters: number): number => meters / 1609.34;

export const toReadableDegrees = (decimalDegrees: number) => {
  const degrees = Math.floor(decimalDegrees);

  const decimalMinutes = (decimalDegrees - degrees) * 60;

  const minutes = Math.floor(decimalMinutes);

  const seconds = (decimalMinutes - minutes) * 60;

  return `${degrees}° ${minutes}' ${seconds.toFixed(2)}"`;
};

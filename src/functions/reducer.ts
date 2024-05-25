import type { IAppState, IDispatchActions, WGS84point } from '../types';
import { getDistance } from 'ol/sphere';
import { toDegrees, toRadians } from './utils';

export default function reducer(state: IAppState, action: IDispatchActions) {
  const newState = structuredClone(state);

  switch (action.type) {
    case 'tool':
      newState.currentlySelectedTool = action.payload;
      break;
    case 'source':
      newState.mapSource = action.payload;
      break;
    case 'length unit':
      newState.lengthState.lengthUnit = action.payload;
      break;
    case 'angle unit':
      newState.angleState.angleUnit = action.payload;
      break;

    case 'length start point':
      newState.lengthState.startPoint = action.payload;
      if (newState.lengthState.endPoint !== null) {
        newState.lengthState.lineLength = getDistance(
          action.payload,
          newState.lengthState.endPoint
        );

        newState.lengthState.lineAzimuth = getAzimuth(
          action.payload,
          newState.lengthState.endPoint
        );
      }
      break;
    case 'length end point':
      newState.lengthState.endPoint = action.payload;
      if (newState.lengthState.startPoint !== null) {
        newState.lengthState.lineLength = getDistance(
          newState.lengthState.startPoint,
          action.payload
        );

        newState.lengthState.lineAzimuth = getAzimuth(
          newState.lengthState.startPoint,
          action.payload
        );
      }
      break;
    case 'azimuth unit':
      newState.lengthState.azimuthUnit = action.payload;
      break;
    case 'angle start':
      newState.angleState.sharedPoint = action.payload;

      if (
        newState.angleState.firstEnd !== null &&
        newState.angleState.secondEnd !== null
      ) {
        newState.angleState.angle = getAngle(
          newState.angleState.sharedPoint,
          newState.angleState.firstEnd,
          newState.angleState.secondEnd
        );
      }
      break;
    case 'angle end 1':
      newState.angleState.firstEnd = action.payload;

      if (
        newState.angleState.sharedPoint !== null &&
        newState.angleState.secondEnd !== null
      ) {
        newState.angleState.angle = getAngle(
          newState.angleState.sharedPoint,
          newState.angleState.firstEnd,
          newState.angleState.secondEnd
        );
      }
      break;
    case 'angle end 2':
      newState.angleState.secondEnd = action.payload;

      if (
        newState.angleState.sharedPoint !== null &&
        newState.angleState.firstEnd !== null
      ) {
        newState.angleState.angle = getAngle(
          newState.angleState.sharedPoint,
          newState.angleState.firstEnd,
          newState.angleState.secondEnd
        );
      }
      break;

    case 'polyline add':
      newState.polylineState.points.push(action.payload);
      break;
    case 'polyline remove nearest':
      {
        const nearestPointIndex = getNearestPointIndex(
          action.payload,
          newState.polylineState.points
        );
        if (nearestPointIndex === null) break;

        newState.polylineState.points = newState.polylineState.points.filter(
          (value, index) => index !== nearestPointIndex
        );
      }
      break;
    case 'polyline move nearest':
      {
        const nearestPointIndex = getNearestPointIndex(
          action.payload,
          newState.polylineState.points
        );
        if (nearestPointIndex === null) break;

        newState.polylineState.points[nearestPointIndex] = action.payload;
      }
      break;
    case 'polyline replace':
      newState.polylineState.points = action.payload;
      break;
    case 'map click':
      newState.meta.lastClickedCoordinates = action.payload;
      break;

    default:
      break;
  }

  return newState;
}

export function initializer(): IAppState {
  return {
    currentlySelectedTool: 'length',
    mapSource: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    lengthState: {
      startPoint: null,
      endPoint: null,
      lineLength: 0,
      lineAzimuth: null,
      lengthUnit: 'kilometers',
      azimuthUnit: 'deg',
    },
    angleState: {
      angle: null,
      angleUnit: 'deg',
      firstEnd: null,
      secondEnd: null,
      sharedPoint: null,
    },
    polylineState: {
      points: [],
    },
    meta: {
      lastClickedCoordinates: [0, 0],
    },
  };
}

const getAzimuth = (start: number[], end: number[]) => {
  const startLong = toRadians(start[0]);
  const startLat = toRadians(start[1]);

  const endLong = toRadians(end[0]);
  const endLat = toRadians(end[1]);

  const deltaLong = endLong - startLong;

  const x = Math.sin(deltaLong) * Math.cos(endLat);
  const y =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLong);

  let azimuth = Math.atan2(x, y);
  azimuth = toDegrees(azimuth);
  azimuth = (azimuth + 360) % 360;

  return azimuth;
};

const getAngle = (
  sharedPoint: number[],
  firstEnd: number[],
  secondEnd: number[]
): number => {
  const sharedPointLong = toRadians(sharedPoint[0]);
  const sharedPointLat = toRadians(sharedPoint[1]);

  const firstEndPointLong = toRadians(firstEnd[0]);
  const firstEndPointLat = toRadians(firstEnd[1]);

  const secondEndPointLong = toRadians(secondEnd[0]);
  const secondEndPointLat = toRadians(secondEnd[1]);

  const vectorA = [
    Math.cos(firstEndPointLat) * Math.cos(firstEndPointLong) -
      Math.cos(sharedPointLat) * Math.cos(sharedPointLong),
    Math.cos(firstEndPointLat) * Math.sin(firstEndPointLong) -
      Math.cos(sharedPointLat) * Math.sin(sharedPointLong),
    Math.sin(firstEndPointLat) - Math.sin(sharedPointLat),
  ];

  const vectorB = [
    Math.cos(secondEndPointLat) * Math.cos(secondEndPointLong) -
      Math.cos(sharedPointLat) * Math.cos(sharedPointLong),
    Math.cos(secondEndPointLat) * Math.sin(secondEndPointLong) -
      Math.cos(sharedPointLat) * Math.sin(sharedPointLong),
    Math.sin(secondEndPointLat) - Math.sin(sharedPointLat),
  ];

  const dotProduct =
    vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1] + vectorA[2] * vectorB[2];

  const magnitudeA = Math.sqrt(
    vectorA[0] ** 2 + vectorA[1] ** 2 + vectorA[2] ** 2
  );
  const magnitudeB = Math.sqrt(
    vectorB[0] ** 2 + vectorB[1] ** 2 + vectorB[2] ** 2
  );

  const cosTheta = dotProduct / (magnitudeA * magnitudeB);

  const angle = Math.acos(cosTheta);

  return toDegrees(angle);
};

const getNearestPointIndex = (position: WGS84point, points: WGS84point[]) => {
  const { length } = points;

  // this function shouldn't be able to be called if the array has no points in it
  // but better to have a safeguard here too in case
  if (length < 1) return null;

  let currentShortestDistance = getDistance(position, points[0]);
  let currentNearestPointIndex = 0;

  for (let index = 1; index < length; index++) {
    const distance = getDistance(position, points[index]);
    if (distance < currentShortestDistance) {
      currentShortestDistance = distance;
      currentNearestPointIndex = index;
    }
  }

  return currentNearestPointIndex;
};

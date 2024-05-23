import type { IAppState, IDispatchActions } from './types';
import { getDistance } from 'ol/sphere';

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
      newState.lengthState.unit = action.payload;
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
    case 'polyline remove':
      // TODO: reconsider this assumption

      // assuming that in a co-ordinate system referencing physical space
      // no point can occupy the same coordinates that another point can
      // there is no need for extra point indentifier and it can be
      // filtered naively based on the positon

      // this is a reasonably large assumption
      newState.polylineState.points = newState.polylineState.points.filter(
        (point) => {
          return (
            point[0] === action.payload[0] && point[1] === action.payload[1]
          );
        }
      );
      break;
    case 'polyline move':
      // TODO: double check coherence with other polyline dispatches
      {
        const { newPosition, pointToMove } = action.payload;

        newState.polylineState.points[pointToMove] = newPosition;
      }
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
      lineAzimuth: 0,
      unit: 'kilometers',
    },
    angleState: {
      angle: '',
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
  return 1;
};

const getAngle = (sharedPoint: number[], end1: number[], end2: number[]) => {
  return 'deg';
};

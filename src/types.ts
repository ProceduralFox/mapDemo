export type IAppState = {
  mapSource: IOnlineMapSource;
  currentlySelectedTool: ITool;
  lengthState: ILengthState;
  angleState: IAngleState;
  polylineState: IPolylineState;
  meta: {
    lastClickedCoordinates: [number, number];
  };
};

// TODO: maybe type this fancier with an enum
export type IOnlineMapSource =
  | 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  | 'https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';

export type ITool = 'length' | 'angle' | 'polyline';

export interface ILengthState {
  startPoint: WGS84point | null;
  endPoint: WGS84point | null;
  lineLength: Number;
  lineAzimuth: Number;
  unit: ILengthUnits;
}

type ILengthUnits = 'kilometers' | 'miles';

export interface IAngleState {
  sharedPoint: WGS84point | null;
  firstEnd: WGS84point | null;
  secondEnd: WGS84point | null;
  angle: string;
  angleUnit: IAngleUnits;
}

type IAngleUnits = 'deg' | 'rad';

export interface IPolylineState {
  points: WGS84point[];
}

export type IDispatchActions =
  | IDispatchActionStandard
  | IDispatchActionLengthUnit
  | IDispatchActionAngleUnit
  | IDispatchActionTool
  | IDispatchActionSource
  | IDispatchPolylineRemove
  | IDispatchLastClickedCoords;

interface IDispatchActionStandard {
  type:
    | 'length start point'
    | 'length end point'
    | 'angle start'
    | 'angle end 1'
    | 'angle end 2'
    | 'polyline add'
    | 'polyline remove';
  payload: WGS84point;
}

interface IDispatchLastClickedCoords {
  type: 'map click';
  payload: [number, number];
}

interface IDispatchActionLengthUnit {
  type: 'length unit';
  payload: ILengthUnits;
}

interface IDispatchActionAngleUnit {
  type: 'angle unit';
  payload: IAngleUnits;
}

interface IDispatchActionTool {
  type: 'tool';
  payload: ITool;
}

interface IDispatchActionSource {
  type: 'source';
  payload: IOnlineMapSource;
}

interface IDispatchPolylineRemove {
  type: 'polyline move';
  payload: {
    newPosition: WGS84point;
    pointToMove: number;
  };
}

// TODO: maybe make this also a choice?
// using WGS84 as the user display and state internal value due to being
// most recognizable
// [lat, long]
type WGS84point = number[];

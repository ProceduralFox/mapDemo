import type { Map } from 'ol';
import type { IAppState, IDispatchActions } from '../types';
import type { Dispatch } from 'react';
import { redrawMap } from '../functions/mapRendererReconciliators.functions';
import { toLonLat } from 'ol/proj';

type Props = {
  map: Map;
  state: IAppState;
  dispatch: Dispatch<IDispatchActions>;
  popupRef: any;
  selectedMapCoordinates: number[];
};

const PopupContent = ({ state, dispatch, selectedMapCoordinates }: Props) => {
  // TODO: probably extract to separate components

  //TODO: more options for polyline
  if (state.currentlySelectedTool === 'length') {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            console.log();
            dispatch({
              type: 'length start point',
              payload: toLonLat(selectedMapCoordinates),
            });
          }}
        >
          Place Start Point
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch({
              type: 'length end point',
              payload: toLonLat(selectedMapCoordinates),
            });
          }}
        >
          Place End Point
        </button>
      </div>
    );
  }

  if (state.currentlySelectedTool === 'angle') {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            console.log();
            dispatch({
              type: 'angle start',
              payload: toLonLat(selectedMapCoordinates),
            });
          }}
        >
          Place Shared Point
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch({
              type: 'angle end 1',
              payload: toLonLat(selectedMapCoordinates),
            });
          }}
        >
          Place End of First Line
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch({
              type: 'angle end 2',
              payload: toLonLat(selectedMapCoordinates),
            });
          }}
        >
          Place End of Second Line
        </button>
      </div>
    );
  }

  if (state.currentlySelectedTool === 'polyline') {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            dispatch({
              type: 'polyline add',
              payload: toLonLat(selectedMapCoordinates),
            });
          }}
        >
          Append a new point
        </button>
      </div>
    );
  }
};

export default PopupContent;

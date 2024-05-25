import type { Map } from 'ol';
import { toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';
import type { Dispatch } from 'react';
import type { IAppState, IDispatchActions } from '../types';

type Props = {
  map: Map;
  state: IAppState;
  dispatch: Dispatch<IDispatchActions>;
  popupRef: any;
  selectedMapCoordinates: number[];
};

const PopupContent = ({ state, dispatch, selectedMapCoordinates }: Props) => {
  const renderButtons = () => {
    if (state.currentlySelectedTool === 'length') {
      return (
        <>
          <button
            type="button"
            className="buttonPrimary"
            onClick={() => {
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
            className="buttonPrimary"
            onClick={() => {
              dispatch({
                type: 'length end point',
                payload: toLonLat(selectedMapCoordinates),
              });
            }}
          >
            Place End Point
          </button>
        </>
      );
    }

    if (state.currentlySelectedTool === 'angle') {
      return (
        <>
          <button
            type="button"
            className="buttonPrimary"
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
            className="buttonPrimary"
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
            className="buttonPrimary"
            onClick={() => {
              dispatch({
                type: 'angle end 2',
                payload: toLonLat(selectedMapCoordinates),
              });
            }}
          >
            Place End of Second Line
          </button>
        </>
      );
    }

    if (state.currentlySelectedTool === 'polyline') {
      return (
        <>
          <button
            type="button"
            className="buttonPrimary"
            onClick={() => {
              dispatch({
                type: 'polyline add',
                payload: toLonLat(selectedMapCoordinates),
              });
            }}
          >
            Append a new point
          </button>
          {state.polylineState.points.length > 0 ? (
            <>
              <button
                type="button"
                className="buttonPrimary"
                onClick={() => {
                  dispatch({
                    type: 'polyline move nearest',
                    payload: toLonLat(selectedMapCoordinates),
                  });
                }}
              >
                Move Nearest Point
              </button>
              <button
                type="button"
                className="buttonPrimary"
                onClick={() => {
                  dispatch({
                    type: 'polyline remove nearest',
                    payload: toLonLat(selectedMapCoordinates),
                  });
                }}
              >
                Remove Nearest Point
              </button>
            </>
          ) : null}
        </>
      );
    }
  };

  return (
    <div className="popupWrapper">
      <div>{toStringHDMS(toLonLat(selectedMapCoordinates))}</div>
      {renderButtons()}
    </div>
  );
};

export default PopupContent;

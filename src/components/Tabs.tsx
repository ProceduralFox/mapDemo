import type { Dispatch } from 'react';
import type {
  IAngleUnits,
  IDispatchActions,
  ILengthUnits,
  WGS84point,
} from '../types';
import { IAppState } from '../types';
import AngleForm from './AngleForm';
import LengthForm from './LengthForm';
import PolylineForm from './PolylineForm';

type Props = {
  state: IAppState;
  dispatch: Dispatch<IDispatchActions>;
};

const Tabs = ({ state, dispatch }: Props) => {
  const handleAngleSubmit = (
    sharedStart: WGS84point,
    firstEnd: WGS84point,
    secondEnd: WGS84point,
    unit: IAngleUnits
  ) => {
    dispatch({
      type: 'angle start',
      payload: sharedStart,
    });

    dispatch({
      type: 'angle end 1',
      payload: firstEnd,
    });

    dispatch({
      type: 'angle end 2',
      payload: secondEnd,
    });

    dispatch({
      type: 'angle unit',
      payload: unit,
    });
  };

  const angleSubmit = (
    startPoint: WGS84point,
    endPoint: WGS84point,
    lengthUnit: ILengthUnits,
    azimuthUnit: IAngleUnits
  ) => {
    dispatch({
      type: 'length start point',
      payload: startPoint,
    });

    dispatch({
      type: 'length end point',
      payload: endPoint,
    });

    dispatch({
      type: 'length unit',
      payload: lengthUnit,
    });

    dispatch({
      type: 'azimuth unit',
      payload: azimuthUnit,
    });
  };

  const polylineSubmit = (points: WGS84point[]) => {
    console.log('?? !!');
    dispatch({
      type: 'polyline replace',
      payload: [...points],
    });
  };

  const renderTabContent = () => {
    switch (state.currentlySelectedTool) {
      case 'length':
        return (
          <LengthForm
            submitCallback={angleSubmit}
            lengthState={state.lengthState}
          />
        );

      case 'angle':
        return (
          <AngleForm
            submitCallback={handleAngleSubmit}
            angleState={state.angleState}
          />
        );

      case 'polyline':
        return (
          <PolylineForm
            submitCallback={polylineSubmit}
            polylineState={state.polylineState}
          />
        );
    }
  };

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'tool', payload: 'length' })}
          className={`tab ${
            state.currentlySelectedTool === 'length' ? 'tabSelected' : ''
          }`}
        >
          Length
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'tool', payload: 'angle' })}
          className={`tab ${
            state.currentlySelectedTool === 'angle' ? 'tabSelected' : ''
          }`}
        >
          Angle
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'tool', payload: 'polyline' })}
          className={`tab ${
            state.currentlySelectedTool === 'polyline' ? 'tabSelected' : ''
          }`}
        >
          Polyline
        </button>
      </div>
      <div className="tabContent">{renderTabContent()}</div>
    </div>
  );
};

export default Tabs;

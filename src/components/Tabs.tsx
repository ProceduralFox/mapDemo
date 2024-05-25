import type { Dispatch } from 'react';
import type { IDispatchActions } from '../types';
import { IAppState } from '../types';
import AngleForm from './AngleForm';
import LengthForm from './LengthForm';
import PolylineForm from './PolylineForm';

type Props = {
  state: IAppState;
  dispatch: Dispatch<IDispatchActions>;
};

const Tabs = ({ state, dispatch }: Props) => {
  const renderTabContent = () => {
    switch (state.currentlySelectedTool) {
      case 'length':
        return (
          <LengthForm dispatch={dispatch} lengthState={state.lengthState} />
        );

      case 'angle':
        return <AngleForm dispatch={dispatch} angleState={state.angleState} />;

      case 'polyline':
        return (
          <PolylineForm
            dispatch={dispatch}
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

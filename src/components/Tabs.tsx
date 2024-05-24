import { IAppState, ITool } from '../types';
import LengthForm from './LengthForm';
import type { IDispatchActions } from '../types';
import type { Dispatch } from 'react';
import TextInputsLength from './TextInputsLength';
import AngleForm from './AngleForm';
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
        >
          Length
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'tool', payload: 'angle' })}
        >
          Angle
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'tool', payload: 'polyline' })}
        >
          Polyline
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default Tabs;

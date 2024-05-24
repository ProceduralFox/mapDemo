import { ILengthState } from '../types';
import { useEffect, useState, type Dispatch, type FormEvent } from 'react';
import type { IDispatchActions, ILengthUnits } from '../types';
import { latInputProps, longInputProps } from '../utils';

type Props = {
  lengthState: ILengthState;
  dispatch: Dispatch<IDispatchActions>;
};

const LengthForm = ({ dispatch, lengthState }: Props) => {
  const initialComponentState = getInitialComponentStateValues(lengthState);

  const [startLong, setStartLong] = useState(initialComponentState.startLong);
  const [startLat, setStartLat] = useState(initialComponentState.startLat);

  const [endLong, setEndLong] = useState(initialComponentState.endLong);
  const [endLat, setEndLat] = useState(initialComponentState.endLat);

  const [unit, setUnit] = useState(initialComponentState.metric);

  const resetState = () => {
    // remove local changes by defaulting to values from appState
    const { startLat, startLong, endLat, endLong } = initialComponentState;

    setStartLat(startLat);
    setStartLong(startLong);
    setEndLat(endLat);
    setEndLong(endLong);
  };

  useEffect(() => {
    // reconcile input state with changes from map clicks
    resetState();
  }, [lengthState]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log('this ran tho');
    e.preventDefault();
    // TODO: accepts zeroes, in other places too
    if (startLat && startLong) {
      dispatch({
        type: 'length start point',
        payload: [Number(startLong), Number(startLat)],
      });
    }
    if (endLat && endLong) {
      dispatch({
        type: 'length end point',
        payload: [Number(endLong), Number(endLat)],
      });
    }

    dispatch({
      type: 'length unit',
      payload: unit,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <label htmlFor="startLong">Start point Longitude</label>
          <input
            type="number"
            id="startLong"
            value={startLong}
            onChange={(e) => setStartLong(e.target.value)}
            {...longInputProps}
          />
        </div>
        <div>
          <label htmlFor="startLat">Start point Latitude</label>
          <input
            type="number"
            id="startLat"
            value={startLat}
            onChange={(e) => setStartLat(e.target.value)}
            {...latInputProps}
          />
        </div>
      </div>
      <div>
        <div>
          <label htmlFor="endLong">End point Longitude</label>
          <input
            type="number"
            id="endLong"
            value={endLong}
            onChange={(e) => setEndLong(e.target.value)}
            {...longInputProps}
          />
        </div>
        <div>
          <label htmlFor="endLat">End point Latitude</label>
          <input
            type="number"
            id="endLat"
            value={endLat}
            onChange={(e) => setEndLat(e.target.value)}
            {...latInputProps}
          />
        </div>
      </div>
      <div>
        {/* {TODO: dynamic options */}
        <label htmlFor="lengthUnit">Length Display unit</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as ILengthUnits)}
          id="lengthUnit"
        >
          <option value="kilometers">Kilometers</option>
          <option value="miles">Miles</option>
        </select>
      </div>
      <div>
        <button type="submit">Confirm Changes</button>
        <button type="button" onClick={resetState}>
          Discard Changes
        </button>
      </div>
    </form>
  );
};

const getInitialComponentStateValues = (lengthState: ILengthState) => {
  return {
    startLong:
      lengthState.startPoint !== null
        ? lengthState.startPoint[0].toString()
        : '',
    startLat:
      lengthState.startPoint !== null
        ? lengthState.startPoint[1].toString()
        : '',
    endLong:
      lengthState.endPoint !== null ? lengthState.endPoint[0].toString() : '',
    endLat:
      lengthState.endPoint !== null ? lengthState.endPoint[1].toString() : '',
    metric: lengthState.unit,
  };
};

export default LengthForm;

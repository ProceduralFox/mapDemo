import { useEffect, useState, type Dispatch, type FormEvent } from 'react';
import { latInputProps, longInputProps } from '../functions/utils';
import type { IAngleUnits, IDispatchActions, ILengthUnits } from '../types';
import { ILengthState } from '../types';

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

  const [lengthUnit, setLengthUnit] = useState(
    initialComponentState.lengthUnit
  );

  const [azimuthUnit, setAzimuthUnit] = useState(
    initialComponentState.azimuthUnit
  );

  const resetState = () => {
    // remove local changes by defaulting to values from appState
    const { startLat, startLong, endLat, endLong, azimuthUnit, lengthUnit } =
      initialComponentState;

    setStartLat(startLat);
    setStartLong(startLong);
    setEndLat(endLat);
    setEndLong(endLong);

    setLengthUnit(lengthUnit);
    setAzimuthUnit(azimuthUnit);
  };

  useEffect(() => {
    // reconcile input state with changes from map clicks
    resetState();
  }, [lengthState]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({
      type: 'length start point',
      payload: [Number(startLong), Number(startLat)],
    });

    dispatch({
      type: 'length end point',
      payload: [Number(endLong), Number(endLat)],
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

  return (
    <form onSubmit={handleSubmit} className="formWrapper">
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="startLong">Start point Longitude</label>
          <input
            type="number"
            id="startLong"
            value={startLong}
            onChange={(e) => setStartLong(e.target.value)}
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
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
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="endLong">End point Longitude</label>
          <input
            type="number"
            id="endLong"
            value={endLong}
            onChange={(e) => setEndLong(e.target.value)}
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
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
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="lengthUnit">Length Display unit</label>
          <select
            value={lengthUnit}
            onChange={(e) => setLengthUnit(e.target.value as ILengthUnits)}
            id="lengthUnit"
          >
            <option value="kilometers">Kilometers</option>
            <option value="miles">Miles</option>
          </select>
        </div>
        <div className="inputLabel">
          <label htmlFor="azimuthUnit">Azimuth Display Unit</label>
          <select
            value={azimuthUnit}
            onChange={(e) => setAzimuthUnit(e.target.value as IAngleUnits)}
            id="azimuthUnit"
          >
            <option value="deg">Degree</option>
            <option value="rad">Radians</option>
          </select>
        </div>
      </div>

      <div className="inputRow">
        <button type="submit" className="buttonPrimary">
          Confirm Changes
        </button>
        <button type="button" onClick={resetState} className="buttonSecondary">
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
    lengthUnit: lengthState.lengthUnit,
    azimuthUnit: lengthState.azimuthUnit,
  };
};

export default LengthForm;

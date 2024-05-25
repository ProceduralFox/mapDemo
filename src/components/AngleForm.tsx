import { useEffect, useState, type Dispatch, type FormEvent } from 'react';
import { latInputProps, longInputProps } from '../functions/utils';
import type { IAngleState, IAngleUnits, IDispatchActions } from '../types';

type Props = {
  angleState: IAngleState;
  dispatch: Dispatch<IDispatchActions>;
};

const AngleForm = ({ dispatch, angleState }: Props) => {
  const initialComponentState = getInitialComponentStateValues(angleState);

  const [startLong, setStartLong] = useState(initialComponentState.startLong);
  const [startLat, setStartLat] = useState(initialComponentState.startLat);

  const [firstEndLong, setFirstEndLong] = useState(
    initialComponentState.firstEndLong
  );
  const [firstEndLat, setFirstEndLat] = useState(
    initialComponentState.firstEndLat
  );

  const [secondEndLong, setSecondEndLong] = useState(
    initialComponentState.secondEndLong
  );
  const [secondEndLat, setSecondEndLat] = useState(
    initialComponentState.secondEndLat
  );

  const [unit, setUnit] = useState(initialComponentState.unit);

  const resetState = () => {
    const {
      startLat,
      startLong,
      firstEndLat,
      firstEndLong,
      secondEndLat,
      secondEndLong,
      unit,
    } = initialComponentState;

    setStartLat(startLat);
    setStartLong(startLong);
    setFirstEndLat(firstEndLat);
    setFirstEndLong(firstEndLong);

    setSecondEndLat(secondEndLat);
    setSecondEndLong(secondEndLong);

    setUnit(unit);
  };

  useEffect(() => {
    // reconcile input state with changes from map clicks
    resetState();
  }, [angleState]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({
      type: 'angle start',
      payload: [Number(startLong), Number(startLat)],
    });

    dispatch({
      type: 'angle end 1',
      payload: [Number(firstEndLong), Number(firstEndLat)],
    });

    dispatch({
      type: 'angle end 2',
      payload: [Number(secondEndLong), Number(secondEndLat)],
    });

    dispatch({
      type: 'angle unit',
      payload: unit,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="formWrapper">
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="startLong">Shared Start Point Longitude</label>
          <input
            type="number"
            id="startLong"
            value={startLong}
            onChange={(e) => setStartLong(e.target.value)}
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
          <label htmlFor="startLat">Shared Start Point Latitude</label>
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
          <label htmlFor="firstEndLong">First Line End Point Longitude</label>
          <input
            type="number"
            id="firstEndLong"
            value={firstEndLong}
            onChange={(e) => setFirstEndLong(e.target.value)}
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
          <label htmlFor="firstEndLat">First Line End Point Latitude</label>
          <input
            type="number"
            id="firstEndLat"
            value={firstEndLat}
            onChange={(e) => setFirstEndLat(e.target.value)}
            {...latInputProps}
          />
        </div>
      </div>
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="secondEndLong">Second Line End Point Longitude</label>
          <input
            type="number"
            id="secondEndLong"
            value={secondEndLong}
            onChange={(e) => setSecondEndLong(e.target.value)}
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
          <label htmlFor="secondEndLat">Second Line End Point Latitude</label>
          <input
            type="number"
            id="secondEndLat"
            value={secondEndLat}
            onChange={(e) => setSecondEndLat(e.target.value)}
            {...latInputProps}
          />
        </div>
      </div>
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="angleUnit">Angle Display Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as IAngleUnits)}
            id="angleUnit"
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
        <button type="button" className="buttonSecondary" onClick={resetState}>
          Discard Changes
        </button>
      </div>
    </form>
  );
};

const getInitialComponentStateValues = (angleState: IAngleState) => {
  return {
    startLong:
      angleState.sharedPoint !== null
        ? angleState.sharedPoint[0].toString()
        : '',
    startLat:
      angleState.sharedPoint !== null
        ? angleState.sharedPoint[1].toString()
        : '',
    firstEndLong:
      angleState.firstEnd !== null ? angleState.firstEnd[0].toString() : '',
    firstEndLat:
      angleState.firstEnd !== null ? angleState.firstEnd[1].toString() : '',
    secondEndLong:
      angleState.secondEnd !== null ? angleState.secondEnd[0].toString() : '',
    secondEndLat:
      angleState.secondEnd !== null ? angleState.secondEnd[1].toString() : '',
    unit: angleState.angleUnit,
  };
};

export default AngleForm;

import { useEffect, useState, type Dispatch, type FormEvent } from 'react';
import type {
  IDispatchActions,
  ILengthUnits,
  IPolylineState,
  WGS84point,
} from '../types';
import { latInputProps, longInputProps } from '../utils';

type Props = {
  polylineState: IPolylineState;
  dispatch: Dispatch<IDispatchActions>;
};

const PolylineForm = ({ dispatch, polylineState }: Props) => {
  const [pointsState, setPointsState] = useState(polylineState.points);

  const [newPointLong, setNewPointLong] = useState('');
  const [newPointLat, setNewPointLat] = useState('');

  const resetState = () => {
    // remove local changes by defaulting to values from appState
    setPointsState(polylineState.points);
  };

  useEffect(() => {
    // reconcile input state with changes from map clicks
    resetState();
  }, [polylineState]);

  const changePointCoordinate = (
    index: number,
    newValue: string,
    type: 'long' | 'lat'
  ) => {
    const newState = [...pointsState];
    newState[index][type === 'long' ? 0 : 1] = Number(newValue);

    setPointsState(newState);
  };

  const removePoint = (index: number) => {
    setPointsState(
      pointsState.filter((value, pointIndex) => pointIndex !== index)
    );
  };

  const renderPointRow = (point: WGS84point, index: number) => {
    return (
      <div key={index}>
        <div>
          <label htmlFor={`points-${index}`}>Point Longitude</label>
          <input
            type="number"
            id={`points-${index}`}
            value={pointsState[index][0]}
            onChange={(e) =>
              changePointCoordinate(index, e.target.value, 'long')
            }
            {...longInputProps}
          />
        </div>
        <div>
          <label htmlFor="firstEndLat">Point Latitude</label>
          <input
            type="number"
            id={`points-${index}`}
            value={pointsState[index][1]}
            onChange={(e) =>
              changePointCoordinate(index, e.target.value, 'lat')
            }
            {...latInputProps}
          />
        </div>
        <div onClick={() => removePoint(index)}>Garbage Icon</div>
      </div>
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({
      type: 'polyline replace',
      payload: [...pointsState],
    });
  };

  const addNewPointToPoints = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPointsState = [...pointsState];

    newPointsState.push([Number(newPointLong), Number(newPointLat)]);

    setPointsState(newPointsState);

    setNewPointLong('');
    setNewPointLat('');
  };

  return (
    <>
      <form id="mainPolylineForm" onSubmit={handleSubmit}>
        <div>
          {pointsState.map((point, index) => {
            return renderPointRow(point, index);
          })}
        </div>
      </form>
      <form id="pointAdditionForm" onSubmit={addNewPointToPoints}>
        <div>
          <div>
            <label htmlFor={'newPointLong'}>New Point Longitude</label>
            <input
              type="number"
              id={`newPointLong`}
              value={newPointLong}
              onChange={(e) => setNewPointLong(e.target.value)}
              {...longInputProps}
            />
          </div>
          <div>
            <label htmlFor="newPointLat">New Point Latitude</label>
            <input
              type="number"
              id={`newPointLat`}
              value={newPointLat}
              onChange={(e) => setNewPointLat(e.target.value)}
              {...latInputProps}
            />
          </div>
          <button type="submit" form="pointAdditionForm">
            Plus Icon
          </button>
        </div>
      </form>
      <div>
        <button form="mainPolylineForm" type="submit">
          Confirm Changes
        </button>
        <button type="button" onClick={resetState}>
          Discard Changes
        </button>
      </div>
    </>
  );
};

export default PolylineForm;

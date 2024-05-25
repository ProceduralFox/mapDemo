import { useEffect, useState, type Dispatch, type FormEvent } from 'react';
import type { IDispatchActions, IPolylineState, WGS84point } from '../types';
import { latInputProps, longInputProps } from '../functions/utils';
import RemoveIcon from './icons/RemoveIcon';
import AddIcon from './icons/AddIcon';

type Props = {
  polylineState: IPolylineState;
  dispatch: Dispatch<IDispatchActions>;
};

const PolylineForm = ({ dispatch, polylineState }: Props) => {
  const [pointsState, setPointsState] = useState([...polylineState.points]);

  const [newPointLong, setNewPointLong] = useState('');
  const [newPointLat, setNewPointLat] = useState('');

  const resetState = () => {
    // remove local changes by defaulting to values from appState
    setPointsState([...polylineState.points]);
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
      <div key={index} className="inputRow">
        <div className="inputLabel">
          <label htmlFor={`points-${index}-long`}>Point Longitude</label>
          <input
            type="number"
            id={`points-${index}-long`}
            value={pointsState[index][0]}
            onChange={(e) =>
              changePointCoordinate(index, e.target.value, 'long')
            }
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
          <label htmlFor={`points-${index}-lat`}>Point Latitude</label>
          <input
            type="number"
            id={`points-${index}-lat`}
            value={pointsState[index][1]}
            onChange={(e) =>
              changePointCoordinate(index, e.target.value, 'lat')
            }
            {...latInputProps}
          />
        </div>
        <button
          aria-label="remove point"
          type="button"
          className="buttonIcon"
          onClick={() => removePoint(index)}
        >
          <RemoveIcon />
        </button>
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
      <div className="formWrapper">
        <form
          id="mainPolylineForm"
          className="polylineForm"
          onSubmit={handleSubmit}
        >
          {pointsState.map((point, index) => {
            return renderPointRow(point, index);
          })}
        </form>
        <form
          id="pointAdditionForm"
          className=""
          onSubmit={addNewPointToPoints}
        >
          <div className="inputRow">
            <div className="inputLabel">
              <label htmlFor={'newPointLong'}>New Point Longitude</label>
              <input
                type="number"
                id={`newPointLong`}
                value={newPointLong}
                onChange={(e) => setNewPointLong(e.target.value)}
                {...longInputProps}
              />
            </div>
            <div className="inputLabel">
              <label htmlFor="newPointLat">New Point Latitude</label>
              <input
                type="number"
                id={`newPointLat`}
                value={newPointLat}
                onChange={(e) => setNewPointLat(e.target.value)}
                {...latInputProps}
              />
            </div>
            <button
              type="submit"
              form="pointAdditionForm"
              aria-label="Add a new point."
              className="buttonIcon"
            >
              <AddIcon />
            </button>
          </div>
        </form>
        <div className="inputRow">
          <button
            form="mainPolylineForm"
            className="buttonPrimary"
            type="submit"
          >
            Confirm Changes
          </button>
          <button
            type="button"
            className="buttonSecondary"
            onClick={resetState}
          >
            Discard Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default PolylineForm;

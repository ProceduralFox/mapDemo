import { useState, type FormEvent } from 'react';

import { latInputProps, longInputProps } from '../functions/utils';
import type { IPolylineState, WGS84point } from '../types';
import AddIcon from './icons/AddIcon';
import RemoveIcon from './icons/RemoveIcon';

type Props = {
  polylineState: IPolylineState;
  submitCallback: (points: WGS84point[]) => void;
};

const PolylineForm = ({ submitCallback, polylineState }: Props) => {
  const points = [...polylineState.points];
  const [lastRenderPropValues, setLastRenderPropValues] = useState(points);

  const propsChanged = !propComparison(points, lastRenderPropValues);

  const [pointsState, setPointsState] = useState([...points]);

  if (propsChanged) {
    setPointsState([...points]);
    setLastRenderPropValues([...points]);
  }

  const [newPointLong, setNewPointLong] = useState('');
  const [newPointLat, setNewPointLat] = useState('');

  const handleFormReset = () => {
    // remove local changes by defaulting to values from appState
    setPointsState([...points]);
  };

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
    setPointsState(pointsState.filter((_, pointIndex) => pointIndex !== index));
  };

  const renderPointRow = (index: number) => {
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

    submitCallback(pointsState);
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
          {pointsState.map((_, index) => {
            return renderPointRow(index);
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
            onClick={handleFormReset}
          >
            Discard Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default PolylineForm;

const propComparison = (
  newState: WGS84point[],
  oldState: WGS84point[]
): boolean => {
  if (newState.length !== oldState.length) return false;

  for (let index = 0; index < newState.length; index++) {
    if (newState[index] !== oldState[index]) return false;
  }

  return true;
};

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { latInputProps, longInputProps } from '../functions/utils';
import type { IAngleState, IAngleUnits, WGS84point } from '../types';

type Props = {
  angleState: IAngleState;
  submitCallback: (
    startPoint: WGS84point,
    firstEndPoint: WGS84point,
    secondEndPoint: WGS84point,
    unit: IAngleUnits
  ) => void;
};

const AngleForm = ({ angleState, submitCallback }: Props) => {
  const parsedPropValues = getParsedPropValues(angleState);

  const [lastRenderPropValues, setLastRenderPropValues] = useState({
    ...parsedPropValues,
  });

  const { propsChanged, changedProps } = propComparison(
    parsedPropValues,
    lastRenderPropValues
  );
  const [formData, setFormData] = useState({ ...parsedPropValues });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePropChange = () => {
    const newState = {
      ...formData,
    };

    for (const prop of changedProps) {
      typeGuardedStateUpdate(prop, parsedPropValues, newState);
    }

    setFormData({ ...newState });
  };

  const handleFormDiscard = () => {
    setFormData({ ...parsedPropValues });
  };

  if (propsChanged) {
    setLastRenderPropValues(parsedPropValues);
    handlePropChange();
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitCallback(
      [Number(formData.startLong), Number(formData.startLat)],
      [Number(formData.firstEndLong), Number(formData.firstEndLat)],
      [Number(formData.secondEndLong), Number(formData.secondEndLat)],
      formData.unit
    );
  };

  return (
    <form onSubmit={handleSubmit} className="formWrapper">
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="startLong">Shared Start Point Longitude</label>
          <input
            type="number"
            id="startLong"
            name="startLong"
            value={formData.startLong}
            onChange={handleInputChange}
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
          <label htmlFor="startLat">Shared Start Point Latitude</label>
          <input
            type="number"
            id="startLat"
            name="startLat"
            value={formData.startLat}
            onChange={handleInputChange}
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
            name="firstEndLong"
            value={formData.firstEndLong}
            onChange={handleInputChange}
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
          <label htmlFor="firstEndLat">First Line End Point Latitude</label>
          <input
            type="number"
            id="firstEndLat"
            name="firstEndLat"
            value={formData.firstEndLat}
            onChange={handleInputChange}
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
            name="secondEndLong"
            value={formData.secondEndLong}
            onChange={handleInputChange}
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
          <label htmlFor="secondEndLat">Second Line End Point Latitude</label>
          <input
            type="number"
            id="secondEndLat"
            name="secondEndLat"
            value={formData.secondEndLat}
            onChange={handleInputChange}
            {...latInputProps}
          />
        </div>
      </div>
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="angleUnit">Angle Display Unit</label>
          <select
            name="angleUnit"
            value={formData.secondEndLat}
            onChange={handleInputChange}
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
        <button
          type="button"
          className="buttonSecondary"
          onClick={handleFormDiscard}
        >
          Discard Changes
        </button>
      </div>
    </form>
  );
};

export default AngleForm;

type IParsedPropValues = ReturnType<typeof getParsedPropValues>;

interface IPropComparisonReturn {
  propsChanged: boolean;
  changedProps: (keyof IParsedPropValues)[];
}

const getParsedPropValues = (angleState: IAngleState) => {
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

const propComparison = (
  newState: IParsedPropValues,
  oldState: IParsedPropValues
) => {
  const keyNames = Object.getOwnPropertyNames(newState);
  const result: IPropComparisonReturn = {
    propsChanged: false,
    changedProps: [],
  };

  for (const name of keyNames) {
    if (
      !Object.is(
        newState[name as keyof IParsedPropValues],
        oldState[name as keyof IParsedPropValues]
      )
    ) {
      result.propsChanged = true;
      result.changedProps.push(name as keyof IParsedPropValues);
    }
  }

  return result;
};

function typeGuardedStateUpdate<K extends keyof IParsedPropValues>(
  propName: K,
  props: IParsedPropValues,
  newState: IParsedPropValues
): void {
  newState[propName] = props[propName];
}

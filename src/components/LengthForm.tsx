import { useState, type ChangeEvent, type FormEvent } from 'react';
import { latInputProps, longInputProps } from '../functions/utils';
import type { IAngleUnits, ILengthUnits, WGS84point } from '../types';
import { ILengthState } from '../types';

type Props = {
  lengthState: ILengthState;
  submitCallback: (
    startPoint: WGS84point,
    endPoint: WGS84point,
    lenghtUnit: ILengthUnits,
    azimuthUnit: IAngleUnits
  ) => void;
};

const LengthForm = ({ submitCallback, lengthState }: Props) => {
  const parsedPropValues = getParsedPropValues(lengthState);

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
      [Number(formData.endLong), Number(formData.endLat)],
      formData.lengthUnit,
      formData.azimuthUnit
    );
  };

  return (
    <form onSubmit={handleSubmit} className="formWrapper">
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="startLong">Start point Longitude</label>
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
          <label htmlFor="startLat">Start point Latitude</label>
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
          <label htmlFor="endLong">End point Longitude</label>
          <input
            type="number"
            id="endLong"
            name="endLong"
            value={formData.endLong}
            onChange={handleInputChange}
            {...longInputProps}
          />
        </div>
        <div className="inputLabel">
          <label htmlFor="endLat">End point Latitude</label>
          <input
            type="number"
            id="endLat"
            name="endLat"
            value={formData.endLat}
            onChange={handleInputChange}
            {...latInputProps}
          />
        </div>
      </div>
      <div className="inputRow">
        <div className="inputLabel">
          <label htmlFor="lengthUnit">Length Display unit</label>
          <select
            name="lengthUnit"
            value={formData.lengthUnit}
            onChange={handleInputChange}
            id="lengthUnit"
          >
            <option value="kilometers">Kilometers</option>
            <option value="miles">Miles</option>
          </select>
        </div>
        <div className="inputLabel">
          <label htmlFor="azimuthUnit">Azimuth Display Unit</label>
          <select
            name="azimuthUnit"
            value={formData.azimuthUnit}
            onChange={handleInputChange}
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
        <button
          type="button"
          onClick={handleFormDiscard}
          className="buttonSecondary"
        >
          Discard Changes
        </button>
      </div>
    </form>
  );
};

export default LengthForm;

const getParsedPropValues = (lengthState: ILengthState) => {
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

type IParsedPropValues = ReturnType<typeof getParsedPropValues>;

interface IPropComparisonReturn {
  propsChanged: boolean;
  changedProps: (keyof IParsedPropValues)[];
}

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

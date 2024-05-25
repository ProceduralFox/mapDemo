import { toMiles, toRadians, toReadableDegrees } from '../functions/utils';
import { IAppState } from '../types';

type Props = {
  appState: IAppState;
};

const ComputedValuesDisplay = ({ appState }: Props) => {
  const renderComputerValues = () => {
    const { lengthState } = appState;

    if (appState.currentlySelectedTool === 'length') {
      const length =
        lengthState.lengthUnit === 'kilometers'
          ? `${(lengthState.lineLength / 1000).toFixed(2)} km`
          : `${toMiles(lengthState.lineLength).toFixed(2)} mi`;

      const azimuth =
        lengthState.lineAzimuth === null
          ? ''
          : lengthState.azimuthUnit === 'deg'
          ? `${toReadableDegrees(lengthState.lineAzimuth)} `
          : `${toRadians(lengthState.lineAzimuth).toFixed(2)} rad`;
      return (
        <>
          <div>Length: {length} </div>
          <div>Azimuth: {azimuth}</div>
        </>
      );
    }

    if (appState.currentlySelectedTool === 'angle') {
      const { angleState } = appState;
      const angle =
        angleState.angle === null
          ? ''
          : angleState.angleUnit === 'deg'
          ? `${toReadableDegrees(angleState.angle)} `
          : `${toRadians(angleState.angle).toFixed(2)} rad`;
      return <div>Angle: {angle}</div>;
    }
  };
  return <div className="computedValuesWrapper">{renderComputerValues()}</div>;
};

export default ComputedValuesDisplay;

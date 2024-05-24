import React, { useEffect, useState } from 'react';
import { IAppState, IDispatchActions } from '../types';
import type { Dispatch } from 'react';
import { toLonLat } from 'ol/proj';
type Props = {
  state: IAppState;
  dispatch: Dispatch<IDispatchActions>;
};

const TextInputsLength = ({ dispatch, state }: Props) => {
  const [startLong, setStartLong] = useState(
    state.lengthState.startPoint !== null ? state.lengthState.startPoint[0] : ''
  );

  const [startLat, setStartLat] = useState(
    state.lengthState.startPoint !== null ? state.lengthState.startPoint[1] : ''
  );

  const [endLong, setEndLong] = useState(
    state.lengthState.endPoint !== null ? state.lengthState.endPoint[0] : ''
  );
  const [endLat, setEndLat] = useState(
    state.lengthState.endPoint !== null ? state.lengthState.endPoint[1] : ''
  );

  const updateMap = () => {
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
  };

  useEffect(() => {
    if (
      startLong != state.lengthState.startPoint?.[0] ||
      startLat != state.lengthState.startPoint?.[1] ||
      endLong != state.lengthState.endPoint?.[0] ||
      endLat != state.lengthState.endPoint?.[1]
    ) {
      updateMap();
    }
  }, [startLong, startLat, endLat, endLong]);

  useEffect(() => {
    if (state.lengthState.startPoint) {
      setStartLong(state.lengthState.startPoint[0]);
      setStartLat(state.lengthState.startPoint[1]);
    }
    if (state.lengthState.endPoint) {
      setEndLong(state.lengthState.endPoint[0]);
      setEndLat(state.lengthState.endPoint[1]);
    }
  }, [state]);

  return (
    <div>
      <div>
        <label htmlFor="startlat">Start Lat</label>
        <input
          type="number"
          id="startLat"
          value={startLat}
          onChange={(e) => setStartLat(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="endlat">End lat</label>
        <input
          type="number"
          id="endLat"
          value={endLat}
          onChange={(e) => setEndLat(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="startlong">start long</label>
        <input
          type="number"
          id="startLong"
          value={startLong}
          onChange={(e) => setStartLong(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="endlong">end long</label>
        <input
          type="number"
          id="endLong"
          value={endLong}
          onChange={(e) => setEndLong(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TextInputsLength;

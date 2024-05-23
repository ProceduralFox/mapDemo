import React, { useEffect, useState } from 'react';
import { IAppState, IDispatchActions } from '../types';
import type { Dispatch } from 'react';
type Props = {
  state: IAppState;
  dispatch: Dispatch<IDispatchActions>;
};

const TextInputsLength = ({ dispatch, state }: Props) => {
  const [startLat, setStartLat] = useState('');
  const [startLong, setStartLong] = useState('');

  const [endLat, setEndLat] = useState('');
  const [endLong, setEndLong] = useState('');

  const updateMap = () => {
    if (startLat && startLong) {
      dispatch({
        type: 'length start point',
        payload: [Number(startLat), Number(startLong)],
      });
    }
    if (endLat && endLong) {
      dispatch({
        type: 'length end point',
        payload: [Number(endLat), Number(endLong)],
      });
    }
  };

  useEffect(() => {
    updateMap();
  }, [startLong, startLat, endLat, endLong]);

  return (
    <div>
      <div>
        <label htmlFor="startlat"></label>
        <input
          type="text"
          id="startLat"
          value={startLat}
          onChange={(e) => setStartLat(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="endlat"></label>
        <input
          type="text"
          id="endLat"
          value={endLat}
          onChange={(e) => setEndLat(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="startlong"></label>
        <input
          type="text"
          id="startLong"
          value={startLong}
          onChange={(e) => setStartLong(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="endlong"></label>
        <input
          type="text"
          id="endLong"
          value={endLong}
          onChange={(e) => setEndLong(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TextInputsLength;

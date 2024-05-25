// src/MapComponent.js
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import type { ChangeEvent } from 'react';
import { useEffect, useReducer, useRef, useState } from 'react';
import { redrawMap } from '../functions/redrawMap';
import reducer, { initializer } from '../functions/reducer';
import { IOnlineMapSource, ITool } from '../types';
import ComputedValuesDisplay from './ComputedValuesDisplay';
import PopupContent from './PopupContent';
import Tabs from './Tabs';

const MapComponent = () => {
  const [appState, dispatch] = useReducer(reducer, undefined, initializer);

  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // state to keep track of where on the map the user clicked so that
  // the popup content can use that information to update the main
  // application state in response to further tool selection
  const [selectedMapCoordinates, setSelectedMapCoordinates] = useState<
    number[]
  >([]);

  const handleSourceSelectOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.target.value;

    dispatch({
      type: 'source',
      payload: e.target.value as IOnlineMapSource,
    });
  };

  const handleToolSelectOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (['length', 'angle', 'polyline'].includes(e.target.value)) {
      dispatch({
        type: 'tool',
        payload: e.target.value as ITool,
      });
    }
  };

  useEffect(() => {
    const tileLayer = new TileLayer({
      source: new XYZ({
        url: appState.mapSource,
      }),
    });

    tileLayer.set('name', 'tile');

    const map = new Map({
      target: 'map-container',
      layers: [tileLayer],
      view: new View({
        center: fromLonLat([16.598303338886936, 49.21156532781483]),
        zoom: 4,
      }),
    });

    redrawMap(map, appState, popupRef, setSelectedMapCoordinates);

    setMapInstance(map);
    return () => map.setTarget(undefined);
  }, []);

  useEffect(() => {
    // reconcile the map renderer with react state
    if (mapInstance) {
      redrawMap(mapInstance, appState, popupRef, setSelectedMapCoordinates);
    }
  }, [appState]);

  return (
    <div className="mapWrapper">
      <div className="upperToolbar">
        <div>
          <label htmlFor="source">Selected Source</label>
          <select
            name=""
            id="source"
            onChange={handleSourceSelectOnChange}
            value={appState.mapSource}
          >
            <option value="https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png">
              Open Street Maps
            </option>
            <option value="https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png">
              Carto
            </option>
          </select>
        </div>
        <ComputedValuesDisplay appState={appState}></ComputedValuesDisplay>
        <div>
          <label htmlFor="source">Selected Tool</label>
          <select
            value={appState.currentlySelectedTool}
            name=""
            id="tool"
            onChange={handleToolSelectOnChange}
          >
            <option value="length">Length & Azimuth</option>
            <option value="angle">Angle between lines</option>
            <option value="polyline">Polyline</option>
          </select>
        </div>
      </div>
      <div
        id="map-container"
        style={{ width: '640px', height: '480px' }}
        className="map"
      ></div>
      <div ref={popupRef} id="popup">
        {mapInstance ? (
          <PopupContent
            map={mapInstance}
            state={appState}
            dispatch={dispatch}
            popupRef={popupRef}
            selectedMapCoordinates={selectedMapCoordinates}
          />
        ) : null}
      </div>
      <Tabs dispatch={dispatch} state={appState}></Tabs>
    </div>
  );
};

export default MapComponent;

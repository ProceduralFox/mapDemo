// src/MapComponent.js
import { useEffect, useReducer, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import reducer, { initializer } from '../reducer';
import { redrawMap } from '../functions/mapRendererReconciliators.functions';
import PopupContent from './PopupContent';
import TextInputsLength from './TextInputsLength';
import type { ChangeEvent } from 'react';
import { IOnlineMapSource, ITool } from '../types';

const MapComponent = () => {
  // TODO: maybe get initial arg from localstorage
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
    e.target.value;

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
      // TODO: naming maybe
      target: 'map-container',
      layers: [tileLayer],
      view: new View({
        center: fromLonLat([0, 0]), // Center the map at the coordinates [longitude, latitude]
        zoom: 2, // Initial zoom level
      }),
    });

    redrawMap(map, appState, popupRef, setSelectedMapCoordinates);

    setMapInstance(map);
    return () => map.setTarget(undefined);
  }, []);
  console.log('render in parent');

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
          <select name="" id="source" onChange={handleSourceSelectOnChange}>
            <option value="https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png">
              Open Street Maps
            </option>
            <option value="https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png">
              Carto
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="source">Selected Tool</label>
          <select name="" id="tool" onChange={handleToolSelectOnChange}>
            <option value="length">Length & Azimuth</option>
            <option value="angle">Angle between lines with shared point</option>
            <option value="polyline">
              Drawing a Polyline through segments
            </option>
          </select>
        </div>
      </div>
      <div id="map-container" style={{ width: '640px', height: '480px' }}></div>
      <div ref={popupRef} id="popup" className="popupWrapper">
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
      <div
        style={{
          width: '640px',
          height: '480px',
          border: '2px solid #646cffaa',
        }}
      >
        inputs and stuff
        {((appState.lengthState.lineLength as number) / 1000)
          .toFixed(2)
          .toString()}
        <div>
          <TextInputsLength
            dispatch={dispatch}
            state={appState}
          ></TextInputsLength>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;

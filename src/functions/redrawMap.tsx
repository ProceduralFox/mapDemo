import {
  IAngleState,
  IAppState,
  ILengthState,
  IOnlineMapSource,
  IPolylineState,
} from '../types';
import { Feature, Overlay, type Map } from 'ol';
import { LineString, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import { XYZ } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import type { Dispatch, MutableRefObject } from 'react';

export function redrawSource(newSourceLink: IOnlineMapSource, map: Map) {
  // since redrawing the tile layer source is more expensive and
  // visually jarring compared to redrawing the vector layers
  // this functions ensures that it only happens when the user
  // actually requests a change of tile source

  map.getAllLayers().forEach((layer) => {
    const name = layer.get('name');

    if (name === 'tile') {
      const source = layer.getSource() as XYZ;
      if (!(source instanceof XYZ)) return;

      const newSource = new XYZ({
        url: newSourceLink,
      });

      const oldSourceUrls = source.getUrls();
      const newSourceUrls = newSource.getUrls();

      // this should never happen, but better be safe
      if (oldSourceUrls === null || newSourceUrls === null) return;

      const { length } = oldSourceUrls;

      if (length !== newSourceUrls.length) {
        layer.setSource(newSource);
      }

      for (let index = 0; index < length; index++) {
        if (oldSourceUrls[index] !== newSourceUrls[index]) {
          layer.setSource(newSource);
        }
      }
    }
  });
}

export function redrawMap(
  map: Map,
  state: IAppState,
  popup: MutableRefObject<HTMLDivElement | null>,
  setSelectedMapCoordinates: Dispatch<React.SetStateAction<number[]>>
) {
  // clean map
  removeInteractions(map);
  removeNonTileLayers(map);

  redrawSource(state.mapSource, map);

  // redraw features from state
  switch (state.currentlySelectedTool) {
    case 'length':
      drawLengthFeatures(map, state.lengthState);
      break;
    case 'angle':
      drawAngleFeatures(map, state.angleState);
      break;
    case 'polyline':
      drawPolylineFeatures(map, state.polylineState);
      break;
  }

  addPopupInteraction(map, popup, setSelectedMapCoordinates);
}

function removeInteractions(map: Map) {
  map.getInteractions().forEach((interaction) => {
    if (interaction.get('customListener') === true) {
      map.removeInteraction(interaction);
    }
  });
}

function removeNonTileLayers(map: Map) {
  map.getLayers().forEach((layer) => {
    if (layer.get('name') !== 'tile') {
      map.removeLayer(layer);
    }
  });

  map.getOverlays().forEach((overlay) => {
    map.removeOverlay(overlay);
  });
}

function drawLengthFeatures(map: Map, lengthState: ILengthState) {
  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });
  map.addLayer(vectorLayer);

  const startCoordinates = lengthState.startPoint
    ? fromLonLat(lengthState.startPoint)
    : null;
  const endCoordinates = lengthState.endPoint
    ? fromLonLat(lengthState.endPoint)
    : null;

  if (startCoordinates) {
    const startPointFeature = new Feature({
      geometry: new Point(startCoordinates),
    });
    vectorSource.addFeature(startPointFeature);
  }

  if (endCoordinates) {
    const endPointFeature = new Feature({
      geometry: new Point(endCoordinates),
    });
    vectorSource.addFeature(endPointFeature);
  }

  if (startCoordinates && endCoordinates) {
    const line = new Feature({
      geometry: new LineString([startCoordinates, endCoordinates]),
    });
    vectorSource.addFeature(line);
  }
}

function drawAngleFeatures(map: Map, angleState: IAngleState) {
  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });
  map.addLayer(vectorLayer);

  const sharedPointCoordinates = angleState.sharedPoint
    ? fromLonLat(angleState.sharedPoint)
    : null;
  const firstLineEndCoordinates = angleState.firstEnd
    ? fromLonLat(angleState.firstEnd)
    : null;
  const secondLineEndCoordinates = angleState.secondEnd
    ? fromLonLat(angleState.secondEnd)
    : null;

  if (sharedPointCoordinates) {
    const sharedStartFeature = new Feature({
      geometry: new Point(sharedPointCoordinates),
    });
    vectorSource.addFeature(sharedStartFeature);
  }

  if (firstLineEndCoordinates) {
    const irstLineEndFeature = new Feature({
      geometry: new Point(firstLineEndCoordinates),
    });
    vectorSource.addFeature(irstLineEndFeature);
  }

  if (secondLineEndCoordinates) {
    const econdLineEndFeature = new Feature({
      geometry: new Point(secondLineEndCoordinates),
    });
    vectorSource.addFeature(econdLineEndFeature);
  }

  if (sharedPointCoordinates && firstLineEndCoordinates) {
    const firstLine = new Feature({
      geometry: new LineString([
        sharedPointCoordinates,
        firstLineEndCoordinates,
      ]),
    });

    vectorSource.addFeature(firstLine);
  }

  if (sharedPointCoordinates && secondLineEndCoordinates) {
    const secondLine = new Feature({
      geometry: new LineString([
        sharedPointCoordinates,
        secondLineEndCoordinates,
      ]),
    });

    vectorSource.addFeature(secondLine);
  }
}

function drawPolylineFeatures(map: Map, polylineState: IPolylineState) {
  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });
  map.addLayer(vectorLayer);

  let previousPointCoordinates: number[] | null = null;

  for (const point of polylineState.points) {
    const pointCoordinates = fromLonLat(point);

    const pointFeature = new Feature({
      geometry: new Point(pointCoordinates),
    });
    vectorSource.addFeature(pointFeature);

    if (previousPointCoordinates !== null) {
      const lineSegmentFeature = new Feature({
        geometry: new LineString([previousPointCoordinates, pointCoordinates]),
      });

      vectorSource.addFeature(lineSegmentFeature);
    }

    previousPointCoordinates = pointCoordinates;
  }
}

function addPopupInteraction(
  map: Map,
  popup: MutableRefObject<HTMLDivElement | null>,
  setSelectedMapCoordinates: Dispatch<React.SetStateAction<number[]>>
) {
  const popupDiv = popup.current;

  if (popupDiv !== null) {
    const overlay = new Overlay({
      element: popupDiv,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    map.addOverlay(overlay);
    map.on('singleclick', function (evt) {
      const coordinate = evt.coordinate;

      popupDiv.setAttribute('test', JSON.stringify(coordinate));
      setSelectedMapCoordinates(coordinate);
      overlay.setPosition(coordinate);
    });
  }
}

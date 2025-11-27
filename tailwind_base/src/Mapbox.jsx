import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import createPulsatingMarker from "./PulsatingMarker";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Mapbox({ onReachedDestination, chatOpen }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const movingMarker = useRef(null);

  useEffect(() => {
    if (map.current) return;

    const userCoords = [-73.9855, 40.7580]; // Times Square

    const demoRoute = [
      [-73.9900, 40.7620],
      [-73.9885, 40.7608],
      [-73.9875, 40.7597],
      [-73.9865, 40.7585],
    ];

    // --- Haversine distance in meters ---
    function distanceMeters([lng1, lat1], [lng2, lat2]) {
      const R = 6371000;
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c;
    }

    const initMap = (coords) => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mykeys1/cmifowyxd00nu01qq5p0r49tk",
        center: coords,
        zoom: 16,
        pitch: 30,
        bearing: -17.6,
        antialias: true,
      });

      map.current.on("load", () => {
        // User marker (yellow)
        const markerEl = createPulsatingMarker({
          color: {
            dot: "linear-gradient(145deg, #FFD700, #FFC300)",
            pulse: "rgba(255, 215, 0, 0.3)",
          },
        });
        userMarker.current = new mapboxgl.Marker(markerEl)
          .setLngLat(userCoords)
          .addTo(map.current);

        // Moving marker (pink)
        const movingEl = createPulsatingMarker({
          color: {
            dot: "linear-gradient(145deg, #FF5B94, #FF2D68)",
            pulse: "rgba(255, 91, 148, 0.3)",
          },
        });
        movingMarker.current = new mapboxgl.Marker(movingEl)
          .setLngLat(demoRoute[0])
          .addTo(map.current);

        // Animation variables
        let currentIndex = 0;
        let progress = 0;
        const speed = 0.004;
        let paused = false; // pause during chat

        const animate = () => {
          if (!movingMarker.current) return;

          const [lng1, lat1] = demoRoute[currentIndex];
          const [lng2, lat2] =
            demoRoute[currentIndex + 1] || demoRoute[currentIndex];

          const newLng = lng1 + (lng2 - lng1) * progress;
          const newLat = lat1 + (lat2 - lat1) * progress;

          const distToUser = distanceMeters([newLng, newLat], userCoords);

          if (!paused) {
            // Phase 1: move toward ~300m
            if (distToUser <= 300 && !chatOpen) {
              movingMarker.current.setLngLat([newLng, newLat]);
              if (onReachedDestination) onReachedDestination();
              paused = true; // wait for chat
              requestAnimationFrame(animate);
              return;
            }
          } else {
            // Phase 2: resume after chat closes
            if (chatOpen) {
              requestAnimationFrame(animate); // wait until chat closes
              return;
            }
            // move toward final destination
            const [finalLng, finalLat] = demoRoute[demoRoute.length - 1];
            const distToFinal = distanceMeters([newLng, newLat], [finalLng, finalLat]);

            if (distToFinal < 5) {
              movingMarker.current.setLngLat([finalLng, finalLat]);
              return; // stop
            }

            // step toward final
            const stepLng = newLng + (finalLng - newLng) * speed;
            const stepLat = newLat + (finalLat - newLat) * speed;
            movingMarker.current.setLngLat([stepLng, stepLat]);
            requestAnimationFrame(animate);
            return;
          }

          movingMarker.current.setLngLat([newLng, newLat]);
          progress += speed;
          if (progress >= 1 && currentIndex < demoRoute.length - 2) {
            progress = 0;
            currentIndex++;
          }

          requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        map.current.flyTo({ center: coords, zoom: 16 });
      });
    };

    initMap(userCoords);
  }, [onReachedDestination, chatOpen]);

  return <div ref={mapContainer} className="w-screen h-screen" />;
}

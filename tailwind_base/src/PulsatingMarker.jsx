// createPulsatingMarker.js
export default function createPulsatingMarker({ color }) {
  const wrapper = document.createElement("div");
  wrapper.className = "relative w-6 h-6 flex items-center justify-center";

  const pulse = document.createElement("div");
  pulse.className = "pulse-marker";
  pulse.style.background = color.pulse; // semi-transparent gradient for pulse

  const dot = document.createElement("div");
  dot.className = "dot-marker";
  dot.style.background = color.dot; // solid gradient or solid color for dot

  wrapper.appendChild(pulse);
  wrapper.appendChild(dot);

  return wrapper;
}

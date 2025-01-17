import { useEffect } from "react";
import One from "./component/one";

function App() {
  useEffect(() => {
    // Elliptical parameters
    const a = 2; // Semi-major axis
    const b = 1; // Semi-minor axis
    let angle = 0; // Starting angle
    const speed = 0.05; // Angle increment per update

    let s1x;
    let s1y;

    let s2x;
    let s2y;

    

    // Update positions using setInterval
    setInterval(() => {
      angle += speed; // Increment angle

      // Update Sphere 1 position (clockwise)
      s1x = a * Math.cos(angle);
      s1y = b * Math.sin(angle);

      // Update Sphere 2 position (counter-clockwise)
      s2x = a * Math.cos(-angle);
      s2y = b * Math.sin(-angle);

      window.dispatchEvent(
        new CustomEvent("pose", {
            detail: {
                x: s1x,
                y: s1y,
                z: s2x,
                w: s2y,
            }
        })
      );
    }, 10); // 16ms for ~60 updates per second
  }, []);
  return (
    <div className="h-full bg-gray-100">
      <One />
    </div>
  );
}

export default App;

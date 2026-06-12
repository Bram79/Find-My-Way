import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

export function useHeading(enabled) {
  const [heading, setHeading] = useState(0);
  const lastHeading = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let subscription;
    Location.watchHeadingAsync((data) => {
      const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
      let diff = Math.abs(h - lastHeading.current);
      if (diff > 180) diff = 360 - diff;
      if (diff < 2) return;
      lastHeading.current = h;
      setHeading(h);
    }).then((sub) => {
      subscription = sub;
    });

    return () => subscription?.remove();
  }, [enabled]);

  return heading;
}

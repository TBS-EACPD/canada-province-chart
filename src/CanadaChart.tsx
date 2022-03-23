import React, { useLayoutEffect, useRef } from "react";

import { ProvCode } from "./CanadaText";
import { CanadaViz, CanadaVizDatum, GraphConfig } from "./CanadaViz";

export interface CanadaGraphProps<RawDatum extends CanadaVizDatum> {
  onSelectProvince: (s: ProvCode) => void;
  htmlForLabel: GraphConfig<RawDatum>["htmlForLabel"];
  data: GraphConfig<RawDatum>["data"];
  colorScale: GraphConfig<RawDatum>["colorScale"];
  lang: GraphConfig<RawDatum>["lang"];
  inactiveColor: GraphConfig<RawDatum>["inactiveColor"];
}

export function CanadaChart<RawDatum extends CanadaVizDatum>({
  data,
  onSelectProvince,
  htmlForLabel,
  colorScale,
  lang,
  inactiveColor,
}: CanadaGraphProps<RawDatum>) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!(element && data)) {
      return;
    }

    //TODO: fix hacky closure that holds onto province
    let active_prov = false;
    function onMouseEnter(prov) {
      active_prov = true;
      onSelectProvince(prov);
    }
    function onMouseLeave() {
      setTimeout(() => {
        if (!active_prov) {
          onSelectProvince(null);
        }
      }, 200);
      active_prov = false;
    }

    CanadaViz(element, {
      inactiveColor,
      data,
      colorScale,
      htmlForLabel,
      onMouseEnter,
      onMouseLeave,
      lang,
    });

    return () => {
      element && (element.innerHTML = "");
    };
  }, [data, onSelectProvince, colorScale, htmlForLabel]);

  return <div ref={containerRef} />;
}

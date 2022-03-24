import React, { useLayoutEffect, useRef } from "react";

import { ProvCode } from "./CanadaText";
import { CanadaD3Viz, CanadaD3VizDatum, GraphConfig } from "./CanadaD3Viz";

export interface CanadaGraphProps<RawDatum extends CanadaD3VizDatum> {
  onClick: GraphConfig<RawDatum>["onClick"]
  onMouseEnter: GraphConfig<RawDatum>["onMouseEnter"]
  onMouseLeave: GraphConfig<RawDatum>["onMouseLeave"]
  htmlForLabel: GraphConfig<RawDatum>["htmlForLabel"];
  data: GraphConfig<RawDatum>["data"];
  colorScale: GraphConfig<RawDatum>["colorScale"];
  lang: GraphConfig<RawDatum>["lang"];
}

export function CanadaProvinceChart<RawDatum extends CanadaD3VizDatum>({
  data,
  onClick,
  onMouseEnter,
  onMouseLeave,
  htmlForLabel,
  colorScale,
  lang,
}: CanadaGraphProps<RawDatum>) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    CanadaD3Viz(element, {
      data,
      colorScale,
      htmlForLabel,
      onMouseEnter,
      onMouseLeave,
      onClick,
      lang,
    });

    return () => {
      element && (element.innerHTML = "");
    };
  }, [data, onClick, onMouseEnter, onMouseLeave, colorScale, htmlForLabel]);

  return <div ref={containerRef} />;
}

// base map obtained from [here](http://commons.wikimedia.org/wiki/File:Canada_blank_map.svg)

import { color } from "d3-color";
import { select } from "d3-selection";

import { ProvCode } from "./CanadaText";
import "d3-selection-multi";

//eslint-disable-next-line
// import canadaSvg from "!raw-loader!./ProvinceBoundaries.svg";
import canadaSvg from "./ProvinceBoundaries";

const BORDER_COLOR_DARK_FACTOR = 0.4;
const darkenColor = (colorStr: string, factor: number) =>
  color(colorStr).darker(factor).toString();

const LABEL_BORDER_COLOR = "#bbc1c9";

const ordering = Object.fromEntries(
  [
    "abroad",
    "na",
    "yt",
    "nt",
    "nu",
    "bc",
    "ab",
    "sk",
    "mb",
    "on",
    "onlessncr",
    "qc",
    "qclessncr",
    "nl",
    "ncr",
    "nb",
    "ns",
    "pe",
  ].map((provCode, index) => [provCode, index])
);

const getProvinceElementId = provCode => `#ca-${provCode}`;

export interface CanadaD3VizDatum {
  provCode: ProvCode;
  value: number;
}

export type CanadaD3VizData<RawDatum extends CanadaD3VizDatum> = Array<RawDatum>;

export interface GraphConfig<RawDatum extends CanadaD3VizDatum> {
  colorScale: (d: RawDatum|undefined, provCode: ProvCode) => string;
  htmlForLabel: (datum: RawDatum|undefined, provCode: ProvCode) => string|null;
  data: CanadaD3VizData<RawDatum>;
  onMouseLeave?: () => void;
  onMouseEnter?: (datum: RawDatum| undefined, provCode: ProvCode) => void;
  onClick?: (datum: RawDatum|undefined, provCode: ProvCode) => void;
  lang: "en" | "fr"; //not for labels, but there are lang-specific portions in the SVG
}

const xScaleFactor = 1396;
const yScaleFactor = 1346;
const maxHeight = 700;

export function CanadaD3Viz<RawDatum extends CanadaD3VizDatum>(
  containerEl: HTMLElement,
  options: GraphConfig<RawDatum>
) {
  const d3Container = select(containerEl);
  options = { ...options };

  d3Container.classed("position-relative", true);
  d3Container.append("div").classed("__svg__", true);
  d3Container.select(".__svg__").html(canadaSvg);

  const svgSelection = d3Container.select("svg");
  const outsideWidth = d3Container.node().offsetWidth;

  const xScale = outsideWidth / xScaleFactor;
  const yScale = maxHeight / yScaleFactor;
  const scale = Math.min(xScale, yScale);
  const height = scale * yScaleFactor;
  const padding = (outsideWidth - scale * xScaleFactor) / 2;

  const svg = svgSelection;
  const { data, colorScale, htmlForLabel, lang, onClick, onMouseEnter, onMouseLeave } = options;

  const dataByProvCode = Object.fromEntries(
    options.data.map(d => [d.provCode, d])
  );

  const dataHasNcrBrokenOut = data.some(({ provCode }) =>
    /^ncr$|^.*lessncr$/.test(provCode)
  );

  if (dataHasNcrBrokenOut) {
    ["on", "qc"].forEach(provCode =>
      svg
        .select(getProvinceElementId(provCode))
        .attr("id", getProvinceElementId(`${provCode}lessncr`).replace("#", ""))
    );
  }

  // Set dimensions and scaling of svg
  svg.attrs({
    height: height + "px",
    width: outsideWidth + "px",
  });
  svg
    .select(".container")
    .attr("transform", `translate(${padding},0), scale(${scale})`);

  // Unhide map components specific to current language
  svg.selectAll(`.${lang}-only`).styles({
    opacity: "1",
  });

  // Graph event dispatchers
  let previousEventTargetProvCode = false;
  const dispatch_mouseLeave = function () {
    if (previousEventTargetProvCode) {
      svg
        .select(getProvinceElementId(previousEventTargetProvCode))
        .styles(provCode => ({
          "stroke-width": "2px",
          stroke: darkenColor(
            colorScale(dataByProvCode[provCode], provCode),
            BORDER_COLOR_DARK_FACTOR
          ),
        }));
    }
    previousEventTargetProvCode = false;
    onMouseLeave?.();
  };
  const dispatch_mouseEnter = function (provCode: ProvCode) {
    if (previousEventTargetProvCode) {
      svg.select(getProvinceElementId(previousEventTargetProvCode)).styles({
        "stroke-width": "2px",
        stroke: darkenColor(
          colorScale(dataByProvCode[provCode], provCode),
          BORDER_COLOR_DARK_FACTOR
        ),
      });
    }
    if (dataByProvCode[provCode]?.value !== undefined) {
      previousEventTargetProvCode = provCode;
      svg.select(getProvinceElementId(provCode)).styles({
        "stroke-width":
          provCode === "abroad" || provCode === "na" ? "8px" : "15px",
        stroke: darkenColor(colorScale(dataByProvCode[provCode], provCode), 0.5),
      });

      onMouseEnter?.(dataByProvCode[provCode],provCode);
    }
  };

  // Set province colours, attach event dispatchers
  const provinceIsActive = (provCode: ProvCode) =>
    dataByProvCode[provCode]?.value !== undefined;
  const getColor = (provCode: ProvCode) => colorScale(dataByProvCode[provCode], provCode)

  svg
    .selectAll(".province")
    .each(function (d) {
      const that = select(this);
      const provCode = that.attr("id").split("-")[1];
      select(this).datum(provCode);
    })
    .styles({
      fill: getColor,
      "fill-opacity": 0.8,
      "stroke-width": "2px",
      stroke: d => darkenColor(getColor(d), BORDER_COLOR_DARK_FACTOR),
      "stroke-opacity": 1,
    })
    .on("mouseenter", dispatch_mouseEnter)
    .on("focus", dispatch_mouseEnter)
    .on("mouseleave", dispatch_mouseLeave)
    .on("blur", dispatch_mouseLeave)
    .on("click", (provCode: ProvCode) => {
      onClick?.(dataByProvCode[provCode],provCode);
    });

  // Add labels to provinces with data, attach event dispatchers
  const provincesToLabel = Object.keys(ordering)
  const provincesWithData = data.map(({ provCode }) => provCode);
  const excludedCodes = dataHasNcrBrokenOut
    ? ["on", "qc"]
    : ["onlessncr", "qclessncr", "ncr"];
  if (provincesWithData.some(code => excludedCodes.includes(code))) {
    if (dataHasNcrBrokenOut) {
      throw "If data does not offer capital region data, it must only use 'on' and 'qc' codes. Otherwise, it can use 'ncr', 'onlessncr' and 'qclessncr' codes.";
    }
  }

  d3Container
    .selectAll("div.label")
    .data(provincesToLabel)
    .enter()
    .append("div")
    .order()
    .attr("class", "label")
    .on("mouseenter", dispatch_mouseEnter)
    .on("mouseleave", dispatch_mouseLeave)
    .each(function(provCode: ProvCode, i:number) {
      const label = svg.selectAll("g.label").filter(function () {
        return select(this).attr("id") === `ca-${provCode}--label`;
      });

      const coords = label
        .attr("transform")
        .replace(/(translate\(|\)|)/g, "")
        .replace(",", " ")
        .split(" ");

      const potentiallyDontNeedLabels = optionalProvinces.concat(excludedCodes);
      if(potentiallyDontNeedLabels.includes(provCode) && !provincesWithData.includes(provCode)){
        return;
      }

      const markup = htmlForLabel(dataByProvCode[provCode], provCode);
      if(markup){
        select(this)
          .styles({
            left: `${padding + scale * coords[0]}px`,
            top: `${scale * coords[1]}px`,
            padding: "5px",
            position: "absolute",
            "border-radius": "5px",
            "text-align": "center",
            "font-size": `${scale * 22}px`,
            "background-color": LABEL_BORDER_COLOR,
          })
          .html(markup)
          .attr("tabindex", 0)
          .on("focus", dispatch_mouseEnter)
          .on("blur", dispatch_mouseLeave);
      }
    });

  // Hide optional map components based on data availability
  const hideMapComponents = selector =>
    svg.selectAll(selector).styles({
      visibility: "hidden",
    });
  const hideOptionalComponents = (provCodes, selectorTemplate) =>
    provCodes.forEach(provCode => {
      const correspondingProvinceHasData = dataByProvCode[provCode]?.value;
      if (!correspondingProvinceHasData) {
        hideMapComponents(selectorTemplate(provCode));
      }
    });

  hideOptionalComponents(
    optionalProvinces,
    provCode => `.province${getProvinceElementId(provCode)}`
  );

  hideOptionalComponents(
    provincesWithOptionalMarkers,
    provCode => `path${getProvinceElementId(provCode)}--marker`
  );
}

const provincesWithOptionalMarkers = ["pe", "ns", "nb", "ncr"];
const optionalProvinces = ["abroad", "na", "ncr"];
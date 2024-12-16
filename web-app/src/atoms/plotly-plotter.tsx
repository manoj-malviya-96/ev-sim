import Plot from "react-plotly.js";
import React from "react";

function createLayout(
    title: string,
    xTitle: string,
    yTitle: string,
    minimalView = true,
    textColor = "#ffffff"
): Partial<Plotly.Layout> {
    const textSize = 16;
    
    return {
        title: {
            text: title,
            font: {
                size: 20,
                color: textColor,
            },
        },
        xaxis: {
            title: {
                text: xTitle,
                font: {
                    size: textSize + 4,
                    color: textColor,
                },
            },
            tickfont: {
                size: textSize,
                color: textColor,
            },
            showgrid: false,
            zeroline: false,
            showline: false,
            scaleratio: 1,
            showticklabels: !minimalView,
        },
        yaxis: {
            title: {
                text: yTitle,
                font: {
                    size: textSize + 4,
                    color: textColor,
                },
            },
            tickfont: {
                size: textSize,
                color: textColor,
            },
            scaleratio: 1,
            showgrid: false,
            zeroline: false,
            showline: false,
            showticklabels: !minimalView,
        },
        margin: minimalView ? {t: 0, l: 0, r: 0, b: 0} : {t: 50, l: 50, r: 50, b: 50},
        paper_bgcolor: "rgba(0, 0, 0, 0)", // Transparent background
        plot_bgcolor: "rgba(0, 0, 0, 0)",
        hovermode: "closest",
    };
}

interface PlotterProps {
    dataTrace: Plotly.Data[];
    title?: string;
    xTitle?: string;
    yTitle?: string;
    textColor?: string;
    className?: string;
    minimalView?: boolean; // Flag to toggle minimal view
}

const PlotlyPlotter: React.FC<PlotterProps> = ({
                                                   dataTrace,
                                                   title = "",
                                                   xTitle = "",
                                                   yTitle = "",
                                                   textColor = "#000000",
                                                   className = "",
                                                   minimalView = true,
                                                   
                                               }) => {
    return (
        <div
            className={`${className}`}
        >
            <Plot
                data={dataTrace}
                layout={createLayout(title, xTitle, yTitle, minimalView, textColor)}
                config={{
                    displaylogo: false, // Removes the ugly Plotly logo
                    displayModeBar: false, // Disables the ugly bar on the top right
                }}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
};

export default PlotlyPlotter;

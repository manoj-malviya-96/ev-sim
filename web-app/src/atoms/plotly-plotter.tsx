import Plot from "react-plotly.js";
import React from "react";

function createLayout(
    title: string,
    xTitle: string,
    yTitle: string,
    minimalView = true,
    textColor = "#ffffff"
): Partial<Plotly.Layout> {
    const margin = !minimalView ? 100 : 0;
    const backgroundColor = `rgba(0, 0, 0, 0)`;
    
    return {
        title: {
            text: title,
            font: {
                size: title !== "" ? 20 : 0,
                color: textColor,
            },
        },
        xaxis: {
            title: {
                text: xTitle,
                font: {
                    size: 16,
                    color: textColor,
                },
            },
            tickfont: {
                size: 10,
                color: textColor,
            },
            showgrid: false,
            zeroline: false,
            showline: false,
            showticklabels: !minimalView,
            scaleratio: 1,
        },
        yaxis: {
            title: {
                text: yTitle,
                font: {
                    size: 16,
                    color: textColor,
                },
            },
            tickfont: {
                size: 10,
                color: textColor,
            },
            showgrid: false,
            zeroline: false,
            showline: false,
            showticklabels: !minimalView,
            scaleanchor: "x",
            scaleratio: 1,
        },
        showlegend: false,
        margin: {t: margin, l: margin, r: margin, b: margin},
        autosize: true,
        paper_bgcolor: backgroundColor,
        plot_bgcolor: backgroundColor,
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
                                                   textColor = "#ffffff",
                                                   className = "",
                                                   minimalView = true,
                                               }) => {
    return (
        <div
            className={`relative w-full h-full max-h-screen max-w-full rounded-md p-2 ${className}`}
        >
            <Plot
                data={dataTrace}
                layout={createLayout(title, xTitle, yTitle, minimalView, textColor)}
                config={{
                    displaylogo: false, // Removes the ugly Plotly logo
                    responsive: true, // Ensures responsiveness
                }}
            />
        </div>
    );
};

export default PlotlyPlotter;

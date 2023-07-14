import React from "react";
import ReactDOM from "react-dom/client";
import "@src/index.css";
import ScheduleBuilder from "@src/components/ScheduleBuilder";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <ScheduleBuilder/>
    </React.StrictMode>
);

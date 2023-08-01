import React from "react";
import ReactDOM from "react-dom/client";
import "@src/index.css";
import ScheduleBuilder from "@src/components/ScheduleBuilder";
import {QueryClient, QueryClientProvider} from "react-query";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ScheduleBuilder/>
        </QueryClientProvider>
    </React.StrictMode>
);

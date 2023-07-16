import React from "react";
import {API_Filters} from "@src/scripts/apiTypes";

export class CampusMap {
    static getLocationURL(locationID: string): string {
        const baseURL: string = 'https://campusmap.ufl.edu/#/index/';
        return (baseURL + locationID);
    }

    // TODO: add alternate inner (if location is false-ish)
    static createLink(locationID: string, inner: React.JSX.Element, _target: string = '_blank'): React.JSX.Element {
        if (locationID) // Exists and is non-empty
            return (<a href={CampusMap.getLocationURL(locationID)} target={_target}>{inner}</a>);
        return (<a>{inner}</a>); // Don't add a link
    }
}

enum UF_SOC_API_URL {
    FILTERS = "https://one.uf.edu/apix/soc/filters"
}

export class UF_SOC_API {
    readonly filters: API_Filters;

    private constructor(filters: API_Filters) {
        this.filters = filters;
    }

    static async initialize(): Promise<UF_SOC_API> {
        return new UF_SOC_API(
            await UF_SOC_API.fetchFilters()
        );
    }

    private static async fetchFilters(): Promise<API_Filters> {
        return await fetch(UF_SOC_API_URL.FILTERS)
            .then(r => r.json());
    }
}

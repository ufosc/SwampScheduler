import React from "react";
import {API_Filters} from "@src/scripts/apiTypes";

export class CampusMap {
    static getLocationURL(locationID: string): string {
        const baseURL: string = 'https://campusmap.ufl.edu/#/index/';
        return (baseURL + locationID);
    }

    static createLink(locationID: string | null, locationStr: string, inner: React.JSX.Element, _target: string = '_blank'): React.JSX.Element {
        if (locationID) // Exists and is non-empty
            return <a href={CampusMap.getLocationURL(locationID)} target={_target}>
                <abbr title={locationStr}>
                    {inner}
                </abbr>
            </a>;
        return (<a>{inner}</a>); // Don't add a link, and don't add <abbr>
    }
}

enum UF_SOC_API_URL {
    FILTERS = "https://one.uf.edu/apix/soc/filters"
}

export class UF_SOC_API {
    static async fetchFilters(): Promise<API_Filters> {
        return await fetch(UF_SOC_API_URL.FILTERS)
            .then(r => r.json());
    }
}

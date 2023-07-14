import React from "react";

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

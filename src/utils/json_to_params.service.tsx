export function jsonToUrlParams(json: any) {
    const params = new URLSearchParams();
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            params.append(key, json[key]);
        }
    }
    return params.toString();
}
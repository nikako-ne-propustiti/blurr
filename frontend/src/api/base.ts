const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

interface ApiCallArgs {
    json?: any,
    method?: string,
    query?: object
}

export const apiCall = async (path: string, options: ApiCallArgs) => {
    const {json, method, query} = options;
    const requestOptions: RequestInit = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method
    };
    const queryParams = {...query, t: Date.now()};
    if (json) {
        requestOptions.body = JSON.stringify(json);
    }
    const searchParams = new URLSearchParams(Object.entries(queryParams).map(([k, v]) => [k, v.toString()]));
    try {
        const response = await fetch(`${BACKEND_API_URL}/api/${path}?` + searchParams, requestOptions);
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Unknown API error:', error);
        return {
            error: 'Unknown API error.',
            success: false
        };
    }
};

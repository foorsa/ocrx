const getApiServerUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_DEVELOPMENT_SERVER_API_URL || 'http://localhost:8000';
    } else {
        return process.env.NEXT_PUBLIC_PRODUCTION_SERVER_API_URL || 'https://ocrx-api.foorsa.co';
    }
};

export { getApiServerUrl };
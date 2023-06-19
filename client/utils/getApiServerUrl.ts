const getApiServerUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return process.env.DEVELOPMENT_SERVER_API_URL || 'http://localhost:5000';
    } else {
        return process.env.PRODUCTION_SERVER_API_URL || 'ocrx-api.foorsa.co';
    }
};

export { getApiServerUrl };
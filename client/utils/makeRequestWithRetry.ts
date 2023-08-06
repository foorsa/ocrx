import Axios from "axios";




// Helper function to make the Axios request with retry
async function makeRequestWithRetry(
    url: string,
    maxRetries = 3,
    currentRetry = 0
) {
    try {
        const response = await Axios.post(url, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    } catch (error: any) {
        if (
            currentRetry < maxRetries &&
            (Axios.isAxiosError(error) || error.code === "ECONNABORTED")
        ) {
            // Retry the request by recursively calling the function after a short delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return makeRequestWithRetry(
                url,
                maxRetries,
                currentRetry + 1
            );
        } else {
            throw error; // Reject the promise for non-retryable errors
        }
    }
}

export { makeRequestWithRetry};
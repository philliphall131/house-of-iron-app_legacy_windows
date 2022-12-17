const apiHelpers = {};

apiHelpers.tryCatchFetch = async (axiosCall) => {
    try {
        const response = await axiosCall()
        return response
    }
    catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('error response detail:', error.response.data);
           return { error: error.response.status }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log('request error', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Request setup error', error.message);
        }
        return null
    }
}

apiHelpers.options = (token=null) => {
    if (token) {
        return {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        }
    } else {
        return {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }
    }
    
}

export default apiHelpers
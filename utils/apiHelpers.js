const apiHelpers = {};

apiHelpers.tryCatchFetch = async (axiosCall) => {
    try {
        const response = await axiosCall()
        return response ? response : {message:'null response'}
    }
    catch (e) {
        console.error("tryCatchFetch ERROR:", e.response ? e.response.data : e)
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
import { create } from 'apisauce';
import useCookies from '../security/cookies';

const useApiGet = () => {

    const { getToken } = useCookies();
    const token = getToken();
    const api = create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    });

    try {
        const getData = async (path) => {
            return await api.get(path)
                .then(response => {
                    let error = false;
                    let success = false;
                    if (response.ok) {
                        success = response.data
                    } else {
                        if ([403, 401].includes(response.status)) {
                            error = "You don't have access to this resource"
                        }

                        if (response.problem) {
                            error = response.problem
                        }
                    }
                    return { success: success, error: error }
                })
        }
        return { getData }

    } catch (error) {
        return { success: null, error: "Can't connect to backend" }
    }


}

export default useApiGet

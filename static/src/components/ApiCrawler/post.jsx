import { create } from 'apisauce';
import useCookies from '../security/cookies';

const useApiPost = () => {

    const { getToken } = useCookies();
    const token = getToken();
    const api = create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    });

    try {
        const postData = async (path, args) => {
            return await api.post(path, args)
                .then(response => {
                    let error = false;
                    let success = false;
                    if (response.ok) {
                        success = response.data
                    } else {
                        if ([403, 401].includes(response.status)) {
                            error = "You don't have access to this resource"
                        } else if ([500].includes(response.status)) {
                            error = response.data
                        } else {
                            if (response.problem) {
                                error = response.problem
                            }

                        }

                    }
                    return { success: success, error: error }
                })
        }
        return { postData }

    } catch (error) {
        return { success: null, error: "Can't connect to backend" }
    }


}

export default useApiPost

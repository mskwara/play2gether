import axios from "axios";
const sendRequest = async (method, url, body, withCredentials) => {
    let res;
    try {
        switch (method) {
            case "get":
                res = await axios.get(url, {
                    withCredentials,
                });
                break;
            case "post":
                res = await axios.post(url, body, {
                    withCredentials,
                });
                break;
            case "patch":
                res = await axios.patch(url, body, {
                    withCredentials,
                });
                break;
            default:
                throw "Request cannot be sent - developer fault...";
        }
    } catch (err) {
        console.log(err);
        res = err.response;
    } finally {
        return res;
    }
};

export default sendRequest;

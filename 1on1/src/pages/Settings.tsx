import React from "react";
import useRequest from "../utils/requestHandler";
import Sidebar from "../components/Sidebar";

const Settings = () => {

    const [userData, setUserData] = React.useState();
    const sendRequest = useRequest();

    React.useEffect(() => {
        const fetchUserData = async () => {
            const response = await sendRequest("/accounts/profile/", { method: "GET"});
            setUserData(response);
        };
        fetchUserData();
    }, [sendRequest]);

    return (
        <div id="wrapper" className="d-flex">
            <Sidebar />
        </div>
    );
}

export default Settings;

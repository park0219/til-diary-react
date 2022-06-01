import HeatMap from "@uiw/react-heat-map";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { getCookie } from "../util/cookie";

const Home = () => {
    const [data, setData] = useState({});
    const login_token = getCookie("login_token");

    useEffect(() => {
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `홈`;
        //토큰 정보가 있다면 해당 토큰의 정보로 요청
        if (login_token !== undefined && login_token !== "") {
            const jwtInfo = jwtDecode(login_token);
            getTilStatusList(jwtInfo.sub);
        }
    }, []);

    const getTilStatusList = async (username) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/status/${username}`);
            setData(res.data);
        } catch (error) {
            alert("목록을 불러오는 과정에서 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            {Object.keys(data).length > 0 ? (
                <div className="tilStatus">
                    <div>
                        <span>{data.nickname}</span>
                        <HeatMap
                            value={data.statusList}
                            startDate={new Date(new Date().getFullYear() + "/01/01")}
                            endDate={new Date(new Date().getFullYear() + "/12/31")}
                            width="930"
                            rectSize={15}
                            legendCellSize={0}
                        />
                    </div>
                </div>
            ) : (
                ""
            )}
            <div>markdown 문법 정보 입니다.</div>
        </div>
    );
};

export default Home;

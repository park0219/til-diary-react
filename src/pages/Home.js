import HeatMap from "@uiw/react-heat-map";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import { TokenStateContext } from "../App";
import MyButton from "../components/MyButton";

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [todayTIL, setTodayTIL] = useState(false);
    const login_token = useContext(TokenStateContext);

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
            if (res.data !== undefined) {
                let today = new Date();
                res.data.statusList.forEach((item, index) => {
                    if (item.date === `${today.getFullYear()}/${(today.getMonth() > 9 ? "" : "0") + (today.getMonth() + 1)}/${(today.getDate() > 9 ? "" : "0") + today.getDate()}`) {
                        setTodayTIL(true);
                        return false;
                    }
                });
            }
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
                    <div className="today_til">{todayTIL === true ? <span>오늘의 TIL를 작성했습니다.</span> : <span>오늘의 TIL을 작성해주세요.</span>}</div>
                </div>
            ) : (
                <div class="login_box">
                    <MyButton text={"로그인하기"} onClick={() => navigate(`/login`)} />
                </div>
            )}
            <div>
                <h2>markdown 문법 정보 입니다.</h2>
                <YouTube
                    videoId="dUbp9wAy178"
                    opts={{
                        width: "100%",
                        height: "390",
                    }}
                    //이벤트 리스너
                    onEnd={(e) => {
                        e.target.stopVideo(0);
                    }}
                />
                <YouTube
                    videoId="kMEb_BzyUqk"
                    opts={{
                        width: "100%",
                        height: "390",
                    }}
                    //이벤트 리스너
                    onEnd={(e) => {
                        e.target.stopVideo(0);
                    }}
                />
            </div>
        </div>
    );
};

export default Home;

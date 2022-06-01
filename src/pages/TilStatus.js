import axios from "axios";
import HeatMap from "@uiw/react-heat-map";
import { useEffect, useState } from "react";

const TilStatus = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `TIL 현황`;
        getTilStatusList();
    }, []);

    const getTilStatusList = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/status");
            setData(res.data);
        } catch (error) {
            alert("목록을 불러오는 과정에서 오류가 발생했습니다.");
        }
    };

    return (
        <div className="tilStatus">
            {data.map((item) => (
                <div key={item.user_id}>
                    <span>{item.nickname}</span>
                    <HeatMap
                        value={item.statusList}
                        startDate={new Date(new Date().getFullYear() + "/01/01")}
                        endDate={new Date(new Date().getFullYear() + "/12/31")}
                        width="930"
                        rectSize={15}
                        legendCellSize={0}
                    />
                </div>
            ))}
        </div>
    );
};

export default TilStatus;

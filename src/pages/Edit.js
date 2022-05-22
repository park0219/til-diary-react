import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {
    const navigate = useNavigate();

    const [originData, SetOriginData] = useState();
    const { boardId } = useParams();

    useEffect(() => {
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `TIL 일기장 - ${boardId}번 수정`;
    }, []);

    useEffect(() => {
        //일기 정보 불러오기
        const getTILInfo = async () => {
            try {
                let res = await axios.get(`http://localhost:8080/api/board/${boardId}`);
                let targetDiary = res.data;
                if (targetDiary) {
                    SetOriginData({ boardId: boardId, ...targetDiary });
                } else {
                    alert("없는 일기 입니다.");
                    navigate("/", { replace: true });
                }
            } catch (error) {
                alert("일기 정보를 불러오는 과정에서 오류가 발생했습니다.");
            }
        };
        getTILInfo();
    }, [boardId]);

    return <div>{originData && <DiaryEditor isEdit={true} originData={originData} />}</div>;
};

export default Edit;

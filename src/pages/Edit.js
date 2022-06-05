import axios from "axios";
import jwtDecode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TokenStateContext } from "../App";
import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {
    const navigate = useNavigate();

    const [originData, SetOriginData] = useState();
    const { boardId } = useParams();

    const token = useContext(TokenStateContext);

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
                if (token) {
                    const jwtInfo = jwtDecode(token);
                    if (res.data.username !== jwtInfo.sub) {
                        alert("수정 권한이 없는 게시글 입니다.");
                        navigate(-1, { replace: true });
                    }
                } else {
                    alert("수정 권한이 없는 게시글 입니다.");
                    navigate(-1, { replace: true });
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

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {
    const navigate = useNavigate();

    const [originData, SetOriginData] = useState();
    const { id } = useParams();
    const diaryList = useContext(DiaryStateContext);

    useEffect(() => {
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `TIL 일기장 - ${id}번 수정`;
    }, []);

    useEffect(() => {
        if (diaryList.length >= 1) {
            const targetDiary = diaryList.find((item) => parseInt(item.id) === parseInt(id));

            if (targetDiary) {
                SetOriginData(targetDiary);
            } else {
                alert("없는 일기 입니다.");
                navigate("/", { replace: true });
            }
        }
    }, [id, diaryList]);

    return <div>{originData && <DiaryEditor isEdit={true} originData={originData} />}</div>;
};

export default Edit;

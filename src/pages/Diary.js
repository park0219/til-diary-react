import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";
import { emotionList } from "../util/emotion";

const Diary = () => {
    const navigate = useNavigate();
    const { boardId } = useParams();
    const [data, setData] = useState();

    useEffect(() => {
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `TIL 일기장 - ${boardId}번 일기`;
    }, []);

    useEffect(() => {
        //일기 정보 불러오기
        const getTILInfo = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/board/${boardId}`);
                setData(res.data);
            } catch (error) {
                alert("일기 정보를 불러오는 과정에서 오류가 발생했습니다.");
            }
        };
        getTILInfo();
    }, [boardId]);

    if (!data) {
        return <div className="DiaryPage">로딩중입니다...</div>;
    } else {
        const curEmotionData = emotionList.find((item) => parseInt(item.emotion_id) === parseInt(data.emotion));

        return (
            <div className="DiaryPage">
                <MyHeader
                    headText={`${data.createdAt.split("T")[0]} - ${data.nickname} 기록`}
                    leftChild={<MyButton text={"< 뒤로가기"} onClick={() => navigate(-1)} />}
                    rightChild={<MyButton text={"수정하기"} onClick={() => navigate(`/edit/${data.id}`)} />}
                />
                <article>
                    <section>
                        <h4>TIL 소감</h4>
                        <div className={["diary_img_wrapper", `diary_img_wrapper_${data.emotion}`].join(" ")}>
                            <img src={curEmotionData.emotion_img} alt={curEmotionData.emotion_description} />
                            <div className="emotion_description">{curEmotionData.emotion_description}</div>
                        </div>
                    </section>
                    <section>
                        <h4>TIL 내용</h4>
                        <div className="diary_content_wrapper">
                            <p>{data.content}</p>
                        </div>
                    </section>
                </article>
            </div>
        );
    }
};

export default Diary;

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmotionItem from "./EmotionItem";

import MyButton from "./MyButton";
import MyHeader from "./MyHeader";

import { emotionList } from "../util/emotion";
import axios from "axios";
import { TokenStateContext } from "../App";

const DiaryEditor = ({ isEdit, originData }) => {
    const navigate = useNavigate();
    const contentRef = useRef();

    const [title, setTitle] = useState("");
    const [emotion, setEmotion] = useState(3);
    const [content, setContent] = useState("");

    const token = useContext(TokenStateContext);

    const onCreate = async (title, content, emotion) => {
        try {
            const res = await axios.post("http://localhost:8080/api/board", { title: title, content: content, emotion: emotion }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 200) {
                alert("등록되었습니다.");
                return;
            }
            throw new Error();
        } catch (error) {
            alert("저장하는 과정에서 오류가 발생했습니다.");
        }
    };
    const onEdit = async (boardId, title, content, emotion) => {
        try {
            const res = await axios.put(`http://localhost:8080/api/board/${boardId}`, { title: title, content: content, emotion: emotion }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 200) {
                alert("수정되었습니다.");
                return;
            }
            throw new Error();
        } catch (error) {
            alert("저장하는 과정에서 오류가 발생했습니다.");
        }
    };
    const onRemove = async (boardId) => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/board/${boardId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 200) {
                alert("삭제되었습니다.");
                return;
            }
            throw new Error();
        } catch (error) {
            alert("저장하는 과정에서 오류가 발생했습니다.");
        }
    };

    const handleClickEmote = useCallback((emotion) => {
        setEmotion(emotion);
    }, []);

    const handleSubmit = () => {
        if (content.length < 1) {
            contentRef.current.focus();
            return;
        }

        if (window.confirm(isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?")) {
            if (!isEdit) {
                onCreate(title, content, emotion);
            } else {
                onEdit(originData.boardId, title, content, emotion);
            }
            navigate("/list", { replace: true });
        }
    };

    const handleRemove = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            onRemove(originData.boardId);
            navigate("/list", { replace: true });
        }
    };

    useEffect(() => {
        if (isEdit) {
            setTitle(originData.title);
            setEmotion(Number(originData.emotion));
            setContent(originData.content);
        }
    }, [isEdit, originData]);

    return (
        <div className="DiaryEditor">
            <MyHeader
                headText={isEdit ? "일기 수정하기" : "새 일기쓰기"}
                leftChild={<MyButton text={"< 뒤로가기"} onClick={() => navigate(-1)} />}
                rightChild={isEdit && <MyButton text={"삭제하기"} type={"negative"} onClick={handleRemove} />}
            />
            <div>
                <section>
                    <h4>제목</h4>
                    <div className="input_box">
                        <input type="text" className="input_text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                </section>
                <section>
                    <h4>TIL 평가</h4>
                    <div className="input_box emotion_list_wrapper">
                        {emotionList.map((item) => (
                            <EmotionItem key={item.emotion_id} {...item} onClick={handleClickEmote} isSelected={item.emotion_id === emotion} />
                        ))}
                    </div>
                </section>
                <section>
                    <h4>TIL 정리</h4>
                    <div className="input_box text_wrapper">
                        <textarea ref={contentRef} placeholder="오늘 배운 내용을 입력해주세요" value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                </section>
                <section>
                    <div className="control_box">
                        <MyButton text={"취소하기"} onClick={() => navigate(-1)} />
                        <MyButton text={"작성완료"} type={"positive"} onClick={handleSubmit} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DiaryEditor;

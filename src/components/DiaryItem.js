import React from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "./MyButton";

const DiaryItem = ({ boardId, title, emotion, nickname, createdAt }) => {
    const navigate = useNavigate();

    const env = process.env;
    env.PUBLIC_URL = env.PUBLIC_URL || "";

    const goDetail = () => {
        navigate(`/diary/${boardId}`);
    };

    const goEdit = () => {
        navigate(`/edit/${boardId}`);
    };

    return (
        <div className="DiaryItem">
            <div onClick={goDetail} className={["emotion_img_wrapper", `emotion_img_wrapper_${emotion}`].join(" ")}>
                <img src={process.env.PUBLIC_URL + `assets/emotion${emotion}.png`} alt={`emotion${emotion}`} />
            </div>
            <div onClick={goDetail} className="info_wrapper">
                <div className="diary_date">{title}</div>
                <div className="diary_content_preview">{nickname}</div>
                <div className="diary_content_preview">{createdAt.replace("T", " ")}</div>
            </div>
        </div>
    );
};

export default React.memo(DiaryItem);

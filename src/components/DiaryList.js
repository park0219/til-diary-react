import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";
import MyButton from "./MyButton";

const searchOptionList = [
    { value: "title", name: "제목" },
    { value: "writer", name: "작성자" },
];

const ControlMenu = React.memo(({ value, onChange, optionList }) => {
    return (
        <select className="ControlMenu" value={value} onChange={(e) => onChange(e.target.value)}>
            {optionList.map((item, index) => (
                <option key={index} value={item.value}>
                    {item.name}
                </option>
            ))}
        </select>
    );
});

const DiaryList = ({ diaryList }) => {
    const navigate = useNavigate();
    const inputRef = useRef();
    const [searchType, setSearchType] = useState("title");
    const [searchValue, setSearchValue] = useState("");

    const getProcessedDiaryList = () => {
        const searchCallBack = (item) => {
            if (searchValue === "") {
                return true;
            }
            if (searchType === "title") {
                return item.title.includes(searchValue);
            } else if (searchType === "writer") {
                return item.nickname.includes(searchValue);
            } else {
                return true;
            }
        };

        //깊은 복사
        const copyList = JSON.parse(JSON.stringify(diaryList));
        const filteredList = searchType === "" ? copyList : copyList.filter((item) => searchCallBack(item));
        return filteredList;
    };

    return (
        <div className="DiaryList">
            <div className="menu_wrapper">
                <div className="left_col">
                    <ControlMenu value={searchType} onChange={setSearchType} optionList={searchOptionList} />
                    <input type="text" ref={inputRef} />
                </div>
                <div className="right_col">
                    <MyButton
                        type={"positive"}
                        text={"검색"}
                        onClick={() => {
                            setSearchValue(inputRef.current.value);
                        }}
                    />
                    <MyButton type={"positive"} text={"TIL 쓰기"} onClick={() => navigate("/new")} />
                </div>
            </div>

            {getProcessedDiaryList().map((item) => (
                <DiaryItem key={item.boardId} {...item} />
            ))}
        </div>
    );
};

DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;

import axios from "axios";
import { useEffect, useState } from "react";
import DiaryList from "../components/DiaryList";
import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";
import { getStringDateLocalDateTime } from "../util/date";

const List = () => {
    const [data, setData] = useState([]);
    const [curDate, setCurDate] = useState(new Date());
    const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

    useEffect(() => {
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `TIL 일기장`;
    }, []);

    const getDiaryList = async (firstDay, lastDay) => {
        //diaryList 정보 불러오기
        try {
            console.log(firstDay, lastDay);
            const res = await axios.get("http://localhost:8080/api/board", { params: { startDate: firstDay, endDate: lastDay } });
            setData(res.data);
        } catch (error) {
            alert("목록을 불러오는 과정에서 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        //달 정보가 변경되었을 때 TIL 게시글 가져오기
        const firstDay = getStringDateLocalDateTime(new Date(curDate.getFullYear(), curDate.getMonth(), 1));
        const lastDay = getStringDateLocalDateTime(new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0, 23, 59, 59));
        getDiaryList(firstDay, lastDay);
    }, [curDate]);

    const increaseMonth = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate()));
    };

    const decreaseMonth = () => {
        setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate()));
    };

    return (
        <div>
            <MyHeader headText={headText} leftChild={<MyButton text={"<"} onClick={decreaseMonth} />} rightChild={<MyButton text={">"} onClick={increaseMonth} />} />
            <DiaryList diaryList={data} />
        </div>
    );
};

export default List;

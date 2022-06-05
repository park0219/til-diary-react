import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenStateContext } from "../App";
import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";

const Info = () => {
    const navigate = useNavigate();
    const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    const [inputValue, setInputValue] = useState({
        username: "",
        password: "",
        passwordCheck: "",
        nickname: "",
        email: "",
        email_receives: false,
    });
    const token = useContext(TokenStateContext);

    useEffect(() => {
        //사용자 정보 불러오기
        const getUserInfo = async () => {
            try {
                let res = await axios.get(`http://localhost:8080/api/user`, { headers: { Authorization: `Bearer ${token}` } });
                let userInfo = res.data;
                if (userInfo) {
                    setInputValue({ ...inputValue, username: userInfo.username, nickname: userInfo.nickname, email: userInfo.email, email_receives: userInfo.email_receives });
                } else {
                    alert("없는 회원 정보입니다.");
                    navigate("/login", { replace: true });
                }
            } catch (error) {
                alert("없는 회원 정보입니다.");
                navigate("/");
            }
        };
        getUserInfo();
    }, []);

    const { password, passwordCheck, nickname, email, email_receives } = inputValue;

    const handleInput = (event) => {
        const { name, value, type } = event.target;
        //체크 박스 예외
        if (type === "checkbox") {
            setInputValue({
                ...inputValue,
                [name]: !inputValue[name],
            });
        } else {
            setInputValue({
                ...inputValue,
                [name]: value,
            });
        }
    };

    let inputValid = nickname.length > 3 && email.length > 1;
    if (password.length > 0) {
        inputValid = inputValid && password.length > 3 && password === passwordCheck;
    }
    const emailValid = regEmail.test(email);
    const isActive = inputValid && emailValid === true;

    const infoSubmit = async (e) => {
        e.preventDefault();
        if (!inputValid || !emailValid) {
            alert("입력된 값을 확인해주세요.");
            return;
        }
        try {
            let userInfo = { nickname, email, email_receives };
            if (password !== "") {
                userInfo = { ...userInfo, password };
            }
            const res = await axios.put("http://localhost:8080/api/user", userInfo, {
                headers: { Authorization: `Bearer ${token}` },
            });
            //로그인 처리
            if (res.status === 200) {
                alert("내정보수정이 완료되었습니다.");
                navigate("/");
            }
        } catch (error) {
            alert("내정보를 수정하는 과정에서 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <MyHeader headText={`내정보관리 - ${inputValue.username}`} />
            <div className="Join">
                <form onSubmit={infoSubmit}>
                    <section>
                        <input type="password" name="password" size="43" maxLength={50} placeholder="비밀번호(3글자 이상)" onChange={handleInput} />
                        <input type="password" name="passwordCheck" size="43" maxLength={50} placeholder="비밀번호 확인" onChange={handleInput} />
                        <input type="text" name="nickname" size="43" maxLength={50} placeholder="닉네임(3글자 이상)" onChange={handleInput} value={inputValue.nickname} />
                        <input type="email" name="email" size="43" maxLength={50} placeholder="이메일" onChange={handleInput} value={inputValue.email} />
                        <label>
                            <input type="checkbox" name="email_receives" size="43" onChange={handleInput} checked={inputValue.email_receives ? "checked" : ""} />
                            <span>이메일 수신 동의</span>
                        </label>
                    </section>
                    <section>
                        <div className="control_box">
                            <MyButton text={"취소하기"} onClick={() => navigate(`/`)} />
                            <MyButton text={"작성완료"} type={isActive ? "positive" : "default"} onClick={infoSubmit} />
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
};

export default Info;

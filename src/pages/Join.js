import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";

const Join = () => {
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

    const { username, password, passwordCheck, nickname, email } = inputValue;

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

    const inputValid = username.length >= 3 && password.length >= 3 && password === passwordCheck && nickname.length >= 3 && email.length > 1;
    const emailValid = regEmail.test(email);
    const isActive = inputValid && emailValid === true;

    const joinSubmit = async (e) => {
        e.preventDefault();
        if (!inputValid || !emailValid) {
            alert("입력된 값을 확인해주세요.");
            return;
        }
        try {
            const res = await axios.post("http://localhost:8080/api/user/signup", JSON.stringify(inputValue), {
                headers: {
                    "Content-Type": `application/json`,
                },
            });
            //로그인 처리
            if (res.status === 200) {
                alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
                navigate("/login");
            }
        } catch (error) {
            alert("회원가입하는 과정에서 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <MyHeader headText="회원가입" />
            <div className="Join">
                <form>
                    <section>
                        <input type="text" name="username" size="43" maxLength={50} placeholder="아이디(3글자 이상)" onChange={handleInput} />
                        <input type="password" name="password" size="43" maxLength={50} placeholder="비밀번호(3글자 이상)" onChange={handleInput} />
                        <input type="password" name="passwordCheck" size="43" maxLength={50} placeholder="비밀번호 확인" onChange={handleInput} />
                        <input type="text" name="nickname" size="43" maxLength={50} placeholder="닉네임(3글자 이상)" onChange={handleInput} />
                        <input type="email" name="email" size="43" maxLength={50} placeholder="이메일" onChange={handleInput} />
                        <label>
                            <input type="checkbox" name="email_receives" size="43" onChange={handleInput} />
                            <span>이메일 수신 동의</span>
                        </label>
                    </section>
                    <section>
                        <div className="control_box">
                            <MyButton text={"취소하기"} onClick={() => navigate(`/`)} />
                            <MyButton text={"작성완료"} type={isActive ? "positive" : "default"} onClick={joinSubmit} />
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
};

export default Join;

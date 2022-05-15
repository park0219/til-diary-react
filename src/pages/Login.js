import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenDispatchContext } from "../App";
import MyButton from "../components/MyButton";
import MyHeader from "../components/MyHeader";

const Login = () => {
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const { onTokenCreate } = useContext(TokenDispatchContext);

    const loginSubmit = async (e) => {
        e.preventDefault();
        if (id.length < 4) {
            alert("아이디는 4글자 이상 입력해주세요.");
            return;
        }
        if (pw.length < 4) {
            alert("비밀번호는 4글자 이상 입력해주세요.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8080/api/auth/authenticate", { username: id, password: pw });
            //로그인 처리
            if (res.data.token) {
                onTokenCreate(res.data.token);
            }
            navigate("/");
        } catch (error) {
            alert("로그인하는 과정에서 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <MyHeader headText="로그인" />
            <div className="Login">
                <form name="login" method="post" onSubmit={loginSubmit}>
                    <section>
                        <input type="text" name="id" size="43" maxLength={12} placeholder="아이디" onChange={(e) => setId(e.target.value)} />
                        <input type="password" name="pw" size="43" maxLength={20} placeholder="비밀번호" onChange={(e) => setPw(e.target.value)} />
                    </section>
                    <section>
                        <MyButton text={"로그인"} onClick={loginSubmit} />
                        <MyButton text={"회원가입"} onClick={() => navigate(`/join`)} />
                    </section>
                </form>
            </div>
        </div>
    );
};

export default Login;

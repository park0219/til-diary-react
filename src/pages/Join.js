import { useState } from 'react';
import MyButton from '../components/MyButton';
import MyHeader from '../components/MyHeader';

const Join = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwCheck, setPwCheck] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [emailCheck, setEmailCheck] = useState('');

    const submit = () => {};

    const reg = () => {};

    return (
        <div>
            <MyHeader headText="회원가입" />
            <div className="Join">
                <form name="login" method="post" action="login_proc" onSubmit="return fnLogin(this);">
                    <section>
                        <input type="text" name="id" size="43" maxLength={12} placeholder="아이디" onChange={(e) => setId(e.target.value)} />
                        <input type="password" name="pw" size="43" maxLength={20} placeholder="비밀번호" onChange={(e) => setPw(e.target.value)} />
                        <input type="password" name="pwCheck" size="43" maxLength={20} placeholder="비밀번호 확인" onChange={(e) => setPwCheck(e.target.value)} />
                        <input type="text" name="nickname" size="43" maxLength={20} placeholder="닉네임" onChange={(e) => setNickname(e.target.value)} />
                        <input type="email" name="email" size="43" maxLength={20} placeholder="이메일" onChange={(e) => setEmail(e.target.value)} />
                        <label>
                            <input type="checkbox" name="emailCheck" size="43" maxLength={20} onChange={(e) => setEmailCheck(e.target.value)} />
                            <span>이메일 수신 동의</span>
                        </label>
                    </section>
                    <section>
                        <div className="control_box">
                            <MyButton text={'취소하기'} onClick={reg} />
                            <MyButton text={'작성완료'} type={'positive'} onClick={submit} />
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
};

export default Join;

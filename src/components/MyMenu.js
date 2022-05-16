import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenStateContext } from "../App";

const MyMenu = () => {
    const navigate = useNavigate();
    const login_token = useContext(TokenStateContext);

    const [currentMenu, setCurrentMenu] = useState(0);

    const menuArr = [
        { name: "홈", link: "/" },
        { name: "TIL 현황", link: "/til-status" },
        { name: "TIL 게시판", link: "/list" },
    ];

    if (login_token) {
        menuArr.push({ name: "내정보관리", link: "/info" });
    } else {
        menuArr.push({ name: "로그인", link: "/login" });
    }

    const menuClick = (link, index) => {
        setCurrentMenu(index);
        navigate(link);
    };

    return (
        <header>
            <ul>
                {menuArr.map((item, index) => (
                    <li key={index} className={currentMenu === index ? "on" : ""} onClick={() => menuClick(item.link, index)}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </header>
    );
};

export default MyMenu;

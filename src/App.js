import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useReducer, useState } from "react";
import "./App.css";
import List from "./pages/List";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";
import Login from "./pages/Login";
import Join from "./pages/Join";
import { getCookie, removeCookie, setCookie } from "./util/cookie";
import MyMenu from "./components/MyMenu";
import Home from "./pages/Home";
import TilStatus from "./pages/TilStatus";

const tokenReducer = (state, action) => {
    switch (action.type) {
        case "CREATE": {
            setCookie("login_token", action.login_token, { path: "/", secure: "true", sameSite: "none" });
            return action.login_token;
        }
        case "REMOVE": {
            removeCookie("login_token");
            return "";
        }
        default: {
            return state;
        }
    }
};

export const TokenStateContext = React.createContext();
export const TokenDispatchContext = React.createContext();

function App() {
    const [getToken, setGetToken] = useState(false);

    useEffect(() => {
        //로그인 정보 초기화
        const login_token = getCookie("login_token");
        if (login_token) {
            tokenDispatch({ type: "CREATE", login_token: login_token });
        }
        setGetToken(true);
    }, []);

    const [token, tokenDispatch] = useReducer(tokenReducer, "");

    //TOKEN INIT
    const onTokenCreate = (login_token) => {
        tokenDispatch({
            type: "CREATE",
            login_token: login_token,
        });
    };

    //TOKEN REMOVE
    const onTokenRemove = () => {
        tokenDispatch({ type: "REMOVE" });
    };

    return (
        <>
            {getToken ? (
                <TokenStateContext.Provider value={token}>
                    <TokenDispatchContext.Provider value={{ onTokenCreate, onTokenRemove }}>
                        <BrowserRouter>
                            <div className="App">
                                <MyMenu />
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/til-status" element={<TilStatus />} />
                                    <Route path="/list" element={<List />} />
                                    <Route path="/new" element={<New />} />
                                    <Route path="/edit/:boardId" element={<Edit />} />
                                    <Route path="/diary/:boardId" element={<Diary />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/join" element={<Join />} />
                                    <Route path="/info" element={<Join />} />
                                </Routes>
                            </div>
                        </BrowserRouter>
                    </TokenDispatchContext.Provider>
                </TokenStateContext.Provider>
            ) : (
                "로딩 중 입니다."
            )}
        </>
    );
}

export default App;

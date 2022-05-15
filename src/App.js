import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useReducer, useRef } from "react";
import "./App.css";
import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";
import Login from "./pages/Login";
import Join from "./pages/Join";
import { getCookie, removeCookie, setCookie } from "./util/cookie";

const reducer = (state, action) => {
    let newState = [];
    switch (action.type) {
        case "INIT": {
            return action.data;
        }
        case "CREATE": {
            newState = [action.data, ...state];
            break;
        }
        case "REMOVE": {
            newState = state.filter((item) => item.id !== action.targetId);
            break;
        }
        case "EDIT": {
            newState = state.map((item) => (item.id === action.data.id ? { ...action.data } : item));
            break;
        }
        default:
            return state;
    }

    localStorage.setItem("diary", JSON.stringify(newState));
    return newState;
};

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

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();
export const TokenStateContext = React.createContext();
export const TokenDispatchContext = React.createContext();

function App() {
    useEffect(() => {
        //게시글 초기화
        const localData = localStorage.getItem("diary");
        if (localData) {
            const diaryList = JSON.parse(localData).sort((a, b) => parseInt(b.id) - parseInt(a.id));

            if (diaryList.length >= 1) {
                dataId.current = parseInt(diaryList[0].id) + 1;
                dispatch({ type: "INIT", data: diaryList });
            }
        }

        //로그인 정보 초기화
        const login_token = getCookie("login_token");
        if (login_token) {
            tokenDispatch({ type: "CREATE", login_token: login_token });
        }
    }, []);

    const [data, dispatch] = useReducer(reducer, []);
    const [token, tokenDispatch] = useReducer(tokenReducer, "");

    const dataId = useRef(0);

    //CREATE
    const onCreate = (date, content, emotion) => {
        dispatch({
            type: "CREATE",
            data: {
                id: dataId.current,
                date: new Date(date).getTime(),
                content,
                emotion,
            },
        });
        dataId.current += 1;
    };

    //REMOVE
    const onRemove = (targetId) => {
        dispatch({ type: "REMOVE", targetId });
    };

    //EDIT
    const onEdit = (targetId, date, content, emotion) => {
        dispatch({
            type: "EDIT",
            data: {
                id: targetId,
                date: new Date(date).getTime(),
                content,
                emotion,
            },
        });
    };

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
        <TokenStateContext.Provider value={token}>
            <TokenDispatchContext.Provider value={{ onTokenCreate, onTokenRemove }}>
                <DiaryStateContext.Provider value={data}>
                    <DiaryDispatchContext.Provider value={{ onCreate, onEdit, onRemove }}>
                        <BrowserRouter>
                            <div className="App">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/new" element={<New />} />
                                    <Route path="/edit/:id" element={<Edit />} />
                                    <Route path="/diary/:id" element={<Diary />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/Join" element={<Join />} />
                                </Routes>
                            </div>
                        </BrowserRouter>
                    </DiaryDispatchContext.Provider>
                </DiaryStateContext.Provider>
            </TokenDispatchContext.Provider>
        </TokenStateContext.Provider>
    );
}

export default App;

import {atom} from "recoil";

export interface IToDo {
    id : number,
    text: string,
}

export interface IToDoList {
    [key:string] : IToDo[]
}


export const toDoList = atom<IToDoList>({
    key: "toDo",
    default: {
        "Coding勉強": [
            {id:1 , text: "Javascriptアルゴリズム"},
            {id:2 , text: "React"},
            {id:3 , text: "Recoilと他のライブラリたち"}
        ],
        片付け: [
            {id:5 , text: "部屋"},
            {id:6 , text: "パソコン"},
            {id:7 , text: "Air"}
        ],

    }
})
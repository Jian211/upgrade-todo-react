import styled from "styled-components";
import { Draggable} from 'react-beautiful-dnd';
import React, {useState} from 'react'
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toDoList } from "../atoms";

interface IToDoShape {
    boardId: string,
    index: number,
    toDoId: number,
    toDoText: string
}
interface IToDoForm {
    toDo : string
}
const ToDoBox = styled.li<{isDragging:boolean}>`
    display: flex;
    border: 1px solid red;
    justify-content: space-between;
    border-radius: 6px;
    padding: 0.5rem;
    margin: 10px;
    background-color: ${props => props.isDragging ? "#95a5a6" : "white"};
`;

const ToDoText = styled.div`
    width: 100%;
`;

const ToDoForm = styled.form<{toDoStateTrigger: boolean}>`
    width: 100%;
    input{
        pointer-events: ${props => props.toDoStateTrigger ? "none" : "auto" };
        font-size: 1rem;
        border: none;
        background-color: white;
        width: 100%;
        text-overflow: ellipsis;
    }
`;

const EditBox = styled.div`
    display: flex;
    justify-content: space-between;
    width: 16%;
    height: fit-content;

    img{
        cursor: pointer;
        width: 1.5rem;
        margin-left: 8px;
    }
`;

const Todo = ({boardId ,index, toDoId, toDoText}:IToDoShape ) => {

    const [toDoStateTrigger, setToDoStateTrigger] = useState(true);
    const {register, handleSubmit,setFocus} = useForm<IToDoForm>();
    const setToDo = useSetRecoilState(toDoList);

    const editToDoTrigger = () => {
        setToDoStateTrigger( curr => !curr)
        setFocus("toDo")
    }
    
    const removeToDo = () => {
        if(window.confirm(`本当にこの"${toDoText}"を削除しますか?`)){
            setToDo( allBoards => {
                const copyBoards = [...allBoards[boardId]];
                copyBoards.splice(index, 1)
                return {
                    ...allBoards,
                    [boardId]: copyBoards
                };
            })
        }
    }
    
    const onValid = ({toDo}:IToDoForm) => {
        if( toDo !== toDoText) {

            const newToDo = { 
                id : Date.now(),
                text: toDo
            }

            setToDo( allBoards => {
                console.log(allBoards)
                const copyBoard = [...allBoards[boardId]];
                copyBoard.splice(index, 1, newToDo)
                return {
                    ...allBoards,
                    [boardId]: [...copyBoard]
                }
            })
        } 
        setToDoStateTrigger( curr => !curr)
    }



  return (
    <Draggable key={toDoId} draggableId= {toDoId+""} index={index}>
        {(provider, snapshot) => (
            <ToDoBox 
                isDragging= {snapshot.isDragging}
                ref={provider.innerRef}
                {...provider.draggableProps}
                {...provider.dragHandleProps}
            >   
            { toDoStateTrigger ? 
                <ToDoText>{toDoText}</ToDoText>
            :
                <ToDoForm toDoStateTrigger={toDoStateTrigger} onSubmit={handleSubmit(onValid)}>
                    <input 
                        readOnly={toDoStateTrigger ?? false }
                        {...register("toDo", {
                            required : "一文字以上を入力してください。",
                            value: toDoText,
                            onBlur: () => onValid,
                        })} 
                    />
                </ToDoForm>
            }
                <EditBox>
                    <img onClick={editToDoTrigger} alt="edit" src="https://cdn-icons-png.flaticon.com/512/1160/1160515.png"/>
                    <img onClick={removeToDo} alt="remove" src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"/>
                </EditBox>
            </ToDoBox>
        )}
    </Draggable>
  )
}

export default React.memo(Todo)
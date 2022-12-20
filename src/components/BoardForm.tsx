import { useForm } from 'react-hook-form';
import {  useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { IToDo, toDoList } from '../atoms';
import Todo from './TodoForm';
import { Droppable } from "react-beautiful-dnd";
import TitleForm from './TitleForm';

const BoardFrame = styled.div`
  min-width: 340px;
  max-width: 500px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  background-color: #34495e;
  margin: 20px;
  border-radius: 10px;
 
`;

const MiddleLine = styled.hr`
  color: white;
  size: 30px;
  width: 94%;
  margin-top: 20px;
`;

const TextingForm = styled.form`
  padding: 0 0.5rem;
  width: 100%;
  height: fit-content;
  input {
    background-color: rgb(157, 234, 253);
    text-indent: 16px;
    font-size: 1rem;
    font-weight: bold;
    height: 4.5vh;
    width: 100%;
    border-radius: 10px;
  } 
`;

const DropArea = styled.ul<IDropArea>`
  background-color: #34495e;
  border-radius: 20px;
`;

interface IDropArea {
  isDraggingOver: boolean,
  isDraggingFromThisWith: boolean
}

interface IBoardForm {
    toDo: string
}

interface IBoardShape {
    toDos: IToDo[],
    boardId: string
}


const BoardForm = ( {toDos, boardId}:IBoardShape ) => {
  const setToDoList = useSetRecoilState(toDoList);
  const {register, setValue, handleSubmit} = useForm<IBoardForm>();
  

  // TODO生成メソッド
  const onValid = ({toDo}:IBoardForm) => {
   
    // TODO生成
    const newToDo = { id: Date.now(),  text: toDo }
    console.log(newToDo)
    
    // 新しいTODOをリストへ
    setToDoList( currentToDoList => {
      const newToDoArr = [newToDo ,...currentToDoList[boardId]];
      console.log(newToDoArr)
      return { ...currentToDoList, [boardId]: newToDoArr };
    })

    // インプットの値をなし
    setValue("toDo", "");
  };

  return (
    <BoardFrame>
        
        <TitleForm boardId={boardId} />
        <TextingForm onSubmit={handleSubmit(onValid)}>
          <input 
              placeholder="今日は何をするんだよ？"
              {...register("toDo", {
                required: true,
              })} 
              />
        </TextingForm>
        
        <MiddleLine /> 

        <Droppable droppableId={boardId}>
          {(provider, info) => (
            <DropArea
              ref={provider.innerRef}
              isDraggingOver={info.isDraggingOver}
              isDraggingFromThisWith= {Boolean(info.draggingFromThisWith)}
              {...provider.droppableProps}
            >
              {toDos.map( (toDo,index) => (
                <Todo 
                  key={index} 
                  boardId={boardId}
                  toDoId={toDo.id}
                  toDoText= {toDo.text}
                  index={index} 
                />
              ))}

              {provider.placeholder}
            </DropArea>
          )}
        </Droppable>

    </BoardFrame> 
  )
}

export default BoardForm
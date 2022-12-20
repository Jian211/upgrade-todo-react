import {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoList } from '../atoms';

const BoardFormHeader = styled.div`
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: space-between;
  padding : 8px 1rem;
  align-items: center;
  font-size: 30px;
  font-weight: 600;
  color: #ecf0f1;
`;

const BoardTitle = styled.h3`
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 100%;
  font-size: 1.5rem;
  white-space: nowrap;
`;

const BoardTitleForm = styled.form`
  width: 80%;
  input{
    color: white;
    width: 100%;
    height: 80%;
    font-size: 1.5rem;
    font-weight: bold;
    padding: 10px 0;
    border: none;
    background-color: #34495e;
  }

  input:focus{
    background-color: skyblue;
  }

`;
const BoardEditBox = styled.div`
  width: 20%;
  display: flex;
  justify-content: right;
  height: auto;
  img {
      cursor: pointer;
      margin-left: 10px;
      width: 30%;
      filter: invert(1%) sepia(1%) saturate(1%) hue-rotate(1deg) brightness(1000%) contrast(80%);
    }
`;

interface ITitleFormProps {
    boardId: string
}

interface ITitleForm {
    title: string
}

const TitleForm = ({boardId}:ITitleFormProps) => {

  const setToDoList = useSetRecoilState(toDoList);
  const [titleChangeTrigger, setTitleChangeTrigger] = useState(true);
  const {register,setFocus, handleSubmit} = useForm<ITitleForm>();

  const onValid = ({title}:ITitleForm) => {
    console.log(titleChangeTrigger)
    if(title !== undefined || title !== boardId) {
      setToDoList( allBoards => {
        const allBoardsObj = {...allBoards};
        const copyToDos = [...allBoardsObj[boardId]];
        // const index = Object.keys(allBoardsObj).indexOf(boardId);
        delete allBoardsObj[boardId];
        
        // 저장 할 때마다 기존과의 순서가 다르게되니 수정
        return {
          [title]: copyToDos,
          ...allBoardsObj
        };
      })
    }
    setTitleChangeTrigger( curr => !curr);
  }
 
 
  const openTitleFormHandler = () =>  setTitleChangeTrigger( curr => !curr);

   // ボード削除
   const deleteBoard = () => {
    if(window.confirm(`本当に${boardId}を削除しますか？`)){
        setToDoList( (currentList) => {
            const newBoardList = {...currentList }
            delete newBoardList[boardId];
            return newBoardList;
        })
    }
  }


  useEffect(()=>{
    setFocus("title");
  },[titleChangeTrigger,setFocus])

  return (
    <BoardFormHeader>
        { titleChangeTrigger ?  
            <BoardTitle>{boardId}</BoardTitle>
        :
            <BoardTitleForm onSubmit={handleSubmit(onValid)}>
                <input {...register("title", {
                    value: boardId,
                    onBlur: (e) => onValid({ title : e.currentTarget.value})
                })}/>
            </BoardTitleForm>
        }
        <BoardEditBox>
          {titleChangeTrigger ? 
            <img onClick={openTitleFormHandler} alt='' src="https://static-00.iconduck.com/assets.00/edit-icon-256x255-vwkmjehu.png" />
          :  
            <img alt="" src="https://icon2.cleanpng.com/20180925/wbe/kisspng-computer-icons-portable-network-graphics-check-mar-tick-mark-free-signs-icons-5baa656411c3d5.3601965315378937320728.jpg" />
          }
          <img onClick={deleteBoard} alt="" src="https://freesvg.org/img/1544641784.png"/>
        </BoardEditBox>
    </BoardFormHeader>
  )
}

export default TitleForm
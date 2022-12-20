import styled from "styled-components";
import { useRecoilState } from "recoil";
import {toDoList} from './atoms'
import BoardForm from "./components/BoardForm";
import { DragDropContext, DropResult} from "react-beautiful-dnd";

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 100px;
`;

const AddNote = styled.img`
  width: 100px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-grow: 1;
  margin: 0 auto;

  flex-basis: 33.3%;
  flex-wrap: wrap;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoList);

  const onDragEnd = ({ source, destination }:DropResult) => {
    if (!destination) return;

    // 同じボードの場合。。。
    if(destination.droppableId === source.droppableId) {
      setToDos( allBoards => {
        const boardCopyArr = [...allBoards[source.droppableId]];
        const taskObj = boardCopyArr[source.index];
        console.log(boardCopyArr)
        boardCopyArr.splice(source.index, 1);
        boardCopyArr.splice(destination.index,0, taskObj);
        return {
          ...allBoards,
          [destination.droppableId]: boardCopyArr
        }
      })
    }

    if(destination.droppableId !== source.droppableId){
      setToDos( allBoards => {
        const departureArr = [...allBoards[source.droppableId]];
        const destinationArr = [...allBoards[destination.droppableId]];
        const taskObj = departureArr[source.index];
        
        departureArr.splice(source.index, 1);
        destinationArr.splice(destination.index, 0, taskObj);
        
        return {
          ...allBoards,
          [source.droppableId]: departureArr,
          [destination.droppableId]: destinationArr
        };
      })
    }
  } 
  const addBoard = () => {
    console.log("fdsf")
    const defaultKey = new Date().toLocaleDateString('ja',{
      minute: 'numeric',
      hour: 'numeric',
      day: 'numeric',
      month:'long',
      year:'numeric',
      weekday:'short'
    });
    
    const dumData = [
      {id: new Date().getTime(), text:"日本語勉強2時間!"}
    ];

    setToDos( allBoards => {
      console.log(allBoards)
      return {
        [defaultKey]: [...dumData],
        ...allBoards
      };
    })
  }

  return (
    <Main>
      <div style={{ display: "flex", margin: "20px"}}>
        <Title>TODO</Title>
        <AddNote onClick={addBoard} alt="" src="https://icon-library.com/images/add-note-icon/add-note-icon-18.jpg"/>
      </div>
      <Wrapper>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(toDos).map( (boardId) => (
            <BoardForm boardId={boardId} toDos={toDos[boardId]} key={boardId}/>
          ))}
        </DragDropContext>
      </Wrapper>
    </Main>
  );
}

export default App;

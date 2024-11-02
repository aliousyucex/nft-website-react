import { GameCanvas } from './canvas';
import {S} from './index.styles';


export const Game = (props: {myRef: React.RefObject<HTMLDivElement>}) => {

  return (
    <S.Container ref={props.myRef} >
        <S.Title>PEANUT RUSH</S.Title>
        <GameCanvas />
    </S.Container>
  )
}

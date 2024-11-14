import { GameCanvas } from './canvas';
import {S} from './index.styles';


export const Game = (props: {myRef: React.RefObject<HTMLDivElement>, pageWidth: number}) => {

  if (props.pageWidth < 1200) {
    return (<S.Container ref={props.myRef}>
      You need bigger screen to play the game.
    </S.Container>);
  }

  return (
    <S.Container ref={props.myRef} >
        <S.Title>PEANUT RUSH</S.Title>
        <GameCanvas containerRef={props.myRef}  />
    </S.Container>
  )
}

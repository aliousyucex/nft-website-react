import { GameCanvas } from './canvas';
import {S} from './index.styles';


export const Game = (props: {myRef: React.RefObject<HTMLDivElement>}) => {

  if (window.innerWidth < 1200) {
    return (<S.Container>
      You need bigger screen to play the game.
    </S.Container>);
  }

  return (
    <S.Container>
        <GameCanvas containerRef={props.myRef}  />
    </S.Container>
  )
}

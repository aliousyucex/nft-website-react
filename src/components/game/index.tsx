import { GameCanvas } from './canvas';
import {S} from './index.styles';
// import two from '../../assets/gameAssets/playertworight.svg';
// import { Flex } from 'antd';


export const Game = () => {

  // return (
  //     <S.ComingSoonContainer>
  //       <S.ComingSoon align="center" justify="center" vertical>
  //         COMING SOON...
  //         <Flex gap={32}>
  //           <S.Loading>
  //             <img src={two} />
  //           </S.Loading>
  //           <S.Loading>
  //             <img src={two} />
  //           </S.Loading>
  //           <S.Loading>
  //             <img src={two} />
  //           </S.Loading>

  //         </Flex>
  //       </S.ComingSoon>
  //     </S.ComingSoonContainer>
  //   )

  if (window.innerWidth < 1350) {
    return (<S.Container>
      You need bigger screen to play the game.
    </S.Container>);
  }

  return (
    <S.Container>
        <GameCanvas />
    </S.Container>
  )
}

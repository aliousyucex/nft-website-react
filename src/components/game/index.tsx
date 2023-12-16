import react, {useState} from 'react';
import {GameMenu} from './gameMenu';
import {GameCanvas} from './canvas';
import {S} from './index.styles';


export const Game = () => {

  return (
    <S.Container>
        <GameMenu />
        <GameCanvas />
    </S.Container>
  )
}

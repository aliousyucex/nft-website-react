import {useState} from 'react';
import {S} from './index.styles';

const COUNTDOWN_DATE = '30 Nov 2024';

export const Countdown = () => {
  const [totalSeconds, setTotalSeconds] = useState(
    (new Date(COUNTDOWN_DATE).getTime() - Date.now()) / 1000
  );

  setInterval(() => {
    setTotalSeconds((new Date(COUNTDOWN_DATE).getTime() - Date.now()) / 1000);
  }, 1000);

  return (
    <S.Main>
        <S.FlexContainer wrap="wrap" justify="center">
          <S.CountDownComponentContainer>
            <S.CountDown>{Math.floor(totalSeconds / 3600 / 24)}</S.CountDown>
            <S.CountDownSub>DAYS</S.CountDownSub>
          </S.CountDownComponentContainer>
          <S.CountDownComponentContainer>
            <S.CountDown>{Math.floor(totalSeconds / 3600) % 24}</S.CountDown>
            <S.CountDownSub>HOURS</S.CountDownSub>
          </S.CountDownComponentContainer>
          <S.CountDownComponentContainer>
            <S.CountDown>{Math.floor(totalSeconds / 60) % 60}</S.CountDown>
            <S.CountDownSub>MINUTES</S.CountDownSub>
          </S.CountDownComponentContainer>
          <S.CountDownComponentContainer>
            <S.CountDown>{Math.floor(totalSeconds) % 60}</S.CountDown>
            <S.CountDownSub>SECONDS</S.CountDownSub>
          </S.CountDownComponentContainer>
        </S.FlexContainer>
    </S.Main>
  )
}

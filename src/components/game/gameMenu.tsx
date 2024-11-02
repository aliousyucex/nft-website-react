import { Col, Flex, Space } from 'antd';
import { PlayerSelection } from './playerSelection';
import { S } from './gameMenu.styles';

import wButton from '../../assets/gameAssets/keys/w.png'
import aButton from '../../assets/gameAssets/keys/a.png'
import sButton from '../../assets/gameAssets/keys/s.png'
import dButton from '../../assets/gameAssets/keys/d.png'


export const GameMenu = (props: {
  score?: string,
  open: boolean,
  onStartClicked: () => void,
  onPlayerOptionChanged: (value: number) => void,
  defaultChecked: number,
}) => {

  if (props.open === false) {
    return null;
  }

  return (
    <S.Container>
      <Space direction="horizontal" size={156}>
        {/********/}
        {/* LEFT */}
        {/********/}
        <S.Cards>
          <Flex align="center" justify="center" vertical gap={24}>
            <S.CardTitle>How To Play</S.CardTitle>
            <S.KeyRow gutter={36}>
              <Col xs={6}><S.KeyImg src={wButton} /></Col>
              <Col xs={6}><S.KeyImg src={aButton} /></Col>
              <Col xs={6}><S.KeyImg src={sButton} /></Col>
              <Col xs={6}><S.KeyImg src={dButton} /></Col>
              <Col xs={6}><S.KeyLabel>Jump</S.KeyLabel></Col>
              <Col xs={6}><S.KeyLabel>Left</S.KeyLabel></Col>
              <Col xs={6}><S.KeyLabel>Down</S.KeyLabel></Col>
              <Col xs={6}><S.KeyLabel>Right</S.KeyLabel></Col>
            </S.KeyRow>
            <S.Description>
              Try collect all peanuts in shortest time! We are believe you!
            </S.Description>
          </Flex>
        </S.Cards>

        {/**********/}
        {/* MIDDLE */}
        {/**********/}
        <S.Cards>
          <Flex vertical align="center" gap={48}>

            <S.ScoreLabel>{props.score || '00:00:00'}</S.ScoreLabel>

            <PlayerSelection defaultChecked={props.defaultChecked} onPlayerOptionChanged={(newPlayer) => props.onPlayerOptionChanged(newPlayer)} />
            <S.StartButton onClick={props.onStartClicked}>
              START GAME
            </S.StartButton>
          </Flex>
        </S.Cards>

        {/*********/}
        {/* RIGHT */}
        {/*********/}
        <S.Cards>
          <Flex align="center" justify="center" vertical gap={12}>
            <S.CardTitle>
              How To Earn
            </S.CardTitle>
            <S.Description>
              Use all your strength to collect the peanuts as soon as possible!<br />
            </S.Description>
            <S.Description>
              After that share your score with us on Discord!<br />
            </S.Description>
          </Flex>
        </S.Cards>
      </Space>
    </S.Container>
  )
}

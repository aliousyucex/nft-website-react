import { S } from './gameMenu.styles';
import playerOption1 from '../../assets/gameAssets/playeroneleft.svg'
import playerOption2 from '../../assets/gameAssets/playertwoleft.svg'
import playerOption3 from '../../assets/gameAssets/playerthreeleft.svg'
import { Flex } from 'antd';

export const PlayerSelection = (props: {onPlayerOptionChanged: (value: number) => void, defaultChecked: number }) => {
  return (
    <Flex gap={12}>
      <S.OptionLabel>
        <S.RadioButton
          onClick={() => props.onPlayerOptionChanged(0)}
          type="radio"
          name="player1"
          value="0"
          defaultChecked={props.defaultChecked === 0}
        />
        <S.PlayerOption src={playerOption1} />
      </S.OptionLabel>
      <S.OptionLabel>
        <S.RadioButton
          onClick={() => props.onPlayerOptionChanged(1)}
          type="radio"
          name="player1"
          value="1"
          defaultChecked={props.defaultChecked === 1}
        />
        <S.PlayerOption src={playerOption2} />
      </S.OptionLabel>
      <S.OptionLabel>
        <S.RadioButton
          onClick={() => props.onPlayerOptionChanged(2)}
          type="radio"
          name="player1"
          value="2"
          defaultChecked={props.defaultChecked === 2}
        />
        <S.PlayerOption src={playerOption3} />
      </S.OptionLabel>
    </Flex>
  )
}

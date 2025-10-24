import {Space} from 'antd';
import Discord from '../../assets/social-media-small/discord.svg';
import Twitter from '../../assets/social-media-small/twitter.svg';
import {S} from './footerEnd.styles';

export const FooterEnd = () => {
  return (
    <S.FooterEndContainer>
      <S.Text>All rights reserved © 2024.</S.Text>
      <Space size={36}>
        <a target='_blank' aria-label='Twitter' href='https://x.com/ivorynfts' rel='noreferrer'>
          <img src={Twitter} width={16} alt='Twitter' />
        </a>
        <a
          target='_blank'
          aria-label='Discord'
          href='https://discord.gg/RMvaFAbFtA'
          rel='noreferrer'
        >
          <img src={Discord} width={16} alt='Discord' />
        </a>
      </Space>
    </S.FooterEndContainer>
  );
};

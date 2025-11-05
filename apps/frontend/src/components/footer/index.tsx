import {FooterEnd} from './footerEnd';
import {S} from './index.styles';

export const Footer = () => {
  return (
    <S.FooterContainer>
      <S.FooterInnerContainer>
        <S.ContextContainer> </S.ContextContainer>
        <FooterEnd />
      </S.FooterInnerContainer>
    </S.FooterContainer>
  );
};

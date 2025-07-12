import {S} from './index.styles';
import { FooterEnd } from './footerEnd';

export const Footer = () => {

    return (
        <S.FooterContainer>
            <S.FooterInnerContainer>
                <S.ContextContainer>
                </S.ContextContainer>
                <FooterEnd />
            </S.FooterInnerContainer>
        </S.FooterContainer>
    )
};

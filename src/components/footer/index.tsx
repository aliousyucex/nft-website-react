import {S} from './index.styles';
import {Banner} from './banner';
import Logo from '../../assets/logo.png';
import { FooterEnd } from './footerEnd';

export const Footer = () => {

    return (
        <S.FooterContainer>
            <S.FooterInnerContainer>
                <Banner />
                <S.ContextContainer>
                </S.ContextContainer>
                <FooterEnd />
            </S.FooterInnerContainer>
        </S.FooterContainer>
    )
};

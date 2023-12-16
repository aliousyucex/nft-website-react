import {S} from './index.styles';
import {Banner} from './banner';
import Logo from '../../assets/logo.png';
import { FooterEnd } from './footerEnd';

export const Footer = () => {
    console.log('Banner');

    return (
        <S.FooterContainer>
            <S.FooterInnerContainer>
                <Banner />
                <S.ContextContainer>
                    <S.LogoContainer direction="vertical" >
                        <S.Logo src={Logo} onClick={() => scrollTo({behavior: 'smooth', top: 0})} />
                        NFT project at Opensea with ERC721A
                    </S.LogoContainer>
                    <S.CompanyContainer direction="vertical">
                        <S.Header>COMPANY</S.Header>
                        <S.Link>Contact Us</S.Link>
                        <S.Link>Partner</S.Link>
                    </S.CompanyContainer>
                </S.ContextContainer>
                <FooterEnd />
            </S.FooterInnerContainer>
        </S.FooterContainer>
    )
};

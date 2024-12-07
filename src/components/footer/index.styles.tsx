import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';
import { Space } from 'antd';

export namespace S {
    export const FooterContainer = styled.div`
        display: flex;
        justify-content: center;

        margin-top: 100px;

        width: 100%;

        background: #F6DFB6;
        border-radius: 0;
    `;

    export const FooterInnerContainer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        width: 1150px;

        @media (max-width: 1400px) {
            width: 92%px;
            align-items: center;
        }
    `;

    export const ContextContainer = styled.div`
        display: flex;
        width: 1150px;
        justify-content: space-between;

        height: 32px;

        @media (max-width: 1400px) {
            width: 85%;
        }
    `;

    export const LogoContainer = styled(Space)`
        display: flex;

        align-items: flex-start;
        justify-content: left;
        gap: 12px;
        color: #faf2e3;
    `;

    export const CompanyContainer = styled(Space)`
        display: flex;
        align-items: flex-start;
        justify-content: left;

        gap: 12px;
        color: #faf2e3;

        padding-right: 25px;
    `;

    export const Logo = styled.img`
        cursor: pointer;
        width: 200px;
    `;

    export const Header = styled.span`
        font-family: 'Bakbak One', sans-serif;
        font-weight: bold;
        color: #faf2e3;
    `;

    export const Link = styled.a`
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        color: #F6DFB6;
        text-decoration: none;

        :hover {
            color: #f1f3f5;
        }
    `;
}

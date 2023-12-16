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

        background: #141B22;
        border-radius: 8px;
    `;

    export const FooterInnerContainer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        width: 1150px;
    `;

    export const ContextContainer = styled.div`
        display: flex;
        width: 1150px;
        justify-content: space-between;

        margin-top: 50px;
        height: 200px;
    `;

    export const LogoContainer = styled(Space)`
        display: flex;

        align-items: flex-start;
        justify-content: left;
        gap: 12px;
        color: #fff;
    `;

    export const CompanyContainer = styled(Space)`
        display: flex;
        align-items: flex-start;
        justify-content: left;

        gap: 12px;
        color: #fff;

        padding-right: 25px;
    `;

    export const Logo = styled.img`
        cursor: pointer;
        width: 200px;
    `;

    export const Header = styled.span`
        font-family: 'Bakbak One', sans-serif;
        font-weight: bold;
        color: #fff;
    `;

    export const Link = styled.a`
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        color: #C2C3C5;
        text-decoration: none;

        :hover {
            color: #f1f3f5;
        }
    `;
}

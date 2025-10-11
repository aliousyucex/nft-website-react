import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';
import blackPeanut from '../../assets/manifest/peanut.png';
import { Flex } from 'antd';

export namespace S {
    export const Container = styled(Flex)`
        display: flex;
        justify-content: center;
        font-family: 'Bakbak One', sans-serif;
        border-radius: 8px;

        margin-top: 500px;

        width: 1150px;
        padding: 34px;

        background: #ccc5b9;
        scroll-margin-top: 125px;

        @media (max-width: 1200px) {
            width: 85%;
            margin-top: 340px;
        }
    `;

    export const ModalTitle = styled.h1`
        color: #401414;
        @media (max-width: 1200px) {
            font-size: 32px;
        }
    `;

    export const SubTitles = styled.strong`
       font-family: 'Bakbak One', sans-serif;
       font-size: 24px;
       color: #401414;
    `;

    export const Text = styled.p`
        font-family: 'Poppins', sans-serif;
        font-size: 18px;
        line-height: 28px;
        color: #292826;
    `;

    export const Li = styled.li`
        font-family: 'Poppins', sans-serif;
        margin: 0 0 12px 0;
        font-size: 18px;
        color: #292826;
    `;

    export const Ul = styled.ul`
      list-style-image: url(${blackPeanut});
    `;
}

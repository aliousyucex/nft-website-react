import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';
import {Flex} from 'antd';

export namespace S {
  export const Container = styled.div`
        font-family: 'DynaPuff Variable', system-ui;
        max-width: 1400px;
    `;

  export const stroyImg = styled.img`
        max-width: 400px;

        @media (max-width: 1200px) {
            width: 100%;
        }

        @media (max-width: 750px) {
            margin: 12px 0;
        }
    `;

  export const Text = styled.p`
        font-family: 'DynaPuff Variable', system-ui;
        font-size: 18px;
        line-height: 28px;
        color: #292826;
        margin-bottom: 16px;

        @media (max-width: 750px) {
            font-size: 16px;
            line-height: 26px;
            margin-bottom: 20px;
        }
    `;

  export const PuncLines = styled.strong`

    `;

  export const Li = styled.li`
        margin: 0 0 12px 0;
    `;

  export const ModalTitle = styled.h1`
        color: black;
        font-family: 'Londrina Solid', system-ui;
        margin-bottom: 24px;

        @media (max-width: 1200px) {
            font-size: 32px;
        }

        @media (max-width: 750px) {
            font-size: 28px;
            margin-bottom: 20px;
        }
    `;

  export const Title = styled.h1`
        display: flex;
        justify-content: center;

        font-size: 36px;

        color: #faf2e3;
    `;

  export const InnerContainer = styled(Flex)`
        padding: 36px;

        @media (max-width: 750px) {
            padding: 20px 16px;
        }
    `;
}

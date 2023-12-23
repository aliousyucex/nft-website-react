import styled from '@emotion/styled';
import {Collapse as Cll} from 'antd';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';

export namespace S {
    export const CollapseContainer = styled.div`
        margin-top: 100px;

        scroll-margin-top: 100px;
        padding-bottom: 200px;
    `;

    export const Title = styled.h1`
        display: flex;
        justify-content: center;

        font-family: 'Bakbak One', sans-serif;
        font-size: 36px;

        color: #fff;
    `;

    export const Collapse = styled(Cll)`
        .ant-collapse-item{
            width: 1150px;
            border: none;
            border-radius: 0;
        }

        .ant-collapse-header {
            font-family: 'Bakbak One', sans-serif;
            font-size: 24px;

            color: #fff !important;
            padding: 18px !important;
            border-radius: 0;

        }

        .ant-collapse-expand-icon {
            color: #21E786;
            height: 38px !important;
        }

        .ant-collapse-arrow {
            font-size: 24px !important;
        }

        .ant-collapse-content-box {
            padding: 12px;
            font-family: 'Poppins', sans-serif;
            font-weight: 400;
            font-size: 18px;

            color: #BDC3C5;
            line-height: 28px;
            align-self: stretch;
            text-align: justify;

            background-color: #141B22;

            border-top: 1px solid rgba(204, 204, 204, 0.25);
        }
    `as unknown as typeof Cll;

    export const DiscordLink = styled.a`
        color: #fff;
        text-decoration: none;

        :hover {
            color: #3841AA;
        }
    `;

    export const P = styled.p`
        padding-left: 36px;
    `;
}

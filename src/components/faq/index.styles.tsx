import styled from '@emotion/styled';
import {Collapse as Cll} from 'antd';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';

export namespace S {
    export const CollapseContainer = styled.div`
        margin-top: 100px;
        width: 1150px;

        scroll-margin-top: 100px;

        @media (max-width: 1200px) {
            width: 85%;
        }
    `;

    export const Title = styled.h1`
        display: flex;
        justify-content: center;

        font-family: 'Bakbak One', sans-serif;
        font-size: 36px;

        color: #faf2e3;
    `;

    export const Collapse = styled(Cll)`
        .ant-collapse-item{
            width: 100%;
            background: #ccc5b9;
            border-radius: 8px !important;
        }

        .ant-collapse-header {
            font-family: 'Bakbak One', sans-serif;
            font-size: 24px;

            color: #401414 !important;
            padding: 18px !important;

            @media (max-width: 1200px) {
                display: flex;
                font-size: 20px;
                line-height: inherit;
                align-items: center !important;
            }

        }

        .ant-collapse-expand-icon {
            color: #292826;
            height: 38px !important;
        }

        .ant-collapse-arrow {
            font-size: 24px !important;
            align-items: center;
        }

        .ant-collapse-content-box {
            padding: 12px;
            font-family: 'Poppins', sans-serif;
            font-weight: 400;
            font-size: 18px;

            color: #292826;
            line-height: 28px;
            align-self: stretch;
            text-align: justify;

            background-color: #ccc5b9;

            border-top: 2px solid #292826;
            border-radius: 0 0 8px 8px !important;

            @media (max-width: 1200px) {
                font-size: 14px;
                line-height: inherit;
            }
        }
    `as unknown as typeof Cll;

    export const DiscordLink = styled.a`
        color: #292826;
        text-decoration: none;

        :hover {
            color: #3841AA;
        }
    `;

    export const P = styled.p`
        padding-left: 36px;
        text-align: left;

        @media (max-width: 1200px) {
            padding-left: 12px;
        }
    `;
}

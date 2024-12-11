import styled from '@emotion/styled';
import {Collapse as Cll} from 'antd';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';
import '@fontsource-variable/dynapuff';
export namespace S {
    export const CollapseContainer = styled.div`
        margin: 140px 0 70px 0;
        width: 1150px;
        z-index: 1;

        scroll-margin-top: 100px;

        @media (max-width: 1400px) {
            width: 900px;
        }

        @media (max-width: 1200px) {
            width: 750px;
        }

        @media (max-width: 1000px) {
            width: 650px;
        }

        @media (max-width: 700px) {
            width: 500px;
        }

        @media (max-width: 550px) {
            width: 350px;
        }
    `;

    export const Collapse = styled(Cll)`
        .ant-collapse-item{
            width: 100%;
            background: #FEF0D3;
            border-radius: 8px !important;
        }

        .ant-collapse-header {
            font-family: 'DynaPuff Variable', system-ui;
            font-size: 24px;

            color: #000 !important;

            @media (max-width: 1350px) {
                display: flex;
                font-size: 16px;
                line-height: inherit;
                align-items: center !important;
            }

        }

        .ant-collapse-expand-icon {
            color: #000;
            height: 38px !important;
        }

        .ant-collapse-arrow {
            font-size: 16px !important;
            align-items: center;
        }

        .ant-collapse-content-box {
            font-family: 'DynaPuff Variable', system-ui;
            font-weight: 400;
            font-size: 14px;

            color: #000;
            line-height: 28px;
            align-self: stretch;
            text-align: justify;

            background-color: #FEF0D3;

            border-top: 2px solid #00000099;
            border-radius: 0 0 8px 8px !important;

            @media (max-width: 1200px) {
                font-size: 12px;
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
        font-family: 'DynaPuff Variable', system-ui;

        @media (max-width: 1200px) {
            padding-left: 12px;
        }
    `;
}

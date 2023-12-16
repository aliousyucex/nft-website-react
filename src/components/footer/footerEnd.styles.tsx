import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';

export namespace S {
    export const FooterEndContainer = styled.div`
        display: flex;
        align-items: flex-end;
        justify-content: space-between;

        width: 100%;

        border-top: 1px solid #999;
        padding: 12px 0;
    `;

    export const Text = styled.span`
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
    `;
}

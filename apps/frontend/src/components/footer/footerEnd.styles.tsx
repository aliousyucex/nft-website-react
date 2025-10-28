import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';

export namespace S {
  export const FooterEndContainer = styled.div`
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        background: #F6DFB6;
        color: #401414;

        border-top: 1px solid #401414;
        padding: 12px 0;

        width: 1151px;

        @media (max-width: 1400px) {
            display: none;
        }
    `;

  export const Text = styled.span`
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
    `;
}

import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';

export namespace S {
  export const Team = styled.div`
        margin-top: 100px;

        scroll-margin-top: 150px;
    `;

  export const Img = styled.img`
        width: 320px;
        padding-left: 15px;

        @media (max-width: 1100px) {
            width: 160px;
        }
    `;
}

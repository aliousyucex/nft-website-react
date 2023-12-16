import styled from '@emotion/styled';
import '@fontsource/bakbak-one';

export namespace S {
  export const CoverCard = styled.a`
    display: flex;
    justify-content: center;
    align-items: flex;
    width: 60px;
    height: 60px;

    background: rgba(194, 195, 197, 0.1);

    :hover {
      background: rgba(194, 195, 197, 0.25);
    }
  `;

  export const Img = styled.img`
    width: 32px;
  `;

  export const H1 = styled.h1`
    color: #21E786;;
    font-family: 'Bakbak One', sans-serif;
    font-size: 44px;
    letter-spacing: 0.5em;
  `;
}

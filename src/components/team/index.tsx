import { Flex } from "antd";
import { S } from "./index.styles";

import freyr from "../../assets/OurTeam/freyr.png";
import ravena from "../../assets/OurTeam/ravena.png";
import berizu from "../../assets/OurTeam/berizu.png";

export const Team = (props: { myRef: React.RefObject<HTMLDivElement> }) => (
    <S.Team ref={props.myRef}>
        <Flex wrap="wrap" justify="center" align="center" gap={24}>
            <S.Img src={berizu} />
            <S.Img src={freyr} />
            <S.Img src={ravena} />
        </Flex>
    </S.Team>
);

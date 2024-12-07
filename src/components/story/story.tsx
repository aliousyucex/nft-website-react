import { S } from "./story.styles";

export const Story = (props: {
    myRef: React.RefObject<HTMLDivElement>;
    pageWidth: number;
}) => {
    return (
        <S.Container ref={props.myRef} wrap="wrap" justify="center" gap={54}>
            <S.Card>
            </S.Card>
        </S.Container>
    );
};

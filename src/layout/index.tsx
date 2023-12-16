import react from 'react';
import { S } from './index.styles';

type LayoutProps = {
    children: React.ReactNode
}

export const Layout = (props: LayoutProps) => {
    return <S.Layout>{props.children}</S.Layout>;
};

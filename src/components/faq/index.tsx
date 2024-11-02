import { Collapse, ConfigProvider, CollapsePanelProps, Space } from 'antd';
import { S } from './index.styles';

export const FAQ = (props: { myRef: React.RefObject<HTMLDivElement> }) => {
    const items: CollapsePanelProps[] = [
        {
            key: 1,
            header: 'Why Elephant?',
            children: <S.P>We aim to raise awareness about the "Elephant Tusks" genocide in today's conditions and
                enable
                more
                people to have information about it.</S.P>,
        },
        {
            key: 2,
            header: 'What are the maximum mint per wallet?',
            children: <S.P>
                        1 mint per OG wallet, and 2 mints per other phases wallet.
            </S.P>,
        },
        {
            key: 3,
            header: 'Do you have giveaway?',
            children: <S.P>You can join our <S.DiscordLink
                href="https://discord.gg/ivorynfts" target="_blank"> Discord </S.DiscordLink>
                channel to
                learn how to win these
                giveaway
                NFTs, which will
                be limited only.</S.P>,
        },
        {
            key: 4,
            header: 'How can I get Whitelist?',
            children: <S.P>You can access the details on our
                <S.DiscordLink href="https://discord.gg/ivorynfts" target="_blank"> Discord </S.DiscordLink>
                channel.</S.P>,
        },
    ];

    return (
        <S.CollapseContainer ref={props.myRef} >
            <S.Title>FAQ</S.Title>
            <ConfigProvider
                theme={{
                    components: {
                        Collapse: {
                            headerBg: '#141B22',
                        },
                    },
                }}
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    {items.map((item, index) => (
                        <S.Collapse key={index} accordion bordered={false}>
                            <Collapse.Panel key={item.key} header={item.header}>{item.children}</Collapse.Panel>
                        </S.Collapse>
                    ))}
                </Space>

            </ConfigProvider>
        </S.CollapseContainer>
    )
}

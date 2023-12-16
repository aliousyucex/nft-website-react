import React from 'react';
import { Collapse, CollapseProps, ConfigProvider } from 'antd';
import { S } from './index.styles';

export const FAQ = () => {
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Why Elephant?',
            children: <S.P>We aim to raise awareness about the "Elephant Tusks" genocide in today's conditions and
                enable
                more
                people to have information about it.</S.P>,
        },
        {
            key: '2',
            label: 'What are the maximum mint per wallet?',
            children: <S.P>20 mints per wallet is allowed.</S.P>,
        },
        {
            key: '3',
            label: 'Do you have giveaway?',
            children: <S.P>NFT will be given as a gift in the DEMO version of the game. You can join our <S.DiscordLink
                href="https://discord.com/invite/HU4tGjJzJb" target="_blank">Discord</S.DiscordLink>
                channel to
                learn how to win these
                giveaway
                NFTs, which will
                be limited only.</S.P>,
        },
        {
            key: '4',
            label: 'How can I get Whitelist?',
            children: <S.P>You can access the details on our
                <S.DiscordLink href="https://discord.gg/HU4tGjJzJb" target="_blank"> Discord </S.DiscordLink>
                channel.</S.P>,
        },
        {
            key: '5',
            label: 'NFT mint prices?',
            children: <S.P>Prices for WhiteList 0.65 ETH <br /> Prices for public 1 ETH</S.P>,
        },
        {
            key: '6',
            label: 'Why should I buy your NFTs?',
            children: <S.P>With the leasing mechanics, you will be able to earn a side income from your NFTs.</S.P>,
        },
    ];

    return (
        <S.CollapseContainer>
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
                <S.Collapse accordion items={items} bordered={false} />
            </ConfigProvider>
        </S.CollapseContainer>
    )
}

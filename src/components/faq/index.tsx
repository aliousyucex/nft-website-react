import { Collapse, ConfigProvider, CollapsePanelProps, Space } from "antd";
import { S } from "./index.styles";

export const FAQ = (props: { myRef: React.RefObject<HTMLDivElement> }) => {
    const items: CollapsePanelProps[] = [
        {
            key: 1,
            header: "Why did we choose the elephant?",
            children: (
                <S.P>
                    We chose an elephant to highlight what’s often
                    overlooked—stories of animals that aren't as visible in
                    popular culture. We aim to bring attention to the tragic
                    reality elephants face.
                </S.P>
            ),
        },
        {
            key: 2,
            header: "What blockchain was the Ivory Collection built on?",
            children: (
                <S.P>
                    The Ivory NFT Collection is built on Apechain and offers a
                    secure, scalable infrastructure. Transactions will be
                    processed in $APE, Apechain's native currency.
                </S.P>
            ),
        },
        {
            key: 3,
            header: "How many NFTs will be produced and what will be the minting price?",
            children: (
                <S.P>
                    The collection will consist of 6,666 NFTs in total. Minting
                    price and details will be announced in our official
                    announcements.
                </S.P>
            ),
        },
        {
            key: 4,
            header: "Where can I find the most up-to-date information about the project?",
            children: (
                <S.P>
                    Follow our Twitter account and join our Discord server for
                    the latest announcements, previews, and community events.
                </S.P>
            ),
        },
        {
            key: 5,
            header: "How many NFTs can I mint per wallet?",
            children: <S.P>Each wallet can mint a maximum of 6 NFTs.</S.P>,
        },
        {
            key: 6,
            header: "How can I earn Whitelist?",
            children: (
                <S.P>
                    A limited number of whitelist opportunities will be
                    available for early backers and active community members. By
                    joining our Discord server, you can participate in events,
                    complete tasks, and get a chance to win a whitelist by
                    following special announcements on Twitter.
                </S.P>
            ),
        },
    ];

    return (
        <S.CollapseContainer ref={props.myRef}>
            <S.Title>FAQ</S.Title>
            <ConfigProvider
                theme={{
                    components: {
                        Collapse: {
                            headerBg: "#141B22",
                        },
                    },
                }}
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    {items.map((item, index) => (
                        <S.Collapse key={index} accordion bordered={false}>
                            <Collapse.Panel key={item.key} header={item.header}>
                                {item.children}
                            </Collapse.Panel>
                        </S.Collapse>
                    ))}
                </Space>
            </ConfigProvider>
        </S.CollapseContainer>
    );
};

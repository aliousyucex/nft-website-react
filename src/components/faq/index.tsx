import { Collapse, ConfigProvider, CollapsePanelProps, Space } from "antd";
import { S } from "./index.styles";

export const FAQ = (props: { myRef: React.RefObject<HTMLDivElement> }) => {
    const items: CollapsePanelProps[] = [
        {
            key: 1,
            header: "Why Elephant?",
            children: (
                <S.P>
                    We chose an elephant because it embodies the tragic reality
                    of being hunted for the value of its ivory. Elephants are
                    often victims of brutal poaching, targeted solely for their
                    tusks, leading to a silent form of genocide driven by human
                    greed. Through the story of Toothless, who survives because
                    he lacks tusks, we aim to raise awareness of this cruel
                    reality and challenge the perception that a life’s worth is
                    tied to material gain. Our project highlights the urgent
                    need for conservation while reminding us that no creature
                    should be sacrificed for profit.
                </S.P>
            ),
        },
        {
            key: 2,
            header: "What are the maximum mint per wallet?",
            children: (
                <S.P>
                    1 mint per OG wallet, and 2 mints per other phases wallet.
                </S.P>
            ),
        },
        {
            key: 4,
            header: "How can I get Whitelist?",
            children: (
                <S.P>
                    You can access the details on our
                    <S.DiscordLink
                        href="https://discord.gg/ivorynfts"
                        target="_blank"
                    >
                        {" "}
                        Discord{" "}
                    </S.DiscordLink>
                    channel.
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

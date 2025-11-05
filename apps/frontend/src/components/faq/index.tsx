import {Collapse, type CollapsePanelProps, ConfigProvider, Space} from 'antd';
import {S} from './index.styles';

export const FAQ = (props: {myRef: React.RefObject<HTMLDivElement>}) => {
  const items: CollapsePanelProps[] = [
    {
      key: 1,
      header: 'Where can I find the most up-to-date information about the project?',
      children: (
        <S.P>
          Follow our Twitter account for the latest announcements,
          previews, and community events.
        </S.P>
      ),
    },
    {
      key: 2,
      header: 'How many NFTs can I mint per wallet?',
      children: <S.P>Each wallet can mint a maximum of 6 NFTs.</S.P>,
    },
    {
      key: 3,
      header: 'How can I earn Whitelist?',
      children: (
        <S.P>
          A limited number of whitelist opportunities will be available for early backers and active
          community members. Get a chance to win a whitelist by following special announcements on Twitter.
        </S.P>
      ),
    },
  ];

  return (
    <S.CollapseContainer ref={props.myRef} id='faq'>
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              headerBg: '#141B22',
            },
          },
        }}
      >
        <Space direction='vertical' style={{width: '100%'}}>
          {items.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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

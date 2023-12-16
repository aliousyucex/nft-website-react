import {S} from './footerEnd.styles';
import {Space} from 'antd';
import Twitter from '../../assets/social-media-small/twitter.png';
import Discord from '../../assets/social-media-small/discord.png';
import Medium from '../../assets/social-media-small/medium.png';
import Linkedin from '../../assets/social-media-small/linkedin.png';
import Reddit from '../../assets/social-media-small/reddit.png';

export const FooterEnd = () => {
    console.log('Banner');

    return (
        <S.FooterEndContainer>
            <S.Text>All rights reversed © 2022 EYC. Elephant Yacht Club</S.Text>
            <Space size={36}>
                <a target="_blank" href="https://twitter.com/"><img src={Twitter} /></a>
                <a target="_blank" href="https://discord.com/"><img src={Discord} /></a>
                <a target="_blank" href="https://medium.com/"><img src={Medium} /></a>
                <a target="_blank" href="https://www.linkedin.com/feed/"><img src={Linkedin} /></a>
                <a target="_blank" href="https://www.reddit.com/"><img src={Reddit} /></a>
            </Space>
        </S.FooterEndContainer>
    )
};

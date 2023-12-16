import {S} from './banner.styles';

export const Banner = () => {
    console.log('Banner');

    return (
        <S.BannerContainer>
            <S.ItemContainer>
                <S.Title>JOIN OUR COMMUNITY</S.Title>
                <div>
                    <S.Text>You can be aware of whitelists and airdrops by following us on social media and joining our discord channel.</S.Text>
                    <S.ButtonContainer>
                        <S.DiscordButton>Discord</S.DiscordButton>
                        <S.BaskaButton>Whitelist</S.BaskaButton>
                    </S.ButtonContainer>
                </div>
            </S.ItemContainer>
        </S.BannerContainer>
    )
};

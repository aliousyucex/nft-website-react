import {S} from './banner.styles';

export const Banner = () => {

    return (
        <S.BannerContainer>
            <S.ItemContainer>
                <S.Title>JOIN OUR COMMUNITY</S.Title>
                <div>
                    <S.Text>You can be aware of whitelists and airdrops by following us on social media and joining our discord channel.</S.Text>
                    <S.ButtonContainer>
                        <S.DiscordButton onClick={() => window.open('https://discord.gg/ivorynfts')}>Discord</S.DiscordButton>
                    </S.ButtonContainer>
                </div>
            </S.ItemContainer>
        </S.BannerContainer>
    )
};

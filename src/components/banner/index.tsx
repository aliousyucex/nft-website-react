import {S} from './index.styles';

export const Banner = (props: {pageWidth: number}) => {

    return (
        <S.BannerContainer>
            <S.ItemContainer>
                <S.Title>JOIN OUR TRIBE</S.Title>
                <div>
                    {props.pageWidth >= 1200 && <S.Text>You can be aware of whitelists and airdrops by following us on social media and joining our discord channel.</S.Text>}
                    <S.ButtonContainer>
                        <S.DiscordButton onClick={() => window.open('https://discord.gg/ivorynfts')}>Discord</S.DiscordButton>
                    </S.ButtonContainer>
                </div>
            </S.ItemContainer>
        </S.BannerContainer>
    )
};

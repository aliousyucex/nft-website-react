import { Col, Flex, Skeleton } from "antd";
import { PlayerSelection } from "./playerSelection";
import { S } from "./gameMenu.styles";

import wButton from "../../assets/gameAssets/keys/w.png";
import aButton from "../../assets/gameAssets/keys/a.png";
import sButton from "../../assets/gameAssets/keys/s.png";
import dButton from "../../assets/gameAssets/keys/d.png";
import { useAsync } from "react-use";

export const GameMenu = (props: {
  score?: string;
  onStartClicked: () => void;
  onPlayerOptionChanged: (value: number) => void;
  defaultChecked: number;
  wallet: string;
}) => {
  const { loading, value: leaderBoard } = useAsync(async () => {
    try {
      const rawResponse = await fetch("getscores.php");
      const response = await rawResponse.json();

      const sortedResponse = response.sort(
        (a: any, b: any) =>
          parseInt(a.score.replace(":", "")) -
          parseInt(b.score.replace(":", "")),
      );

      return sortedResponse.length <= 5
        ? sortedResponse
        : sortedResponse.slice(0, 5);
    } catch (err) {
      console.error("Could not fetch leaderboard data", err);
    }
  }, []);

  const fontSize = ["18px", "17px", "16px", "14px", "14px"];

  const colors = ["#9da562", "#9966cc", "#d36e4a", "#2F2826", "#2F2826"];

  return (
    <S.Container>
      <Flex align="center" justify="center" gap={156}>
        {/********/}
        {/* LEFT */}
        {/********/}
        {window.innerWidth > 1400 && (
          <S.Cards>
            <Flex align="center" justify="center" vertical gap={24}>
              <S.CardTitle>How To Play</S.CardTitle>
              <S.KeyRow gutter={36}>
                <Col xs={6}>
                  <S.KeyImg src={wButton} />
                </Col>
                <Col xs={6}>
                  <S.KeyImg src={aButton} />
                </Col>
                <Col xs={6}>
                  <S.KeyImg src={sButton} />
                </Col>
                <Col xs={6}>
                  <S.KeyImg src={dButton} />
                </Col>
                <Col xs={6}>
                  <S.KeyLabel>Jump</S.KeyLabel>
                </Col>
                <Col xs={6}>
                  <S.KeyLabel>Left</S.KeyLabel>
                </Col>
                <Col xs={6}>
                  <S.KeyLabel>Down</S.KeyLabel>
                </Col>
                <Col xs={6}>
                  <S.KeyLabel>Right</S.KeyLabel>
                </Col>
              </S.KeyRow>
              <S.Description>
                Try collect all peanuts in shortest time! We believe in you!!
              </S.Description>
            </Flex>
          </S.Cards>
        )}

        {/**********/}
        {/* MIDDLE */}
        {/**********/}
        <S.Cards>
          <Flex vertical align="center" gap={48}>
            <S.ScoreLabel>{props.score || "00:00:00"}</S.ScoreLabel>

            <PlayerSelection
              defaultChecked={props.defaultChecked}
              onPlayerOptionChanged={(newPlayer) =>
                props.onPlayerOptionChanged(newPlayer)
              }
            />

            <S.StartButton onClick={() => props.onStartClicked()}>
              START GAME
            </S.StartButton>
          </Flex>
        </S.Cards>

        {/*********/}
        {/* RIGHT */}
        {/*********/}
        {window.innerWidth > 800 && (
          <S.Cards>
            <Flex align="center" justify="center" vertical>
              <S.LeaderBoard>Leaderboard</S.LeaderBoard>
              {loading || (!leaderBoard && <Skeleton active />)}

              {!loading && leaderBoard && leaderBoard.length === 0 && (
                <Flex style={{marginTop: 24}}>Leaderboard is empty</Flex>
              )}

              {!loading && leaderBoard && leaderBoard.length > 0 && (
                <S.Table>
                  <thead>
                    <tr>
                      <S.Th></S.Th>
                      <S.Th>Score</S.Th>
                      <S.Th>Wallet</S.Th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderBoard.map(
                      (
                        row: { score: string; walletAddress: string },
                        index: number,
                      ) => {
                        return (
                          <tr
                            key={index}
                            style={{
                              fontSize: fontSize[index],
                              color: colors[index],
                              fontWeight: index < 3 ? 600 : 400,
                              border:
                                row.walletAddress === props.wallet
                                  ? "1px dashed red"
                                  : "none",
                            }}
                          >
                            <S.Td
                              style={{
                                textAlign: index < 3 ? "center" : "left",
                              }}
                            >
                              {index === 0 ? (
                                <span style={{ fontSize: 24 }}>🥇</span>
                              ) : index === 1 ? (
                                <span style={{ fontSize: 20 }}>🥈</span>
                              ) : index === 2 ? (
                                <span style={{ fontSize: 18 }}>🥉</span>
                              ) : (
                                <strong style={{ paddingLeft: "14px" }}>
                                  {index + 1}.
                                </strong>
                              )}
                            </S.Td>
                            <S.Td>{row.score}</S.Td>
                            <S.Td>
                              {row.walletAddress.slice(0, 4) +
                                ".." +
                                row.walletAddress.slice(-4)}
                            </S.Td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </S.Table>
              )}
            </Flex>
          </S.Cards>
        )}
      </Flex>
    </S.Container>
  );
};

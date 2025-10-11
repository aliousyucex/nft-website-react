import { S } from "./index.styles";

export const Manifest = (props: { myRef: React.RefObject<HTMLDivElement> }) => {
  return (
    <S.Container vertical ref={props.myRef}>
      <S.ModalTitle style={{ textAlign: "center" }}>
        The Ivory Chronicles Manifesto
      </S.ModalTitle>

      {/* Entering Section */}
      <div>
        <S.SubTitles>We are the Tribe of Toothless.</S.SubTitles>
        <S.Text>
          It is not the ivory tusks but the strength of the spirit and the will
          to survive that makes us valuable. In a world ruled by greed and
          exploitation, we stand as the voice of the silenced and a force for
          change.
        </S.Text>
        <S.Text>
          Our journey began with Toothless, an innocent soul. He discovered the
          harsh truths of a world that chose taking over giving. This story
          belongs not only to Toothless but also to all who have lost, resisted
          and survived. Now, this story is ours.
        </S.Text>
        <S.Text>
          We are here to reclaim the honor of those who can no longer speak, to
          return what was taken, and to create a world where no creature, no
          spirit, is ever exploited for profit.
        </S.Text>
      </div>

      {/* Our Beliefs Section */}
      <div>
        <S.SubTitles>Our Beliefs</S.SubTitles>
        <S.Ul>
          <S.Li>
            Every Life Has Value: <br /> Whether you have ivory tusks or not,
            the value of every life is immeasurable. We stand against a world
            that commodifies life and strips it of its dignity.
          </S.Li>
          <S.Li>
            Unity Is Strength: <br /> Just as Toothless called upon his tribe,
            we call upon our own community. Together, we are stronger; our voice
            is louder, our resilience firmer.
          </S.Li>
          <S.Li>
            Stories Shape the Future: <br /> Toothless’s journey has shown us
            the power of stories to change minds, hearts, and behaviors. We
            believe that art and storytelling can drive meaningful change.
          </S.Li>
          <S.Li>
            Action Over Apathy: <br /> In a world where cruelty has become
            normalized, we refuse to be mere bystanders. Our NFTs are not just
            digital assets; they are symbols of commitment to a better world.
            Each purchase is a step towards protecting the innocent and standing
            against exploitation.
          </S.Li>
        </S.Ul>
      </div>

      {/* Our Mission Section */}
      {/* TODO: Buradaki ul li noktalari costumize edilecek ve simsiyah birer peanut olacak */}
      <div>
        <S.SubTitles>Our Mission</S.SubTitles>
        <S.Ul>
          <S.Li>
            To use the power of NFTs and storytelling to raise awareness about
            the effects of poaching, cruelty, and exploitation.
          </S.Li>
          <S.Li>
            To build a community that stands for compassion, justice, and
            resilience; a space where members collectively shape the story of
            Toothless.
          </S.Li>
          <S.Li>
            To contribute a portion of our proceeds to organizations that
            protect vulnerable species, supporting wildlife conservation efforts
          </S.Li>
          <S.Li>
            To inspire people to look beyond material value and recognize the
            beauty of life in all its forms.
          </S.Li>
        </S.Ul>
      </div>

      {/* Our Call To You Section */}
      <div>
        <S.SubTitles>Our Call to You</S.SubTitles>
        <S.Text>
          This is not just our story; it is yours as well. By joining our tribe,
          you become the guardian of Toothless’s legacy, the voice for the
          silenced, and a fighter for change.
        </S.Text>
        <S.Text>
          Together, we will rewrite the narrative. We will turn pain into
          purpose, and loss into hope.
        </S.Text>
        <S.Text>
          Will you join us on this journey? Will you stand with Toothless and
          the tribe?
        </S.Text>
      </div>
    </S.Container>
  );
};

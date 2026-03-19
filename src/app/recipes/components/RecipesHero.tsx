import s from "../Recipes.module.scss";

export default function RecipesHero() {
  return (
    <section className={s.recipes__hero}>
      <div className={s.recipes__heroOverlay} />
      <div className={s.recipes__heroContent}>
        <h1 className={s.recipes__heroTitle}>Recipes</h1>
        <p className={s.recipes__heroSubtitle}>
          Find the perfect food and drink ideas for every occasion, from
          weeknight dinners to holiday feasts.
        </p>
      </div>
    </section>
  );
}

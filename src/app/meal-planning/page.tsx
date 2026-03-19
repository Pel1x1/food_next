"use client";

import React from 'react';
import { observer } from 'mobx-react-lite';
import Text from '@/shared/components/Text';
import styles from './MealPlanning.module.scss';
import { MealPlanningStoreProvider, useMealPlanningStore } from "@/shared/providers/MealPlanningStoreProvider";
import { motion, AnimatePresence} from 'framer-motion';
import { LuEgg, LuBeef,LuSalad } from 'react-icons/lu';
import {containerVariants, dayVariants, cardVariants, popupVariants, overlayVariants, headerVariants} from "./components/MealPlanningAnimations"

const MEAL_TYPES = [
  { label: 'Breakfast', icon: <LuEgg size={24}/> },
  { label: 'Lunch',     icon: <LuBeef size={24}/>  },
  { label: 'Dinner',    icon: <LuSalad size={24}/> },
] as const;



const MealPlanning: React.FC = () => {
  const store = useMealPlanningStore();
  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    void store.generatePlan();
  };

  return (
    <div className={styles.mealPlanningPage}>
      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <Text view="title" tag="h1">
            Meal planning
          </Text>
          <Text view="p-16">
            Generate a personalised meal plan for a day or a week based on your
            calories, diet and exclusions.
          </Text>
        </motion.header>

        <div className={styles.layout}>
          {/* Левая колонка с формой */}
          <motion.form 
            className={styles.formCard} 
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <div className={styles.fieldGroup}>
              <Text view="p-16" className={styles.fieldLabel}>Time frame</Text>
              <Text view="p-16" className={styles.fieldDescription}>
                Choose if you want a plan for one day or for the whole week.
              </Text>
              <div className={styles.timeFrameToggle}>
                {(['day', 'week'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={`${styles.timeFrameButton} ${store.timeFrame === tf ? styles.timeFrameButtonActive : ''}`}
                    onClick={() => store.setTimeFrame(tf)}
                  >
                    {tf.charAt(0).toUpperCase() + tf.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <Text view="p-16" className={styles.fieldLabel}>Target calories</Text>
              <Text view="p-16" className={styles.fieldDescription}>
                Daily caloric target (e.g. 2000).
              </Text>
              <input
                className={styles.input}
                type="number"
                min={0}
                placeholder="2000"
                value={store.targetCalories}
                onChange={(e) => store.setTargetCalories(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <Text view="p-16" className={styles.fieldLabel}>Diet</Text>
              <Text view="p-16" className={styles.fieldDescription}>
                Optional dietary preference, e.g. "vegetarian", "vegan", "paleo".
              </Text>
              <input
                className={styles.input}
                type="text"
                placeholder="vegetarian"
                value={store.diet}
                onChange={(e) => store.setDiet(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <Text view="p-16" className={styles.fieldLabel}>Exclude ingredients</Text>
              <Text view="p-16" className={styles.fieldDescription}>
                Comma-separated list of ingredients to avoid.
              </Text>
              <textarea
                className={styles.textarea}
                placeholder="shellfish, olives"
                value={store.exclude}
                onChange={(e) => store.setExclude(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={styles.generateButton}
              disabled={store.loadingPlan}
            >
              {store.loadingPlan ? 'Generating plan…' : 'Generate meal plan'}
            </button>

            {store.error && <div className={styles.error}>{store.error}</div>}
          </motion.form>

          {/* Правая колонка с результатами */}
          <div className={styles.content}>
            {store.plan && (
              <>
                <motion.div 
                  className={styles.nutrientsCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {[
                    { label: 'Calories',      value: `${Math.round(store.plan.nutrients.calories)} kcal` },
                    { label: 'Carbohydrates', value: `${Math.round(store.plan.nutrients.carbohydrates)} g` },
                    { label: 'Fat',           value: `${Math.round(store.plan.nutrients.fat)} g` },
                    { label: 'Protein',       value: `${Math.round(store.plan.nutrients.protein)} g` },
                  ].map(({ label, value }) => (
                    <div key={label} className={styles.nutrientItem}>
                      <span className={styles.nutrientLabel}>{label}</span>
                      <span className={styles.nutrientValue}>{value}</span>
                    </div>
                  ))}
                  {store.timeFrame === 'week' && (
                    <p className={styles.nutrientsNote}>avg per day</p>
                  )}
                </motion.div>

                {/* Контейнер для списка дней */}
                <motion.div 
                  className={styles.daysContainer}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {store.plan.days.map((day, dayIdx) => (
                    <motion.div 
                      key={dayIdx} 
                      className={styles.daySection}
                      variants={dayVariants}
                    >
                      {store.timeFrame === 'week' && (
                        <div className={styles.dayHeader}>
                          <Text view="p-20" weight="medium" className={styles.dayName}>
                            {day.dayName}
                          </Text>
                          <div className={styles.dayPills}>
                            <span className={styles.pill}>{Math.round(day.nutrients.calories)} kcal</span>
                            <span className={styles.pill}>{Math.round(day.nutrients.protein)} g protein</span>
                            <span className={styles.pill}>{Math.round(day.nutrients.fat)} g fat</span>
                            <span className={styles.pill}>{Math.round(day.nutrients.carbohydrates)} g carbs</span>
                          </div>
                        </div>
                      )}

                      <div className={styles.mealsList}>
                        {day.meals.map((meal, mealIdx) => {
                          const type = MEAL_TYPES[mealIdx] ?? { label: `Meal ${mealIdx + 1}`, icon: '🍽️' };
                          return (
                            <motion.div
                              key={meal.id}
                              className={styles.mealRow}
                              whileHover={{ 
                                scale: 1.01,
                                transition: { duration: 0.2 } 
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => void store.loadMealInformation(meal.id)}
                            >
                              <div className={styles.mealTypeTag}>
                                <div className={styles.mealTypeIcon}>{type.icon}</div>
                                <span className={styles.mealTypeName}>{type.label}</span>
                              </div>

                              <img
                                className={styles.mealRowImage}
                                src={`https://img.spoonacular.com/recipes/${meal.id}-312x231.${meal.imageType}`}
                                alt={meal.title}
                              />

                              <div className={styles.mealRowInfo}>
                                <p className={styles.mealRowTitle}>{meal.title}</p>
                                <div className={styles.mealRowMeta}>
                                  <span>⏱ {meal.readyInMinutes} min</span>
                                  <span>🍽 {meal.servings} servings</span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}

            {!store.plan && !store.loadingPlan && !store.error && (
              <motion.div 
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Fill in parameters on the left and generate your first plan.
              </motion.div>
            )}
          </div>
        </div>

        {/* Модальное окно */}
        <AnimatePresence>
          {store.selectedMeal && (
            <motion.div 
              className={styles.detailsOverlay} 
              onClick={store.resetSelection}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className={styles.detailsCard} 
                onClick={(e) => e.stopPropagation()}
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className={styles.detailsHeader}>
                  <Text view="p-20" weight="medium">{store.selectedMeal.title}</Text>
                  <button type="button" className={styles.closeButton} onClick={store.resetSelection} aria-label="Close">×</button>
                </div>

                <div className={styles.detailsLayout}>
                  <div>
                    <img className={styles.detailsImage} src={store.selectedMeal.image} alt={store.selectedMeal.title} />
                    <div className={styles.detailsMeta}>
                      <span className={styles.chip}>{store.selectedMeal.readyInMinutes} min</span>
                      <span className={styles.chip}>{store.selectedMeal.servings} servings</span>
                      {store.selectedMeal.dishTypes?.slice(0, 2).map((type) => (
                        <span key={type} className={styles.chip}>{type}</span>
                      ))}
                    </div>
                    <Text view="p-16" className={styles.instructions}>
                      <div dangerouslySetInnerHTML={{ __html: store.selectedMeal.summary }} />
                    </Text>
                  </div>

                  <div>
                    <Text view="p-20" weight="medium">Ingredients</Text>
                    <ul className={styles.ingredientsList}>
                      {store.selectedMeal.extendedIngredients.map((ing) => (
                        <li key={ing.id}>{ing.original}</li>
                      ))}
                    </ul>

                    {store.selectedMeal.instructions && (
                      <>
                        <Text view="p-20" weight="medium" >Instructions</Text>
                        <Text view="p-16" className={styles.instructions}>
                          <div dangerouslySetInnerHTML={{ __html: store.selectedMeal.instructions }} />
                        </Text>
                      </>
                    )}
                  </div>
                </div>

                {store.mealError && <div className={styles.error}>{store.mealError}</div>}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MealPlanningObserved = observer(MealPlanning);

export default function MealPlanningPage() {
  return (
    <MealPlanningStoreProvider>
      <MealPlanningObserved />
    </MealPlanningStoreProvider>
  );
}
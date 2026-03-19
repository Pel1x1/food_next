"use client";

import React from 'react';
import Link from "next/link";
import Text from '@/shared/components/Text';
import styles from './Favourites.module.scss';
import Button from '@/shared/components/Button';
import TimerIcon from '@/shared/components/icons/TimerIcon';
import Card from '@/shared/components/Card';
import Loader from '@/shared/components/Loader';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/shared/hooks/useStore';
import { LuHeart } from 'react-icons/lu';
import { AppRoutePaths } from '@/app/routes';
import {gridContainerVariants, cardVariants, headerVariants} from "./components/FavouritesAnimations";


const Favourites: React.FC = () => {
  const {favouritesStore}= useStore();
  const favouriteRecipes = favouritesStore.items;
  const isLoading = favouritesStore.isLoading;

  return (
    <div className={styles.favouritesPage}>
      <div className={styles.favouritesPage__container}>
        {favouriteRecipes.length === 0 ? (
          <div className={styles.favouritesPage__noResults}>
            {isLoading ? (
              <>
                <Loader size="l" />
                <Text view="p-16">Loading favourites...</Text>
              </>
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={headerVariants}>
                <LuHeart size={80} className={styles.emptyIcon} />
                <Text view="title" tag="h2">No favourites yet</Text>
                <Text view="p-16" color='secondary'>
                  Start saving your favourite recipes to see them here!
                </Text>
                <Link href={AppRoutePaths.home} className={styles.exploreBtn}>
                  Browse Recipes
                </Link>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            <motion.header
              className={styles.favouritesPage__header}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={headerVariants}
            >
              <h1>Favourites</h1>
              <p>Your saved recipes collection. Click on any recipe to view full details.</p>
            </motion.header>

            <section className={styles.favouritesPage__gridSection}>
              <AnimatePresence mode="wait">
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className={styles.favouritesPage__grid}
                    variants={gridContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <AnimatePresence mode="popLayout">
                      {favouriteRecipes.map((recipe) => (
                        <motion.div
                          key={recipe.documentId}
                          layout
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          style={{ height: '100%' }}
                        >
                          <Link
                            href={AppRoutePaths.recipeById(recipe.documentId)}
                            style={{
                              textDecoration: 'none',
                              height: '100%',
                              display: 'block',
                            }}
                          >
                            <Card
                              image={recipe.image}
                              captionSlot={
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                  <TimerIcon aria-hidden="true" />
                                  {recipe.totalTime} minutes
                                </span>
                              }
                              title={recipe.name}
                              subtitle={recipe.summary}
                              contentSlot={
                                <Text view="p-20" weight="medium" color="accent">
                                  {recipe.calories} kcal
                                </Text>
                              }
                              actionSlot={
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    void favouritesStore.remove(recipe);
                                  }}
                                >
                                  <LuHeart
                                    size={16}
                                    fill="currentColor"
                                    style={{ marginRight: '4px' }}
                                  />
                                  Remove
                                </Button>
                              }
                            />
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </section>
          </>
        )}
      </div>
    </div>
  );
};


export default observer(Favourites);

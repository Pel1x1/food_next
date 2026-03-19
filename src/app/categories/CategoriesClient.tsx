"use client";

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  LuChefHat,
  LuPizza,
  LuSalad,
  LuIceCreamCone,
  LuCookie,
  LuUtensils,
  LuCroissant,
  LuBeef,
  LuSoup,
  LuCoffee,
  LuEgg,
  LuDroplets,
} from 'react-icons/lu';
import { useCategoriesStore } from "@/shared/providers/CategoriesStoreProvider";

import styles from './Categories.module.scss';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppRoutePaths } from '@/app/routes';
import { gridContainerVariants, cardVariants, headerVariants } from "./components/CategoriesAnimations";
import Text from '@/shared/components/Text';

const CategoryIcon: React.FC<{ name: string }> = ({ name }) => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('main')) return <LuBeef size={32} />;
  if (lowerName.includes('side')) return <LuSalad size={32} />;
  if (lowerName.includes('breakfast')) return <LuEgg size={32} />;
  if (lowerName.includes('dessert')) return <LuIceCreamCone size={32} />;
  if (lowerName.includes('appetizer')) return <LuUtensils size={32} />;
  if (lowerName.includes('salad')) return <LuSalad size={32} />;
  if (lowerName.includes('bread')) return <LuCroissant size={32} />;
  if (lowerName.includes('soup')) return <LuSoup size={32} />;
  if (lowerName.includes('beverage')) return <LuCoffee size={32} />;
  if (lowerName.includes('sauce') || lowerName.includes('marinade')) return <LuDroplets size={32} />;
  if (lowerName.includes('fingerfood')) return <LuPizza size={32} />;
  if (lowerName.includes('snack')) return <LuCookie size={32} />;

  return <LuChefHat size={32} />;
};

const CategoriesClient: React.FC = () => {
  const categoriesStore = useCategoriesStore();
  const router = useRouter();

  useEffect(() => {
    if (categoriesStore.categories.length === 0) {
      void categoriesStore.fetchCategories();
    }
  }, [categoriesStore]);

  const { categories, loading, error } = categoriesStore;

  const handleCategoryClick = (categoryId: number) => {
    router.push(`${AppRoutePaths.category}?categories=${categoryId}`);
  };

  return (
    <div className={styles.categoriesPage}>
      <div className={styles.categoriesContainer}>
        <motion.header
          className={styles.categoriesHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <Text tag="h1">Explore Categories</Text>
          <Text tag='p' color='secondary'>Browse our hand-picked collection by cuisine or type.</Text>
        </motion.header>

        {loading && <div className={styles.categoriesMessage}>Loading categories...</div>}
        {error && <div className={styles.categoriesMessage}>{error}</div>}

        {!loading && !error && (
          <motion.div
            className={styles.categoriesGrid}
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {categories.map((cat) => (
              <motion.div
                onClick={() => handleCategoryClick(cat.id)}
                key={cat.id}
                className={styles.categoryCard}
                variants={cardVariants}
                whileHover={{
                  y: -15,
                  rotate: 2,
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className={styles.categoryIconWrapper}>
                  <CategoryIcon name={cat.title} />
                </div>
                <h3>{cat.title}</h3>
                <p>Delicious {cat.title.toLowerCase()} recipes for you.</p>

                <button
                  className={styles.categoryBtn}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  Browse All
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default observer(CategoriesClient);


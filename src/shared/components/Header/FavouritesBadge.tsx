"use client";

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/shared/hooks/useStore';
import styles from './Header.module.scss';

const FavouritesBadge = observer(() => {
  const { favouritesStore } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const count = favouritesStore.items.length;

  if (!isMounted) return null;
  if (count === 0) return null;

  return (
    <span className={styles.badge}>
      {count > 99 ? '99+' : count}
    </span>
  );
});

export default FavouritesBadge;

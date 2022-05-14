import React from 'react';
import Router from 'next/router';
import Image from 'next/image';
import styles from '../styles/Rimuru.module.css';

export default function Rimuru() {

  React.useEffect(function () {
    let date = new Date();
    let season;
    let month = date.getMonth() + 1;
    if (3 <= month <= 5) {
      season = 'Spring';
    }
    else if (6 <= month <= 8) {
      season = 'Summer';
    }
    else if (9 <= month <= 11) {
      season = 'Fall';
    }
    else {
      season = 'Winter';
    }
    let year = date.getFullYear();
    Router.push(`/${season}-${year}`);
  });

  return (
    <div className={styles.pinkWrap}>
      <Image className={styles.rimuruWet} alt=''
        src='/rimuru.png'
        height={120} width={120}
      />
      <div className={styles.haniChart}>haniChart</div>
    </div>
  )

}
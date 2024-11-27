import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Home from '../components/Home'
import styles from './index.module.css'

const HomePage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>RSVP FLUFLU DINER</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ccd5ae"/>
      </Head>

      <main className={styles.main}>
        <Home/>
      </main>
    </div>
  )
}

export default HomePage

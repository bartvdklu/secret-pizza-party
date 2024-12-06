import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Home from '../components/Home'
import styles from './index.module.css'

const HomePage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>RSVP DE BRABANTSE WINTER DINER</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://use.typekit.net/rbr6dxl.css"/>
        <meta name="theme-color" content="#ccd5ae"/>

        <meta property="og:title" content="RSVP DE BRABANTSE WINTER DINER" />
        <meta property="og:description" content="Wat leuk je hier te zien! Zorg dat je de RSVP invult om je reservering voor een verzorgde avond op 22 december ’24 compleet te maken." />
        <meta property="og:image" content="https://debrabantsewinter.nl/wp-content/uploads/2024/12/DSCF5205-scaled.jpg" />

        <meta property="og:site_name" content="De Brabantse Winter" />
        <meta name="twitter:title" content="RSVP DE BRABANTSE WINTER DINER" />
        <meta name="twitter:description" content="RSVP for the Brabantse Winter Diner" />
        <meta name="twitter:image" content="https://debrabantsewinter.nl/wp-content/uploads/2024/12/DSCF5205-scaled.jpg" />

        {/* Facebook */}
        <meta property="og:url" content="https://www.facebook.com/debrabantsewinter" />

        {/* Instagram */}
        <meta property="instagram:url" content="https://www.instagram.com/brabantsewinter/" />
      </Head>

      <main className={styles.main}>
        <Home/>
      </main>
    </div>
  )
}

export default HomePage

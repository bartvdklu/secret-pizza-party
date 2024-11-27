import React, { ChangeEvent } from 'react'
import useInvite from './hooks/useInvite'
import LogoImage from './images/DBWlogo'
import ErrorImage from './images/Error'
import styles from './Home.module.css'

export default function Home () {
  const { inviteResponse, error, updating, updateRsvp } = useInvite()

  if (error) {
    return <div className={styles.error}>
      <p><ErrorImage width={200}/></p>
      <p>Geen code toegevoegd!</p>
    </div>
  }

  if (!inviteResponse) {
    return <LogoImage className="spin" width={200}/>
  }

  function onRsvpChange (e: ChangeEvent<HTMLInputElement>) {
    const coming = e.target.value === 'yes'
    updateRsvp(coming)
  }

  return (
    <>
      <LogoImage width={200}/>
      <h1 className={styles.title}>{inviteResponse.messages.title}</h1>
      <h2 className={styles.subtitle}>{inviteResponse.messages.date_and_place}</h2>

      <div className={styles.card}>
        <h3>Beste <strong>{inviteResponse.invite.name}</strong>,</h3>
        <p>{inviteResponse.messages.invitation}</p>
        <br />
        <p>{inviteResponse.messages.instructions}</p>
        <fieldset className={styles.fieldset} disabled={updating}>
          <legend>{inviteResponse.messages.question}</legend>

          <label htmlFor="yes">
            <input type="radio" id="yes" name="coming" value="yes" onChange={onRsvpChange} checked={inviteResponse.invite.coming === true}/>
            {inviteResponse.messages.answer1}
          </label>

          <label htmlFor="no">
            <input type="radio" id="no" name="coming" value="no" onChange={onRsvpChange} checked={inviteResponse.invite.coming === false}/>
            {inviteResponse.messages.answer2}
          </label>

          <label htmlFor="name">
            <input type="text" id="name" name="name" defaultValue={inviteResponse.invite.name === "undefined" ? '' : inviteResponse.invite.name} placeholder='Voornaam'/>
          </label>
          <label htmlFor="lastname">
            <input type="text" id="lastname" name="lastname" defaultValue={inviteResponse.invite.lastname === "undefined" ? '' : inviteResponse.invite.lastname} placeholder='achternaam'/>
          </label>
          <label htmlFor="email">
            <input type="email" id="email" name="email" defaultValue={inviteResponse.invite.email === "undefined" ? '' : inviteResponse.invite.email} placeholder='email'/>
          </label>
          <label htmlFor="guests">
            <input type="number" id="guests" name="guests" defaultValue={inviteResponse.invite.guests} placeholder='aantal gasten'/>
          </label>
        </fieldset>
      </div>
    </>
  )
}

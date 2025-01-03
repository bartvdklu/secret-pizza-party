import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import useInvite from './hooks/useInvite'
import LogoImage from './images/DBWlogo'
import ErrorImage from './images/Error'
import styles from './Home.module.css'

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function Home () {
  const { inviteResponse, error, updating, updateDone, updateRsvp } = useInvite()
  const [formData, setFormData] = useState({
    coming: true,
    name: '',
    lastname: '',
    email: '',
    guests: 1,
    otherDates: [] as string[], // Initialize as empty array
    tickettype: true
  })

  // Populate form data with initial values from inviteResponse
  useEffect(() => {
    if (inviteResponse) {
      setFormData({
        coming: inviteResponse.invite.coming ?? true, // Handle potential undefined
        name: inviteResponse.invite.name === 'undefined' ? '' : inviteResponse.invite.name,
        lastname: inviteResponse.invite.lastname === 'undefined' ? '' : inviteResponse.invite.lastname,
        email: inviteResponse.invite.email === 'undefined' ? '' : inviteResponse.invite.email,
        guests: inviteResponse.invite.guests || 1,
        otherDates: inviteResponse.invite.otherDates || [],
        tickettype: inviteResponse.invite.tickettype ?? true
      })
    }
  }, [inviteResponse])

  if (error) {
    return <div className={styles.error}>
      <p><ErrorImage width={200}/></p>
      <p>Geen code toegevoegd!</p>
    </div>
  }

  if (!inviteResponse) {
    return <LogoImage className="spin" width={200} />
  }

  function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, checked } = e.target as HTMLInputElement

    if (type === 'checkbox') {
      setFormData(prevFormData => {
        const updatedOtherDates = checked
          ? [...prevFormData.otherDates, value]
          : prevFormData.otherDates.filter(date => date !== value)
        return { ...prevFormData, otherDates: updatedOtherDates }
      })
    } else {
      // Existing handling for other input types
      const parsedValue = name === 'guests' ? parseInt(value, 10) : value

      setFormData({
        ...formData,
        [name]: parsedValue,
        coming: name === 'coming' ? (value === 'yes') : formData.coming,
        tickettype: name === 'tickettype' ? (value === 'Ik wil alleen in de avond komen met mijn gezelschap') : formData.tickettype
      })
    }
    console.log(formData)
  }

  async function handleSubmit (e: FormEvent) {
    e.preventDefault()
    if (inviteResponse) {
      await updateRsvp(formData)
    }
  }

  // Generate date options, skipping December 22nd
  const currentDate = new Date('2024-12-21')
  const endDate = new Date('2025-01-05')
  const dateOptions: { value: string; label: string }[] = []

  /* eslint-disable no-unmodified-loop-condition */
  while (currentDate <= endDate) {
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1 // Month is 0-indexed

    // Skip December 22nd
    if (!(month === 12 && day === 22)) {
      dateOptions.push({
        value: formatDate(currentDate),
        label: formatDate(currentDate)
      })
    }
    currentDate.setDate(currentDate.getDate() + 1)
    /* eslint-disable no-unmodified-loop-condition */
  }

  return (
    <>

      <div className={styles.card}>
        <h1>Hi{inviteResponse.invite.name === 'undefined' ? '' : ' ' + inviteResponse.invite.name}!</h1>
        <p className={styles.message}>Wat leuk je hier te zien!</p>
        <p className={styles.message}>Vul hieronder je gegevens in om de reservering voor een verzorgde avond op 22 december '24 compleet te maken ✨</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup} id={styles.names}>
            <label htmlFor="name">
              <h4>Voornaam:</h4>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder='Voornaam'/>
            </label>
            <label htmlFor="lastname">
              <h4>Achternaam:</h4>
              <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} placeholder='achternaam'/>
            </label>
          </div>
          <div className={styles.formGroup} id={styles.email}>
            <label htmlFor="email">
              <h4>Email:</h4>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder='email'/>
            </label>
          </div>
            <label htmlFor="guests">
              <h4>Met hoeveel personen wil je komen? Vul dat hieronder in:</h4>
              <input type="number" id="guests" name="guests" value={formData.guests} onChange={handleChange} placeholder='aantal gasten' min={1} max={5}/>
            </label>
            <div>
              <h4>Ben je aanwezig?</h4>
              <div className={styles.formGroup} id={styles.radioGroup}>
                <label htmlFor="yes">
                  <input type="radio" id="yes" name="coming" value="yes" checked={formData.coming} onChange={handleChange} />
                  {inviteResponse.messages.answer1}
                </label>

                <label htmlFor="no">
                  <input type="radio" id="no" name="coming" value="no" checked={!formData.coming} onChange={handleChange} />
                  {inviteResponse.messages.answer2}
                </label>
              </div>
            </div>
            {formData.coming && (
            <div>
              <h4>Ticket(s) voor 22 december 2024:</h4>
              <p>Je bent in de avond van harte welkom! Wil je overdag ook komen genieten, dat kan! Geef hier je voorkeur op:</p>
                <div className={styles.formGroup} id={styles.ticketGroup}>
                  <label htmlFor="eveningTicket">
                    <input type="radio" id="eveningTicket" name="tickettype" value="Ik wil alleen in de avond komen met mijn gezelschap" checked={formData.tickettype} onChange={handleChange} />
                    Ik wil alleen in de avond komen met mijn gezelschap
                  </label>

                  <label htmlFor="dayTicket">
                    <input type="radio" id="dayTicket" name="tickettype" value="Ik wil graag al overdag komen met mijn gezelschap" checked={!formData.tickettype} onChange={handleChange} />
                    <div id={styles.altLabel}>
                      Ik wil graag al overdag komen met mijn gezelschap
                    {!formData.tickettype && (
                      <div className={styles.infoblock}>
                        Let op! Je moet vóór 16:00 binnen zijn.
                      </div>
                    )}
                    </div>
                  </label>
                </div>
            </div>
            )}
          {!formData.coming && (
            <div className={styles.notComingContainer}>
              <p>Kun jij er helaas niet bij zijn op 22 december? Dan willen we je graag een dagticket bieden voor een andere dag! Laat hieronder weten wanneer. De Brabantse Winter is van 21 december ’24 t/m 5 januari ’25 geopend!</p>
              <div className={styles.infoblock} id={styles.infoRelative}>
                Let op: Je ontvangt dagtickets, met deze tickets moet je vóór 16:00 binnen zijn!
              </div>
          <div className={styles.datesGroup}>
            {dateOptions.map((option) => (
              <label key={option.value}>
                <input
                  type="checkbox"
                  name="otherDates"
                  value={option.value}
                  onChange={handleChange}
                  checked={formData.otherDates.includes(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
          </div>
          )}
            <br/>
            <button type="submit" disabled={updating}>
            {updateDone && !updating
              ? ('RSVP is succesvol verstuurd!')
              : updating
                ? ('Verzenden...')
                : updateDone
                  ? 'RSVP is niet succesvol verstuurd. Neem contact op met info@debrabantsewinter.nl'
                  : 'VERSTUUR RSVP'
            }
            </button>
        </form>
        <LogoImage width={200}/>
      </div>
    </>
  )
}

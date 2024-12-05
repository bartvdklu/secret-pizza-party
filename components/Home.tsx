import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import useInvite from './hooks/useInvite'
import LogoImage from './images/DBWlogo'
import ErrorImage from './images/Error'
import styles from './Home.module.css'

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function Home () {
  const { inviteResponse, error, updating, updateRsvp } = useInvite()
  const [formData, setFormData] = useState({
    coming: true,
    name: '',
    lastname: '',
    email: '',
    guests: 1,
    otherDates: [] as string[] // Initialize as empty array
  })

  if (error) {
    return <div className={styles.error}>
      <p><ErrorImage width={200}/></p>
      <p>Geen code toegevoegd!</p>
    </div>
  }

  // Populate form data with initial values from inviteResponse
  useEffect(() => {
    if (inviteResponse) {
      setFormData({
        coming: inviteResponse.invite.coming ?? true,  // Handle potential undefined
        name: inviteResponse.invite.name === 'undefined' ? '' : inviteResponse.invite.name,
        lastname: inviteResponse.invite.lastname === 'undefined' ? '' : inviteResponse.invite.lastname,
        email: inviteResponse.invite.email === 'undefined' ? '' : inviteResponse.invite.email,
        guests: inviteResponse.invite.guests || 1,
        otherDates: inviteResponse.invite.otherDates || []
      })
    }
  }, [inviteResponse])

  if (!inviteResponse) {
    return <LogoImage className="spin" width={200} />
  }


  function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, checked } = e.target as HTMLInputElement

    if (type === 'checkbox') {
      setFormData(prevFormData => {
        const updatedOtherDates = checked
          ? [...prevFormData.otherDates, value]
          : prevFormData.otherDates.filter(date => date !== value);
        return { ...prevFormData, otherDates: updatedOtherDates };
      });

    } else {
      // Existing handling for other input types
       const parsedValue = name === 'guests' ? parseInt(value, 10) : value

      setFormData({
        ...formData,
        [name]: parsedValue,
        coming: name === 'coming' ? (value === 'yes') : formData.coming
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
  const currentDate = new Date('2024-12-21');
  const endDate = new Date('2025-01-05');
  const dateOptions: { value: string; label: string }[] = [];

  while (currentDate <= endDate) {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Month is 0-indexed
    const year = currentDate.getFullYear();

    // Skip December 22nd
    if (!(month === 12 && day === 22)) {
      dateOptions.push({
        value: formatDate(currentDate),
        label: formatDate(currentDate),
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <>
      <LogoImage width={200}/>
      <h1 className={styles.title}>{inviteResponse.messages.title}</h1>
      <h2 className={styles.subtitle}>{inviteResponse.messages.date_and_place}</h2>

      <div className={styles.card}>
        <h3>Hi<strong>{inviteResponse.invite.name === 'undefined' ? '' : ' ' + inviteResponse.invite.name}</strong>!</h3>
        <p>Wat leuk je hier te zien! Als je deze vragen hieronder even invult, is je reservering voor een verzorgde avond op 22 december ’24 compleet. ✨</p>

        <form onSubmit={handleSubmit}>
            <label htmlFor="name">
              <p>Voornaam:</p>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder='Voornaam'/>
            </label>
            <label htmlFor="lastname">
              <p>Achternaam:</p>
              <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} placeholder='achternaam'/>
            </label>
            <label htmlFor="email">
              <p>Email:</p>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder='email'/>
            </label>
            <label htmlFor="guests">
              <p>Met hoeveel personen wil je komen? Vul dat hieronder in:</p>
              <input type="number" id="guests" name="guests" value={formData.guests} onChange={handleChange} placeholder='aantal gasten' max={5}/>
            </label>
            <div>
              <p>Ben je aanwezig?</p>
              <div>
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
          {!formData.coming &&(
            <div>
              <p>Kun jij er helaas niet bij zijn op 22 december? Dan willen we je graag een dagticket bieden voor een andere dag! Laat hieronder weten wanneer. De Brabantse Winter is van 21 december ’24 t/m 5 januari ’25 geopend!</p>
          <div>
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
              Submit
            </button>
        </form>
      </div>
    </>
  )
}


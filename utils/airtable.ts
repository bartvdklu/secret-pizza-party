import Airtable, { FieldSet, Record } from 'airtable'
import { Invite } from '../types/invite'

// make sure all the necessary env vars are set
if (!process.env.AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is not set')
}
if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_BASE_ID is not set')
}

// create a new Airtable client and gets a reference to the
// airtable base containing our invites
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
const base = airtable.base(process.env.AIRTABLE_BASE_ID)

// function used to "sanitize" query data and avoid injections
function escape (value: string): string {
  if (value === null || typeof value === 'undefined') {
    return 'BLANK()'
  }

  if (typeof value === 'string') {
    const escapedString = value
      .replace(/'/g, "\\'")
      .replace(/\r/g, '')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t')
    return `'${escapedString}'`
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0'
  }

  throw Error('Invalid value received')
}

export function getInviteRecord (inviteCode: string): Promise<Record<FieldSet>> {
  return new Promise((resolve, reject) => {
    base('invites')
      // runs a query on the `invites` table
      .select({
        filterByFormula: `{invite} = ${escape(inviteCode)}`,
        maxRecords: 1
      })
      // reads the first page of results
      .firstPage((err, records) => {
        if (err) {
          // propagate errors
          console.error(err)
          return reject(err)
        }

        // if the record could not be found
        // we consider it an error
        if (!records || records.length === 0) {
          return reject(new Error('Invite not found'))
        }

        // returns the first record
        resolve(records[0])
      })
  })
}

// get an invite by invite code (promisified)
export async function getInvite (inviteCode: string): Promise<Invite> {
  const inviteRecord = await getInviteRecord(inviteCode)

  return {
    code: String(inviteRecord.fields.invite),
    name: String(inviteRecord.fields.name),
    lastname: String(inviteRecord.fields.lastname),
    email: String(inviteRecord.fields.email),
    guests: Number(inviteRecord.fields.guests),
    coming: typeof inviteRecord.fields.coming === 'undefined'
      ? undefined
      : inviteRecord.fields.coming === 'yes',
    otherDates: inviteRecord.fields.otherDates as string[]
  
  }
}

export async function updateRsvp (inviteCode: string, updatedInvite: Partial<Invite>): Promise<void> {

  const { id } = await getInviteRecord(inviteCode)

  const airtableUpdates = {
    coming: updatedInvite.coming ? 'yes' : 'no', // Still handles boolean conversion
    name: updatedInvite.name,
    lastname: updatedInvite.lastname,
    email: updatedInvite.email,
    guests: updatedInvite.guests,
    otherDates: updatedInvite.otherDates // Add other fields as needed
  }

  // Remove undefined/null values to avoid Airtable errors
  const cleanedUpdates = Object.fromEntries(Object.entries(airtableUpdates).filter(([_, v]) => v !== undefined && v !== null));


  return new Promise((resolve, reject) => {
    base('invites').update(id, cleanedUpdates, (err: any) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

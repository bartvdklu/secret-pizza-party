import { Messages } from '../data/messages'

export interface Invite {
  code: string,
  name: string,
  lastname: string,
  email: string,
  guests: number,
  coming?: boolean,
  otherDates: string[],
  tickettype?: boolean,
}

export interface InviteResponse {
  invite: Invite,
  messages: Messages
}

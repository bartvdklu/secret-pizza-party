import { useState, useEffect } from 'react'
import { InviteResponse } from '../../types/invite'

// Defines the endpoint based on the current window location
const API_BASE = process.env.API_ENDPOINT || (typeof window !== 'undefined' && (window.location.origin + '/api'))
const INVITE_ENDPOINT = API_BASE + '/invite'
const RSVP_ENDPOINT = API_BASE + '/rsvp'

interface HookResult {
  inviteResponse: InviteResponse | null,
  error: string | null,
  updating: boolean,
  updateRsvp: (formData: any) => Promise<void>
}

// Helper function that invokes the invite API endpoint
async function fetchInvite (code: string): Promise<InviteResponse> {
  const requestUrl = new URL(INVITE_ENDPOINT)
  requestUrl.searchParams.append('code', code)
  const response = await fetch(requestUrl)
  if (!response.ok) {
    throw new Error('Invalid code')
  }
  const invite = await response.json()
  return invite
}

// Helper function that invokes the rsvp API endpoint
async function updateRsvpRequest (code: string, formData: any): Promise<void> { // Update parameter to accept formData
  const requestUrl = new URL(RSVP_ENDPOINT)
  requestUrl.searchParams.append('code', code)
  const response = await fetch(requestUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData) // Send the complete formData object
  })
  if (!response.ok) {
    // More specific error handling could be added here, e.g., checking for different status codes
    // and returning a more informative error message.
    throw new Error('Failed to update RSVP: ' + response.statusText)
  }
}

// The custom hook
export default function useInvite (): HookResult {
  // This hook has the inviteResponse and a possilbe error as state.
  const [inviteResponse, setInviteResponse] = useState<InviteResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<any>(false)

  // We want to make the API call when the component using the hook
  // is mounted so we use the useEffect hook.
  useEffect(() => {
    // We read the code from the current window URL.
    const url = new URL(window.location.toString())
    const code = url.searchParams.get('code')

    if (!code) {
      // If there is no code, we set an error message.
      setError('No code provided')
    } else {
      // If we have a code, we get the associated data.
      // In case of success or failure we update the state accordingly.
      fetchInvite(code)
        .then(setInviteResponse)
        .catch(err => {
          setError(err.message)
        })
    }
  }, [])

  async function updateRsvp (formData: any) {
    if (inviteResponse) {
      setUpdating(true)
      try {
        await updateRsvpRequest(inviteResponse.invite.code, formData)
        // Update the local inviteResponse state with the updated data.  Important to avoid stale closures!
        setInviteResponse({
          ...inviteResponse,
          invite: { ...inviteResponse.invite, ...formData } // Merge formData into the invite
        })
      } catch (error) {
        // Handle errors, perhaps by displaying an error message to the user.
        console.error("Error updating RSVP:", error)
        // Consider setting an error state variable to communicate the error to the user.
      } finally {
        setUpdating(false)
      }
    }
  }

  // We return the state variables and the updateRsvp function.
  return { inviteResponse, error, updating, updateRsvp }
}

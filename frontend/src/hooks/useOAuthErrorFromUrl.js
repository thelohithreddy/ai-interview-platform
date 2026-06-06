import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getOAuthErrorMessage } from '../utils/socialAuth'

export function useOAuthErrorFromUrl(setServerError) {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('oauth_error')
    if (!code) return

    const detail = searchParams.get('oauth_detail')
    setServerError(getOAuthErrorMessage(code, detail))

    searchParams.delete('oauth_error')
    searchParams.delete('oauth_detail')
    setSearchParams(searchParams, { replace: true })
  }, [searchParams, setSearchParams, setServerError])
}

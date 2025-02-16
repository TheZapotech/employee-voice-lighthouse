
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from './ui/button'

const SupabaseTest = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setStatus('loading')
      // Testiamo la connessione usando la tabella feedback_categories che sappiamo esistere
      const { data, error } = await supabase
        .from('feedback_categories')
        .select('*')
        .limit(1)
      
      if (error) throw error
      
      console.log('Connessione a Supabase riuscita:', data)
      setStatus('success')
    } catch (error) {
      console.error('Errore di connessione a Supabase:', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Errore sconosciuto')
    }
  }

  return (
    <div className="p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">Test Connessione Supabase</h3>
      <div className="space-y-2">
        {status === 'loading' && (
          <p className="text-yellow-600">Verifica connessione in corso...</p>
        )}
        {status === 'success' && (
          <p className="text-green-600">✓ Connessione a Supabase riuscita!</p>
        )}
        {status === 'error' && (
          <div>
            <p className="text-red-600">✗ Errore di connessione</p>
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        )}
        <Button 
          onClick={testConnection}
          variant={status === 'error' ? 'destructive' : 'outline'}
        >
          Riprova Test
        </Button>
      </div>
    </div>
  )
}

export default SupabaseTest

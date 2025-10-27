'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from './Button'
import { useTranslation } from '@/lib/i18n'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onError?: (error: string) => void
}

export function VoiceInput({ onTranscript, onError }: VoiceInputProps) {
  const { t, language } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        setIsSupported(false)
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      // Set language based on user preference
      recognition.lang = language === 'nl' ? 'nl-BE' : 'en-US'

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onTranscript(transcript)
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (onError) {
          onError(event.error)
        }
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, onError, language])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Error starting recognition:', error)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      onClick={isListening ? stopListening : startListening}
      variant={isListening ? 'primary' : 'secondary'}
      className={`${isListening ? 'animate-pulse' : ''} sm:px-4`}
      title={isListening ? t('listening') : t('voiceInput')}
    >
      {isListening ? (
        <>
          <MicOff className="w-5 h-5 sm:mr-2" />
          <span className="hidden sm:inline">{t('listening')}</span>
        </>
      ) : (
        <>
          <Mic className="w-5 h-5 sm:mr-2" />
          <span className="hidden sm:inline">{t('voiceInput')}</span>
        </>
      )}
    </Button>
  )
}

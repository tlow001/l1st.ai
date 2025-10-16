import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'L1st.ai - Smart Shopping Lists',
  description: 'AI-powered shopping list builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

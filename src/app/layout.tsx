import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { TextScaleControl } from '@/components/TextScaleControl'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-jb',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ezra Center Admin',
  description: 'Internal operations dashboard for Ezra Center staff and management',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="pb-[5rem] sm:pb-[5.5rem]">
        <script
          dangerouslySetInnerHTML={{
            __html:
              '!function(){try{var s=localStorage.getItem("ezra-text-scale");if(s)document.documentElement.style.setProperty("--ezra-text-scale",s)}catch(e){}}();',
          }}
        />
        {children}
        <TextScaleControl />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}

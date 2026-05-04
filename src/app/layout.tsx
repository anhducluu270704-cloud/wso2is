import './globals.css'
import Script from 'next/script'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Script src="/env.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  )
}

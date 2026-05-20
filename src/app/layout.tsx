import "./globals.css"

export const metadata = {
  title: "Justice Advocates & Partners",
  description: "Outstanding legal representation with exceptional results.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

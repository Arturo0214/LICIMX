import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import MarketingPage from "./(marketing)/page"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <MarketingPage />
      </main>
      <Footer />
    </>
  )
}

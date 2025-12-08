import NewsletterForm from "@/components/newsletter-form"

export default function NewsletterCTA() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground md:text-lg">
            Be the first to know about our latest products, features, and reading innovations.
          </p>
          <div className="mx-auto max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  )
}

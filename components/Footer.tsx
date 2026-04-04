export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-text-muted">
          &copy; {year} Andres Torres Jr. All rights reserved.
        </p>
        <p className="font-mono text-xs text-text-muted/60">
          Built with{' '}
          <a
            href="https://uilayouts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/70 hover:text-accent transition-colors"
          >
            UILayouts
          </a>{' '}
          +{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/70 hover:text-accent transition-colors"
          >
            Next.js
          </a>
        </p>
      </div>
    </footer>
  )
}

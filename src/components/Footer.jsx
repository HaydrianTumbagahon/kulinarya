import { ExternalLink } from 'lucide-react'
import { SITE } from '../data/site.js'

const CURRENT_YEAR = new Date().getFullYear()

const exploreLinks = [
  { href: '#flavors-of-home', label: 'Flavors of Home' },
  { href: '#bread-pastries', label: 'Bread and Pastries' },
  { href: '#desserts', label: 'Desserts' },
  { href: '#top', label: 'Back to top' },
]

function Footer() {
  return (
    <footer className="dark-surface banig bg-navy-deep px-5 py-10 text-pina sm:px-10 sm:py-14 lg:px-16">
      <div className="mx-auto max-w-screen-2xl">
        <div aria-hidden="true" className="mb-10 h-px w-full bg-gold" />
        <div className="grid gap-10 lg:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
          <p className="font-display text-5xl font-black leading-none sm:text-6xl">
            {SITE.name}
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            <section>
              <h2 className="font-sans text-xs font-semibold uppercase text-gold">About</h2>
              <p className="mt-4 font-sans text-sm leading-relaxed text-justify text-pina/80">
                A collection of Filipino recipes rooted in the flavors, stories, and traditions shared across generations. From everyday ulam to panaderya favorites and festive kakanin, Kulinarya celebrates the dishes that make every table feel like home.
              </p>
            </section>

            <nav aria-label="Explore">
              <h2 className="font-sans text-xs font-semibold uppercase text-gold">Explore</h2>
              <ul className="mt-4 space-y-3 font-sans text-sm">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-pina/80 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <section>
              <h2 className="font-sans text-xs font-semibold uppercase text-gold">Connect</h2>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kulinarya on GitHub"
                className="mt-4 inline-flex items-center gap-2 font-sans text-sm text-pina/80 hover:text-gold focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
              >
                GitHub
                <ExternalLink aria-hidden="true" size={15} strokeWidth={1.5} />
              </a>
            </section>
          </div>
        </div>

        <p className="mt-12 text-right font-sans text-xs text-pina/65">
          Designed and built by {SITE.credit} © {CURRENT_YEAR} {SITE.name}
        </p>
      </div>
    </footer>
  )
}

export default Footer

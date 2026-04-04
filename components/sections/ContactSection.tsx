'use client'
import { motion } from 'framer-motion'
import TextAnimation from '@/components/ui/scroll-text'
import { Mail, Linkedin, Github } from 'lucide-react'

const contactLinks = [
  {
    label: 'Email',
    value: 'andytorresjr@utexas.edu',
    href: 'mailto:andytorresjr@utexas.edu',
    icon: Mail,
    description: 'Best for opportunities and collaborations',
  },
  {
    label: 'LinkedIn',
    value: '/in/andres-torres-jr',
    href: 'https://www.linkedin.com/in/andres-torres-jr',
    icon: Linkedin,
    description: 'Professional profile and project posts',
  },
  {
    label: 'GitHub',
    value: '/andytorresjr',
    href: 'https://github.com/andytorresjr',
    icon: Github,
    description: 'Code, repos, and open-source work',
  },
]

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-surface/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-4">
            05 / Contact
          </span>
          <TextAnimation
            as="h2"
            text="Let's Connect"
            direction="up"
            className="font-syne font-black text-3xl md:text-5xl text-text-primary mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-inter text-base text-text-muted leading-relaxed mb-12"
          >
            Have an opportunity, collaboration idea, or want to talk embedded
            systems? I&apos;d love to hear from you — choose a platform below.
          </motion.p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactLinks.map((link, i) => {
            const Icon = link.icon
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -3 }}
                className="group flex flex-col gap-4 p-6 rounded-lg border border-border/60 bg-surface/60 hover:border-accent/40 hover:bg-surface transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`Contact via ${link.label}: ${link.value}`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-bg border border-border/60 flex items-center justify-center group-hover:border-accent/40 transition-colors">
                    <Icon
                      size={18}
                      className="text-text-muted group-hover:text-accent transition-colors"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-text-muted/40 uppercase tracking-widest mt-1">
                    {link.label}
                  </span>
                </div>

                <div>
                  <p className="font-mono text-xs text-accent mb-1 truncate">
                    {link.value}
                  </p>
                  <p className="font-inter text-xs text-text-muted/60">
                    {link.description}
                  </p>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

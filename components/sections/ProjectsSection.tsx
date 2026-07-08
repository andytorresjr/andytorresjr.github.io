'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Spotlight, SpotLightItem } from '@/components/ui/spotlight'
import TextAnimation from '@/components/ui/scroll-text'
import ScrollElement from '@/components/ui/scroll-animation'
import { ExternalLink, ArrowRight } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  image: string
  /** Mono text shown in the media area when there is no image (like prod's card placeholders) */
  placeholder?: string
  href: string
  linkLabel?: string
  status: 'live' | 'coming-soon'
}

const projects: Project[] = [
  {
    id: 'space-invaders',
    title: 'Space Invaders on the TM4C',
    description:
      'Designed and implemented a full game loop on the MSPM0 LaunchPad with custom graphics and audio drivers. Real-time interrupt-driven rendering at 30 fps with sound effects via DAC output.',
    tags: ['ARM Cortex-M4', 'Embedded C', 'Real-Time Systems', 'DAC Audio'],
    image: '/attachments/319k-final-project-thumbnail.jpg',
    href: 'https://www.linkedin.com/posts/andres-torres-jr-45a56a283_embeddedsystems-programming-microcontrollers-activity-7284749293800800256-m4ea',
    status: 'live',
  },
  {
    id: 'fsm-traffic',
    title: 'FSM Traffic Light Controller',
    description:
      'Created a traffic management system using finite state machines and simulated sensors to optimize traffic flow and pedestrian safety. Implemented on FPGA with Verilog HDL.',
    tags: ['Digital Logic', 'Finite State Machines', 'Verilog', 'Systems Design'],
    image: '/attachments/proj2-thumbnail.png',
    href: 'https://www.linkedin.com/posts/andres-torres-jr-45a56a283_reflecting-on-one-of-my-favorite-projects-activity-7326713346961932288-Mnkl',
    status: 'live',
  },
  {
    id: 'cafe-client',
    title: 'Café Brand Site & Online Ordering',
    description:
      'Freelance build for a local specialty café — a responsive brand site plus a full ordering flow: menu, a build-your-own-drink customizer, cart, and checkout. Hand-coded from scratch with a custom design system, no framework.',
    tags: ['Web Design', 'HTML / CSS / JS', 'Online Ordering', 'Responsive UI'],
    image: '/attachments/cafe-1.jpg',
    href: '/work/cafe-demo/',
    linkLabel: 'View live demo',
    status: 'live',
  },
  {
    id: 'pychain',
    title: 'PyChain — Blockchain from Scratch',
    description:
      'A proof-of-work blockchain built in Python with Merkle trees, REST API, tamper detection, and distributed consensus across nodes.',
    tags: ['Python', 'Distributed Systems', 'Cryptography'],
    image: '',
    placeholder: '{ blockchain }',
    href: 'https://github.com/andytorresjr/pychain',
    status: 'live',
  },
  {
    id: 'pychip8',
    title: 'PyChip8 — CHIP-8 Emulator',
    description:
      'A complete CHIP-8 emulator implementing all 35 opcodes, 64×32 display, two timers, hex keypad, and a disassembler.',
    tags: ['Python', 'Emulation', 'Computer Architecture'],
    image: '',
    placeholder: 'CHIP-8',
    href: 'https://github.com/andytorresjr/pychip8',
    status: 'live',
  },
  {
    id: 'pymalloc',
    title: 'PyMalloc — Memory Allocator',
    description:
      'A malloc/free/realloc replacement in C with explicit free lists, boundary tags, immediate coalescing, and a heap checker.',
    tags: ['C', 'Memory Management', 'Systems'],
    image: '',
    placeholder: 'malloc()',
    href: 'https://github.com/andytorresjr/pymalloc',
    status: 'live',
  },
  {
    id: 'pygit',
    title: 'PyGit — Git from Scratch',
    description:
      'A Git subset built from scratch — blob/tree/commit objects, SHA-1 content addressing, index, log, and checkout.',
    tags: ['Python', 'Version Control', 'File Systems'],
    image: '',
    placeholder: 'git commit',
    href: 'https://github.com/andytorresjr/pygit',
    status: 'live',
  },
  {
    id: 'pysh',
    title: 'PySh — Unix Shell',
    description:
      'A fully functional Unix shell built from scratch — pipes, I/O redirection, glob expansion, history, and 10 built-ins.',
    tags: ['Python', 'OS / Processes', 'Unix'],
    image: '',
    placeholder: '$ shell',
    href: 'https://github.com/andytorresjr/pysh',
    status: 'live',
  },
  {
    id: 'pyserve',
    title: 'PyServe — HTTP Web Server',
    description:
      'An HTTP/1.1 web server built from raw TCP sockets — multi-threaded, request parsing, router, and static file serving.',
    tags: ['Python', 'Networking', 'Concurrency'],
    image: '',
    placeholder: 'HTTP/1.1',
    href: 'https://github.com/andytorresjr/pyserve',
    status: 'live',
  },
  {
    id: 'pyregex',
    title: 'PyRegex — NFA Regex Engine',
    description:
      "An NFA-based regex engine using Thompson's construction — match, search, findall, sub, and compile.",
    tags: ['Python', 'Automata Theory', 'Parsing'],
    image: '',
    placeholder: '/regex/',
    href: 'https://github.com/andytorresjr/pyregex',
    status: 'live',
  },
  {
    id: 'pysearch',
    title: 'PySearch — Full-Text Search Engine',
    description:
      'A full-text search engine with inverted index, BM25/TF-IDF scoring, Porter stemmer, and boolean/phrase/wildcard queries.',
    tags: ['Python', 'Information Retrieval', 'NLP'],
    image: '',
    placeholder: 'BM25 search',
    href: 'https://github.com/andytorresjr/pysearch',
    status: 'live',
  },
  {
    id: 'pynet',
    title: 'PyNet — Neural Network from Scratch',
    description:
      'A fully-connected MLP built using only NumPy — backpropagation, Adam optimizer, dropout, and L2 regularization.',
    tags: ['Python', 'Machine Learning', 'NumPy'],
    image: '',
    placeholder: 'neural net',
    href: 'https://github.com/andytorresjr/pynet',
    status: 'live',
  },
  {
    id: 'pytpl',
    title: 'PyTpl — Template Engine',
    description:
      'A Jinja2-inspired template engine with a lexer, recursive descent parser, template inheritance, filters, and auto-escaping.',
    tags: ['Python', 'Compilers', 'Parsing'],
    image: '',
    placeholder: '{{ template }}',
    href: 'https://github.com/andytorresjr/pytpl',
    status: 'live',
  },
  {
    id: 'pyvdom',
    title: 'PyVDOM — Virtual DOM',
    description:
      'A React-inspired Virtual DOM — h(), diff(), patch(), typed patch records, and a stateful Component class.',
    tags: ['JavaScript', 'React Internals', 'DOM'],
    image: '',
    placeholder: '<vdom />',
    href: 'https://github.com/andytorresjr/pyvdom',
    status: 'live',
  },
  {
    id: 'pytask',
    title: 'PyTask — CLI Task Manager',
    description:
      'A feature-rich task manager CLI with a custom arg parser, ANSI table renderer, 9 subcommands, and JSON persistence.',
    tags: ['JavaScript', 'CLI', 'Developer Tools'],
    image: '',
    placeholder: 'task add',
    href: 'https://github.com/andytorresjr/pytask',
    status: 'live',
  },
  {
    id: 'realeyez',
    title: 'RealEyez — Anti-Deepfake Social App',
    description:
      'A social media concept that prevents prerecorded media uploads to combat AI-generated and fake content in real-time feeds.',
    tags: ['TypeScript', 'AI Safety', 'Social Media'],
    image: '',
    placeholder: 'realeyez',
    href: 'https://github.com/andytorresjr/realeyez',
    status: 'live',
  },
  {
    id: 'laredo-lifeline',
    title: 'Laredo Lifeline',
    description:
      'A TypeScript web application serving the Laredo community — built to connect local resources and services.',
    tags: ['TypeScript', 'Web App', 'Community'],
    image: '',
    placeholder: 'laredo lifeline',
    href: 'https://github.com/andytorresjr/laredo-lifeline',
    status: 'live',
  },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    // Gradient border card — adapted from UILayouts GradientBorder
    <article
      className="flex flex-col h-full rounded-lg overflow-hidden"
      style={{
        background:
          'linear-gradient(45deg,#111111,#1a1a1a 50%,#111111) padding-box, conic-gradient(from var(--border-angle),#27272a80 80%,#6366f1 86%,#818cf8 90%,#6366f1 94%,#27272a80) border-box',
        border: '1px solid transparent',
        animation: 'border-rotate 6s linear infinite',
      }}
    >
      {/* Image */}
      <div className="relative h-48 bg-surface-2 shrink-0 overflow-hidden">
        {project.status === 'coming-soon' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="font-mono text-[10px] text-accent border border-accent/30 px-2 py-1 rounded uppercase tracking-widest">
              Coming Soon
            </span>
            <span className="font-space-grotesk text-sm font-semibold text-text-muted/60 text-center px-4">
              {project.title}
            </span>
          </div>
        ) : !project.image ? (
          // Text placeholder media — mirrors prod's card__media--placeholder
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-lg text-accent/70 tracking-tight">
              {project.placeholder ?? project.title}
            </span>
          </div>
        ) : (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-space-grotesk font-bold text-base text-text-primary mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="font-inter text-sm text-text-muted leading-relaxed flex-1 mb-4">
          {project.description}
        </p>

        {/* Tags */}
        <ul className="flex flex-wrap gap-1.5 mb-5" aria-label="Technologies used">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="font-mono text-[10px] text-text-muted/70 bg-bg border border-border/60 px-2 py-0.5 rounded"
            >
              {tag}
            </li>
          ))}
        </ul>

        {/* Link */}
        {project.status === 'live' ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-space-grotesk text-xs font-semibold text-accent hover:text-accent-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            aria-label={`View ${project.title}`}
          >
            {project.linkLabel ?? 'See project'} <ExternalLink size={11} />
          </a>
        ) : (
          <span className="font-space-grotesk text-xs text-text-muted/40 cursor-not-allowed">
            In progress…
          </span>
        )}
      </div>
    </article>
  )
}

export default function ProjectsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({ container: scrollRef })
  const progressWidth = useTransform(scrollXProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="projects" className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-3">
              02 / Selected Work
            </span>
            <TextAnimation
              as="h2"
              text="Selected Projects"
              direction="up"
              className="font-syne font-black text-3xl md:text-5xl text-text-primary"
            />
          </div>

          {/* Scroll affordance */}
          <div
            className="flex items-center gap-2 text-text-muted/60 shrink-0"
            aria-hidden="true"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Drag to explore
            </span>
            <ArrowRight size={12} className="animate-bounce-x" />
          </div>
        </div>

        {/* Horizontal scroll track — ref on the outer div for useScroll */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing pb-4"
          style={{ scrollSnapType: 'x mandatory' } as React.CSSProperties}
        >
          <Spotlight className="flex gap-5 w-max">
            {projects.map((project, i) => (
              <SpotLightItem
                key={project.id}
                className="shrink-0 w-[320px] sm:w-[360px] group"
                style={{ scrollSnapAlign: 'start' } as React.CSSProperties}
              >
                <ScrollElement
                  viewport={{ once: true, amount: 0.2, margin: '0px' }}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
                    },
                  }}
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </ScrollElement>
              </SpotLightItem>
            ))}
          </Spotlight>
        </div>

        {/* Scroll progress bar */}
        <div
          className="mt-4 h-px bg-border/60 relative overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent/60 rounded-full"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </section>
  )
}

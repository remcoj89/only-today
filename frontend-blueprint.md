# Only Today — Frontend Blueprint

> **Versie:** 1.0.0  
> **Datum:** 25-02-2026  
> **Stack:** Astro + React · Custom CSS3 · Supabase · i18n (NL/EN/DE)  
> **Scope:** MVP Web Client (browser-first, mobile-ready)

---

## 1. Product Context

### 1.1 Wat is Only Today?

Een offline-first "Today Operating System" dat de gebruiker dwingt van **intentie → uitvoering → reflectie** te gaan. Geen eindeloos dashboard — elke dag opent met één vraag: *wat doe jij vandaag?*

De app combineert:

- **Journal** — reflectie, dankbaarheid, intentie
- **Executie-planner** — EEN + DRIE prioriteiten + pomodoro-timer
- **Ritme-systeem** — kwartaal → maand → week → dag (cascading goals)
- **Gedrags-dashboard** — patronen, correlaties, streaks
- **Accountability** — buddy-systeem met high-level status

### 1.2 Kernprincipe

> "Only today." — Niet alles tegelijk, maar vandaag één dag goed doen en daar consistentie uit bouwen.

### 1.3 Doelgroep

Ambitieuze ondernemers (m/v, 28–45) met een draaiend bedrijf die structuur, focus en discipline zoeken om hun dag uitvoerbaar te maken. Denk: ex-militairen, coaches, eigenaren van groeiende bedrijven. Resultaatgericht, geen tijd voor poespas, waarderen kracht en helderheid.

---

## 2. Branding & Design System

### 2.1 Kleuren

```
╔══════════════════════════════════════════════════════════════╗
║  LIGHT MODE                                                  ║
╠══════════════════════════════════════════════════════════════╣
║  --color-bg-primary:      #F5F5F5   (achtergrond)           ║
║  --color-bg-secondary:    #EBEBEB   (kaarten, secties)      ║
║  --color-bg-elevated:     #FFFFFF   (modals, dropdowns)     ║
║  --color-text-primary:    #071333   (koppen, body)          ║
║  --color-text-secondary:  #3A3F5C   (subtekst, labels)     ║
║  --color-text-muted:      #7A7F99   (placeholders, hints)  ║
║  --color-accent:          #DBB171   (goud — CTA, actief)   ║
║  --color-accent-hover:    #C9993F   (goud donkerder)       ║
║  --color-accent-subtle:   #DBB17120 (goud 12% — badges)    ║
║  --color-success:         #2E7D4F   (afgerond, check)      ║
║  --color-warning:         #D4880F   (aandacht, gemist)     ║
║  --color-error:           #C0392B   (fout, destructief)    ║
║  --color-border:          #D5D5D5   (lijnen, scheiding)    ║
╠══════════════════════════════════════════════════════════════╣
║  DARK MODE                                                   ║
╠══════════════════════════════════════════════════════════════╣
║  --color-bg-primary:      #0A0F24   (achtergrond)           ║
║  --color-bg-secondary:    #121830   (kaarten, secties)      ║
║  --color-bg-elevated:     #1A2040   (modals, dropdowns)     ║
║  --color-text-primary:    #F5F5F5   (koppen, body)         ║
║  --color-text-secondary:  #B8BDD4   (subtekst, labels)     ║
║  --color-text-muted:      #6B7094   (placeholders, hints)  ║
║  --color-accent:          #DBB171   (goud — blijft gelijk) ║
║  --color-accent-hover:    #E8C48E   (goud lichter)         ║
║  --color-accent-subtle:   #DBB17125 (goud 15%)             ║
║  --color-success:         #3DA567   (afgerond, check)      ║
║  --color-warning:         #E69B1A   (aandacht, gemist)     ║
║  --color-error:           #E05A4F   (fout, destructief)    ║
║  --color-border:          #2A3050   (lijnen, scheiding)    ║
╚══════════════════════════════════════════════════════════════╝
```

**Dark/Light mode:** Implementeer via `data-theme="light|dark"` attribuut op `<html>`. Gebruik CSS custom properties op `:root` en `[data-theme="dark"]`. Standaard: volg `prefers-color-scheme`, gebruiker kan handmatig wisselen in Settings. Voorkeur opslaan in localStorage.

### 2.2 Typografie

| Rol | Font | Gewicht | Grootte (desktop) | Grootte (mobile) |
|-----|------|---------|-------------------|------------------|
| Display / Hero | Bellefair | 400 | 48px / 3rem | 32px / 2rem |
| H1 | Bellefair | 400 | 36px / 2.25rem | 28px / 1.75rem |
| H2 | Bellefair | 400 | 28px / 1.75rem | 22px / 1.375rem |
| H3 | Bellefair | 400 | 22px / 1.375rem | 18px / 1.125rem |
| Body | Source Sans 3 | 400 / 600 | 16px / 1rem | 16px / 1rem |
| Small / Caption | Source Sans 3 | 400 | 14px / 0.875rem | 14px / 0.875rem |
| Label / Button | Source Sans 3 | 600 | 14px / 0.875rem | 14px / 0.875rem |
| Mono (timer) | JetBrains Mono | 400 | 48px / 3rem | 36px / 2.25rem |

**Laden:** Google Fonts via `<link>` in Astro `<head>` met `display=swap`. Bellefair voor alles wat premium en groot moet voelen, Source Sans 3 voor leesbaarheid.

### 2.3 Spacing & Layout Schaal

```css
--space-1:  4px;    /* 0.25rem */
--space-2:  8px;    /* 0.5rem  */
--space-3:  12px;   /* 0.75rem */
--space-4:  16px;   /* 1rem    */
--space-5:  20px;   /* 1.25rem */
--space-6:  24px;   /* 1.5rem  */
--space-8:  32px;   /* 2rem    */
--space-10: 40px;   /* 2.5rem  */
--space-12: 48px;   /* 3rem    */
--space-16: 64px;   /* 4rem    */
--space-20: 80px;   /* 5rem    */

--radius-sm:  4px;
--radius-md:  8px;
--radius-lg:  12px;
--radius-xl:  16px;
--radius-full: 9999px;
```

### 2.4 Schaduwen & Diepte

```css
/* Light mode */
--shadow-sm:    0 1px 2px rgba(7, 19, 51, 0.06);
--shadow-md:    0 4px 12px rgba(7, 19, 51, 0.08);
--shadow-lg:    0 8px 24px rgba(7, 19, 51, 0.12);
--shadow-xl:    0 16px 48px rgba(7, 19, 51, 0.16);
--shadow-glow:  0 0 20px rgba(219, 177, 113, 0.25);  /* goud glow voor actieve elementen */

/* Dark mode: gebruik rgba met hogere alpha + zwart in plaats van navy */
--shadow-sm:    0 1px 2px rgba(0, 0, 0, 0.20);
--shadow-md:    0 4px 12px rgba(0, 0, 0, 0.30);
--shadow-lg:    0 8px 24px rgba(0, 0, 0, 0.40);
--shadow-xl:    0 16px 48px rgba(0, 0, 0, 0.50);
--shadow-glow:  0 0 24px rgba(219, 177, 113, 0.20);
```

### 2.5 Animaties & Transities

Alle animaties zijn **subtiel en functioneel** — geen decoratieve animaties.

```css
--transition-fast:    150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base:    250ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow:    400ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-spring:  500ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

| Trigger | Animatie | Duur |
|---------|----------|------|
| Pagina mount | Fade-in + translateY(8px→0) | 250ms |
| Kaart/sectie verschijnen | Staggered fade (50ms delay per item) | 250ms |
| Toggle/checkbox | Scale bounce (1→1.15→1) | 300ms spring |
| Progress bar update | Width transition | 400ms ease |
| Modale overlay | Backdrop fade + content scale(0.96→1) | 250ms |
| Pomodoro timer tick | Geen animatie (performance) | — |
| Pomodoro start/pauze | Pulsating glow ring | 2000ms ease infinite |
| Notificatie/toast | Slide-in van rechts + fade | 300ms |
| Dag afsluiten | Checkmark draw SVG | 600ms ease |
| Theme switch | Color transition op alle variabelen | 300ms |

### 2.6 Breakpoints (Mobile-First)

```css
/* Basis: mobile (<640px) */
@media (min-width: 640px)  { /* sm  — grote telefoons, kleine tablets */ }
@media (min-width: 768px)  { /* md  — tablets */ }
@media (min-width: 1024px) { /* lg  — desktop */ }
@media (min-width: 1280px) { /* xl  — brede schermen */ }
```

### 2.7 Iconen

Gebruik **Lucide Icons** (lucide-react). Consistent 20px voor inline, 24px voor navigatie. Stroke-width: 1.75.

---

## 3. Architectuur & Projectstructuur

### 3.1 Technologie-keuzes

| Onderdeel | Keuze | Reden |
|-----------|-------|-------|
| Meta-framework | Astro 5.x | Statische pagina's + eilanden van interactiviteit |
| UI-framework | React 19 | Complexe interactieve componenten (timer, formulieren) |
| Styling | Custom CSS3 | Genest per component, geen utility-framework |
| State management | React Context + useReducer | Lokaal per feature, geen global store nodig in v1 |
| Offline opslag | IndexedDB (via idb-keyval of Dexie) | Offline-first voor dag-documenten |
| Routing | Astro file-based routing | Pagina's als .astro, interactieve eilanden als React |
| i18n | astro-i18n of eigen JSON-based | NL (standaard), EN, DE |
| Formulieren | React Hook Form + Zod | Consistente validatie met backend |
| Datum/Tijd | date-fns | Lichtgewicht, tree-shakeable, locale support |
| Analytics | Google Tag Manager → GA4 + GSC | Eén script, meerdere tools |
| Hosting target | Hostinger (SSG) of Netlify (fallback) | Statische build, geen SSR nodig voor v1 |

### 3.2 Mappenstructuur

```
web/
├── public/
│   ├── fonts/                    # Self-hosted fallbacks (optioneel)
│   ├── icons/                    # Favicon, PWA icons
│   ├── og-image.png              # Social share image
│   └── manifest.json             # PWA manifest (toekomst)
│
├── src/
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── styles/
│   │   ├── global.css            # Reset, CSS vars, typografie, themes
│   │   ├── tokens.css            # Alle design tokens (kleuren, spacing, shadows)
│   │   └── utilities.css         # Kleine helpers (.sr-only, .truncate, etc.)
│   │
│   ├── i18n/
│   │   ├── config.ts             # Taalconfiguratie, default locale
│   │   ├── nl.json               # Nederlandse vertalingen
│   │   ├── en.json               # Engelse vertalingen
│   │   ├── de.json               # Duitse vertalingen
│   │   └── useTranslation.ts     # React hook voor vertalingen
│   │
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client init
│   │   ├── auth.ts               # Auth helpers (login, register, logout, refresh)
│   │   ├── api.ts                # API client (fetch wrapper met auth headers)
│   │   ├── offline.ts            # IndexedDB operaties, sync queue
│   │   ├── date.ts               # Datum helpers (docKey generatie, week/maand calc)
│   │   ├── constants.ts          # POMODORO_DURATION, MAX_POMODOROS, etc.
│   │   └── validators.ts         # Zod schemas (gedeeld met backend via shared pkg)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            # Auth state + session management
│   │   ├── useDocument.ts        # CRUD voor journal_documents
│   │   ├── usePomodoro.ts        # Timer logica, pauze, notificaties
│   │   ├── useOfflineSync.ts     # Online/offline detectie, sync trigger
│   │   ├── useTheme.ts           # Dark/light mode toggle + persist
│   │   └── useMediaQuery.ts      # Responsive hook
│   │
│   ├── context/
│   │   ├── AuthContext.tsx        # Globale auth state
│   │   ├── ThemeContext.tsx       # Theme provider
│   │   └── I18nContext.tsx        # Taal provider
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.astro        # Basis layout: sidebar + main
│   │   │   ├── AppShell.css
│   │   │   ├── Sidebar.tsx           # Navigatie (React — interactief)
│   │   │   ├── Sidebar.css
│   │   │   ├── MobileNav.tsx         # Bottom tab bar op mobile
│   │   │   ├── MobileNav.css
│   │   │   ├── Header.tsx            # Top bar: datum, streak, settings
│   │   │   ├── Header.css
│   │   │   ├── PageTransition.tsx    # Fade wrapper voor pagina content
│   │   │   └── PageTransition.css
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx + Button.css
│   │   │   ├── Input.tsx + Input.css
│   │   │   ├── Textarea.tsx + Textarea.css
│   │   │   ├── Checkbox.tsx + Checkbox.css
│   │   │   ├── Toggle.tsx + Toggle.css
│   │   │   ├── Select.tsx + Select.css
│   │   │   ├── Slider.tsx + Slider.css        # Voor levenswiel score
│   │   │   ├── ProgressBar.tsx + ProgressBar.css
│   │   │   ├── Badge.tsx + Badge.css
│   │   │   ├── Card.tsx + Card.css
│   │   │   ├── Modal.tsx + Modal.css
│   │   │   ├── Toast.tsx + Toast.css
│   │   │   ├── Tooltip.tsx + Tooltip.css
│   │   │   ├── Spinner.tsx + Spinner.css
│   │   │   ├── EmptyState.tsx + EmptyState.css
│   │   │   └── ConfirmDialog.tsx + ConfirmDialog.css
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx + LoginForm.css
│   │   │   ├── RegisterForm.tsx + RegisterForm.css
│   │   │   ├── ForgotPassword.tsx + ForgotPassword.css
│   │   │   └── OnboardingWizard.tsx + OnboardingWizard.css
│   │   │
│   │   ├── today/
│   │   │   ├── TodayScreen.tsx + TodayScreen.css         # Hoofdcontainer
│   │   │   ├── DayStartChecklist.tsx + DayStartChecklist.css
│   │   │   ├── MindsetSection.tsx + MindsetSection.css
│   │   │   ├── OneThingCard.tsx + OneThingCard.css
│   │   │   ├── TopThreeList.tsx + TopThreeList.css
│   │   │   ├── TaskItem.tsx + TaskItem.css
│   │   │   ├── OtherTasksList.tsx + OtherTasksList.css
│   │   │   ├── LifePillars.tsx + LifePillars.css
│   │   │   ├── PomodoroTimer.tsx + PomodoroTimer.css
│   │   │   ├── DayCloseFlow.tsx + DayCloseFlow.css
│   │   │   ├── CloseChecklist.tsx + CloseChecklist.css
│   │   │   ├── ReflectionForm.tsx + ReflectionForm.css
│   │   │   └── DaySummary.tsx + DaySummary.css
│   │   │
│   │   ├── planning/
│   │   │   ├── QuarterStart.tsx + QuarterStart.css       # Start Sterk wizard
│   │   │   ├── LifeWheel.tsx + LifeWheel.css             # Radarchart 1-10
│   │   │   ├── GoalEditor.tsx + GoalEditor.css            # SMART doel formulier
│   │   │   ├── MonthStart.tsx + MonthStart.css
│   │   │   ├── WeekStart.tsx + WeekStart.css
│   │   │   ├── PeriodOverview.tsx + PeriodOverview.css    # Kwartaal/maand/week overzicht
│   │   │   └── GoalProgressCard.tsx + GoalProgressCard.css
│   │   │
│   │   ├── calendar/
│   │   │   ├── CalendarView.tsx + CalendarView.css
│   │   │   ├── CalendarHeatmap.tsx + CalendarHeatmap.css  # GitHub-style heatmap
│   │   │   ├── DayDetailModal.tsx + DayDetailModal.css
│   │   │   └── MonthGrid.tsx + MonthGrid.css
│   │   │
│   │   ├── accountability/
│   │   │   ├── BuddyOverview.tsx + BuddyOverview.css
│   │   │   ├── PartnerStatus.tsx + PartnerStatus.css
│   │   │   ├── CheckinComposer.tsx + CheckinComposer.css
│   │   │   ├── PairSetup.tsx + PairSetup.css
│   │   │   └── CheckinHistory.tsx + CheckinHistory.css
│   │   │
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.tsx + AnalyticsDashboard.css
│   │   │   ├── CompletionChart.tsx + CompletionChart.css
│   │   │   ├── PomodoroChart.tsx + PomodoroChart.css
│   │   │   ├── StreakDisplay.tsx + StreakDisplay.css
│   │   │   ├── PillarAdherence.tsx + PillarAdherence.css
│   │   │   └── CorrelationInsight.tsx + CorrelationInsight.css
│   │   │
│   │   └── settings/
│   │       ├── SettingsPanel.tsx + SettingsPanel.css
│   │       ├── ProfileSection.tsx + ProfileSection.css
│   │       ├── NotificationPrefs.tsx + NotificationPrefs.css
│   │       ├── ThemeToggle.tsx + ThemeToggle.css
│   │       ├── LanguageSelector.tsx + LanguageSelector.css
│   │       └── AccountSection.tsx + AccountSection.css
│   │
│   ├── pages/
│   │   ├── index.astro                # Redirect → /today of /login
│   │   ├── login.astro
│   │   ├── register.astro
│   │   ├── forgot-password.astro
│   │   ├── onboarding.astro           # Start Sterk wizard
│   │   ├── today.astro                # Dagscherm (hoofdscherm)
│   │   ├── planning/
│   │   │   ├── index.astro            # Overzicht periodes
│   │   │   ├── quarter.astro
│   │   │   ├── month.astro
│   │   │   └── week.astro
│   │   ├── calendar.astro
│   │   ├── accountability.astro
│   │   ├── analytics.astro
│   │   └── settings.astro
│   │
│   └── env.d.ts                       # Astro environment types
│
├── astro.config.mjs
├── tsconfig.json
├── .env.example
└── package.json
```

### 3.3 Component Conventies

**Naamgeving:**
- Componenten: PascalCase (`DayStartChecklist.tsx`)
- CSS-bestanden: zelfde naam als component (`DayStartChecklist.css`)
- Hooks: camelCase met `use` prefix (`usePomodoro.ts`)
- Utilities: camelCase (`formatDate.ts`)

**CSS-architectuur:**
- Elke component heeft een eigen `.css` bestand
- CSS-klassen gebruiken BEM-achtige nesting via CSS nesting (`&__element`, `&--modifier`)
- Import CSS in het component: `import './ComponentName.css'`
- Gebruik CSS custom properties uit `tokens.css` — nooit hardcoded kleuren of spacing
- Geneste CSS voor overzichtelijkheid en onderhoudbaarheid

**Voorbeeld CSS-structuur:**
```css
/* DayStartChecklist.css */
.day-start-checklist {
  padding: var(--space-6);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);

  &__title {
    font-family: 'Bellefair', serif;
    font-size: 1.375rem;
    color: var(--color-text-primary);
    margin-bottom: var(--space-4);
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--color-border);
    transition: background var(--transition-fast);

    &:hover {
      background: var(--color-accent-subtle);
    }

    &--completed {
      opacity: 0.7;
    }
  }

  @media (min-width: 768px) {
    padding: var(--space-8);

    &__title {
      font-size: 1.75rem;
    }
  }
}
```

**Astro vs React afbakening:**
- `.astro` bestanden: pagina-layouts, statische content, SEO-meta, font loading
- `.tsx` bestanden: alles wat interactief is (formulieren, timers, toggles, modals)
- React-componenten worden als Astro islands geladen met `client:load` of `client:visible`

---

## 4. Schermen & Gebruikersflows

### 4.1 Overzicht MVP-schermen

```
┌─────────────────────────────────────────────────────────────────┐
│                        ONLY TODAY                                │
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │  AUTH     │──▶│ ONBOARD  │──▶│  TODAY   │   │ PLANNING │    │
│  │          │   │          │   │ (hoofd)  │◄─▶│          │    │
│  │ Login    │   │ Start    │   │          │   │ Quarter  │    │
│  │ Register │   │ Sterk    │   │          │   │ Month    │    │
│  │ Forgot   │   │ Wizard   │   │          │   │ Week     │    │
│  └──────────┘   └──────────┘   └────┬─────┘   └──────────┘    │
│                                      │                          │
│                    ┌─────────────────┼─────────────────┐       │
│                    │                 │                  │       │
│              ┌─────▼────┐    ┌──────▼─────┐    ┌──────▼────┐  │
│              │ CALENDAR  │    │ ACCOUNT-   │    │ ANALYTICS │  │
│              │          │    │ ABILITY    │    │           │  │
│              │ Heatmap  │    │            │    │ Charts    │  │
│              │ History  │    │ Buddy      │    │ Streaks   │  │
│              │ Detail   │    │ Check-ins  │    │ Patronen  │  │
│              └──────────┘    └────────────┘    └───────────┘  │
│                                                                │
│              ┌──────────┐                                      │
│              │ SETTINGS │                                      │
│              │          │                                      │
│              │ Profiel  │                                      │
│              │ Thema    │                                      │
│              │ Taal     │                                      │
│              │ Notif.   │                                      │
│              └──────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Auth Schermen

**Login (`/login`)**
- E-mail + wachtwoord formulier
- "Wachtwoord vergeten?" link
- "Account aanmaken" link
- Branding: logo + tagline prominent, navy achtergrond, gouden accenten
- Na succesvolle login → redirect naar `/today` (of `/onboarding` als nieuw)

**Register (`/register`)**
- E-mail + wachtwoord + wachtwoord bevestiging
- Wachtwoord-sterkte indicator (min 8 karakters)
- Akkoord voorwaarden checkbox
- Na register → automatisch naar onboarding

**Wachtwoord vergeten (`/forgot-password`)**
- E-mail invoer
- Bevestigingsmelding ("Check je inbox")
- Terug naar login link

### 4.3 Onboarding: Start Sterk (`/onboarding`)

Multi-step wizard die het kwartaal opzet. Verplicht voor nieuwe gebruikers.

**Stap 1 — Welkom**
- Hero boodschap: "Welkom bij Only Today"
- Korte uitleg van het systeem (3 bullets max)
- CTA: "Begin je kwartaal"

**Stap 2 — Levenswiel**
- 8 categorieën in een radarchart/spider diagram:
  - Werk, Plezier, Sociaal, Geven, Geld, Groei, Gezondheid, Liefde
- Per categorie: slider van 1–10
- Visuele radar-visualisatie die real-time update bij het schuiven
- Gouden lijnen op navy achtergrond (premium feel)

**Stap 3 — Kwartaaldoelen (3x)**
- Voor elk doel een kaart met:
  - Titel (verplicht)
  - "Wat is anders als ik dit bereikt heb?" (textarea)
  - "Wat gebeurt er als ik het niet bereik?" (textarea)
  - "Welke beloning geef ik mezelf?" (textarea)
  - Voortgang: 0% (handmatig, slider)
- Verplicht: exact 3 doelen

**Stap 4 — Bevestiging**
- Samenvatting van levenswiel + doelen
- CTA: "Start je eerste dag" → redirect naar `/today`

**Progress indicator:** stappenbalk bovenaan (Stap 1/4, 2/4, etc.)

### 4.4 Today Screen (`/today`) — Hoofdscherm

Dit is het hart van de app. Opgebouwd als een verticale flow van secties die je van boven naar beneden doorloopt.

**Layout:**
- Op mobile: single column, full-width secties
- Op desktop (≥1024px): max-width 720px gecentreerd, sidebar links

**Status indicator bovenaan:**
- Datum (dd-mm-yyyy format)
- Dag-status badge: "Open", "Afgesloten", "Automatisch gesloten"
- Als dag read-only is (>48u of gesloten): visuele overlay/tint + melding

**Sectie A — Dagstart Checklist**
- 4 toggles/checkboxes:
  - ☐ 8 uur geslapen
  - ☐ 3 glazen water
  - ☐ 5 min meditatie
  - ☐ 5 min mobility
- Progress ring die vult per afgevinkt item (0/4 → 4/4)
- Animatie: check-bounce bij aanvinken

**Sectie B — Mindset**
- Tekstveld: "Ik ben dankbaar voor…"
- Tekstveld: "Mijn intentie voor vandaag"
- Warm, uitnodigend design (subtle gouden rand)

**Sectie C — Planning: Je EEN**
- Prominente kaart (gouden rand, grotere typografie)
- Titel input (verplicht)
- Omschrijving textarea
- Pomodoro-planner: 1–6 tomatjes (klikbaar)
- Pomodoro-status: ○○○○○○ → ●●●○○○
- "Start Pomodoro" knop → opent PomodoroTimer

**Sectie D — Planning: Je DRIE**
- 3 kaarten onder elkaar (genummerd 1, 2, 3)
- Elk met: titel, omschrijving, pomodoro-planner
- Verplicht: alle 3 invullen
- Visueel kleiner dan EEN (hiërarchie tonen)

**Sectie E — Overige taken (optioneel)**
- Inklapbare sectie ("Parking lot")
- Vrije lijst: toevoegen/verwijderen
- Checkboxes om af te vinken
- Geen pomodoro's — gewoon een lijstje

**Sectie F — Levenszagen**
- 4 pijlers als grote toggles/kaarten:
  - 🏋️ Training
  - 🧘 Diepe ontspanning
  - 🥗 Gezonde voeding
  - 💬 Echte verbinding
- Afvinken = kaart krijgt gouden achtergrond + check-icoon
- Progress: 0/4 → 4/4

**Sectie G — Dag afronden (onderaan)**
- Knop: "Dag afronden" (goud, prominent)
- Alleen actief als EEN + DRIE zijn ingevuld
- Klikt open: DayCloseFlow (modal of nieuwe sectie)

**Pomodoro Timer (overlay/modal):**
- Grote circulaire timer (JetBrains Mono)
- 25:00 aftellend
- Naam van de actieve taak
- Knoppen: Start / Pauze / Stop
- Visueel: pulserende gouden glow-ring tijdens focus
- Bij afloop: notificatie + automatisch 5 min pauze-timer
- Teller: "Pomodoro 2/4 voor [taaknaam]"

**Day Close Flow (modal):**
- Stap 1 — Afsluit-checklist:
  - ☐ 2 uur voor slapen geen scherm
  - ☐ 3 uur voor slapen geen koolhydraten
  - ☐ Planning voor morgen gemaakt
  - ☐ Doelen bekeken
- Stap 2 — Reflectie (verplicht):
  - "Wat ging er goed?" (textarea)
  - "Waarom ging het goed?" (textarea)
  - "Hoe kan ik dit herhalen?" (textarea)
  - "Wat ging er fout?" (textarea)
  - "Waarom ging het fout?" (textarea)
  - "Wat doe ik volgende keer anders?" (textarea)
- Stap 3 — Bevestiging:
  - Samenvatting van de dag (stats)
  - Checkmark animatie (SVG draw)
  - "Goed gedaan. Rust lekker."

### 4.5 Period Planning Schermen

**Planning overzicht (`/planning`)**
- Tabs of segmented control: Kwartaal | Maand | Week
- Toont actieve periode + doelen met voortgang

**Kwartaal (`/planning/quarter`)**
- Levenswiel (read-only, met optie "Opnieuw scoren")
- 3 kwartaaldoelen met:
  - Titel
  - Voortgangsslider (handmatig, 0–100%)
  - Progressbar
  - Gekoppelde maanddoelen (links)

**Maand (`/planning/month`)**
- Maanddoelen (milestones richting kwartaal)
- Per doel: titel, beschrijving, voortgang, gekoppeld kwartaaldoel
- "Nieuw maanddoel toevoegen" knop

**Week (`/planning/week`)**
- Weekdoelen (actieblokken richting maand)
- Zelfde structuur als maand
- Week-overzicht: 7 dagen mini-status (afgerond/open/gemist)

### 4.6 Calendar / History (`/calendar`)

**Heatmap-weergave (standaard):**
- GitHub-style heatmap voor het jaar
- Kleurintensiteit = completeness score
- Gouden tinten (transparant → vol goud)
- Klik op dag → DayDetailModal

**Maandweergave (toggle):**
- Traditioneel kalenderraster
- Per dag: mini-badge (status icoon)
- Klik → detail

**DayDetailModal:**
- Samenvatting van een specifieke dag (read-only)
- Dagstart score, EEN + DRIE status, levenszagen, reflectie
- Mogelijkheid om terug te lezen

### 4.7 Accountability (`/accountability`)

**Als geen buddy gekoppeld:**
- EmptyState: uitleg + uitnodigingsflow
- "Nodig een buddy uit" → genereert invite-link of e-mail

**Als buddy gekoppeld:**
- Partner status kaart:
  - Naam/avatar
  - Vandaag: dag afgesloten? ja/nee, EEN gedaan? ja/nee, reflectie? ja/nee
  - Streak: X dagen op rij
- Check-in composer:
  - Tekstveld (max 500 karakters)
  - "Verstuur" knop
  - Max 1 per dag
- Check-in geschiedenis (lijst)

### 4.8 Analytics (`/analytics`)

**Dashboard met kaarten:**

1. **Dag-afsluiting rate** — Lijndiagram (laatste 30 dagen)
2. **Dagstart adherence** — Percentage over tijd
3. **Levenszagen adherence** — 4 mini-bars (per pijler)
4. **Pomodoro's: gepland vs gedaan** — Staafdiagram
5. **Streaks** — Grote getallen met labels ("12 dagen op rij")
6. **Correlaties** — Inzichtskaarten:
   - "Als je dagstart compleet was, sloot je 85% vaker je dag af"
   - Visueel: twee verbonden metrics met percentage

**Periode selector:** "Afgelopen 7 dagen / 30 dagen / kwartaal"

### 4.9 Settings (`/settings`)

**Secties:**

1. **Profiel** — Naam, e-mail (read-only), avatar
2. **Notificaties** — Toggles:
   - Dagstart herinnering (+ tijdkiezer)
   - Dag-afsluiting herinnering (+ tijdkiezer)
   - Push-notificaties aan/uit
   - E-mail escalaties aan/uit
3. **Weergave:**
   - Thema: Licht / Donker / Systeem
   - Taal: Nederlands / Engels / Duits
4. **Tijdzone** — Dropdown
5. **Account:**
   - Wachtwoord wijzigen
   - Account verwijderen (destructieve actie, bevestiging vereist)

---

## 5. Navigatie & Layout

### 5.1 Desktop (≥1024px)

```
┌────────────────────────────────────────────────────────┐
│ ┌──────────┐  ┌──────────────────────────────────────┐ │
│ │          │  │  Header: datum · streak · settings    │ │
│ │  SIDE    │  ├──────────────────────────────────────┤ │
│ │  BAR     │  │                                      │ │
│ │          │  │         MAIN CONTENT                 │ │
│ │  Logo    │  │         (max 720px centered)         │ │
│ │          │  │                                      │ │
│ │  Today   │  │                                      │ │
│ │  Plan    │  │                                      │ │
│ │  Cal     │  │                                      │ │
│ │  Buddy   │  │                                      │ │
│ │  Stats   │  │                                      │ │
│ │          │  │                                      │ │
│ │  ──────  │  │                                      │ │
│ │  Settings│  │                                      │ │
│ └──────────┘  └──────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

- Sidebar: 240px breed, inklapbaar naar 64px (alleen iconen)
- Navy achtergrond (#071333), gouden actieve indicator
- Logo bovenaan
- Nav items met Lucide iconen + label

### 5.2 Mobile (<1024px)

```
┌──────────────────────────┐
│  Header: logo · date ·≡  │
├──────────────────────────┤
│                          │
│     MAIN CONTENT         │
│     (full width)         │
│                          │
│                          │
├──────────────────────────┤
│  ◉ Today  📋 Plan  📊   │
│  📅 Cal  ⚙ Settings     │
└──────────────────────────┘
```

- Bottom tab bar: 5 items (Today, Planning, Calendar, Analytics, Settings)
- Accountability bereikbaar via swipe of via Planning-submenu
- Header: compact, hamburger menu voor extra opties

### 5.3 Navigatie Items

| Icoon (Lucide) | Label | Route | Badge |
|-----------------|-------|-------|-------|
| `CalendarCheck` | Vandaag | `/today` | — |
| `Target` | Planning | `/planning` | — |
| `Calendar` | Kalender | `/calendar` | — |
| `Users` | Buddy | `/accountability` | Unread check-ins |
| `BarChart3` | Analyse | `/analytics` | — |
| `Settings` | Instellingen | `/settings` | — |

---

## 6. Offline-First Strategie

### 6.1 Architectuur

```
┌──────────────────────────────────────────────────┐
│                   BROWSER                         │
│  ┌─────────────┐    ┌──────────────────────────┐ │
│  │ React State │◄──▶│ IndexedDB (Dexie/idb)    │ │
│  │ (in-memory) │    │                          │ │
│  └──────┬──────┘    │  journal_documents       │ │
│         │           │  sync_queue              │ │
│         │           │  user_settings           │ │
│         │           └──────────┬───────────────┘ │
│         │                      │                  │
│         ▼                      ▼                  │
│  ┌──────────────────────────────────────────────┐ │
│  │          Sync Engine (useOfflineSync)        │ │
│  │  - Online? → push queue naar API            │ │
│  │  - Offline? → queue writes lokaal           │ │
│  │  - Conflict? → last-write-wins (LWW)        │ │
│  │  - Conflict met waarschuwing?               │ │
│  │    → toon melding aan gebruiker             │ │
│  │    → gebruiker kiest welke variant          │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Supabase    │
                    │  API         │
                    └──────────────┘
```

### 6.2 Sync Regels

1. **Schrijven:** Altijd eerst naar IndexedDB, dan naar sync queue
2. **Lezen:** Altijd uit IndexedDB (single source of truth lokaal)
3. **Online detectie:** `navigator.onLine` + periodieke heartbeat
4. **Sync trigger:** Bij online komen, en elke 60 seconden als online
5. **Conflict resolutie:**
   - Standaard: Last Write Wins (op `client_updated_at`)
   - Bij conflict: toon gebruiker een melding met beide versies
   - Gebruiker kiest welke variant behouden wordt
6. **Retry:** Exponential backoff bij falende syncs (max 5 retries)

### 6.3 Offline Indicators

- Subtiele banner bovenaan bij offline: "Je bent offline — wijzigingen worden opgeslagen"
- Sync-icoon in header: rotimerend bij sync, groen vinkje bij synced
- Bij conflict: toast/melding met "Er was een conflict" + keuzeknop

---

## 7. Internationalisatie (i18n)

### 7.1 Setup

- **Standaard taal:** Nederlands (NL)
- **Ondersteund:** NL, EN, DE
- **Datum format:** dd-mm-yyyy (NL standaard), configurable per locale
- **JSON-bestanden** per taal in `src/i18n/`

### 7.2 Structuur vertaalbestanden

```json
{
  "common": {
    "save": "Opslaan",
    "cancel": "Annuleren",
    "delete": "Verwijderen",
    "confirm": "Bevestigen",
    "loading": "Laden...",
    "offline": "Je bent offline",
    "syncConflict": "Er was een conflict"
  },
  "auth": {
    "login": "Inloggen",
    "register": "Account aanmaken",
    "email": "E-mailadres",
    "password": "Wachtwoord",
    "forgotPassword": "Wachtwoord vergeten?"
  },
  "today": {
    "title": "Vandaag",
    "dayStart": "Dagstart",
    "slept8Hours": "8 uur geslapen",
    "water3Glasses": "3 glazen water",
    "meditation5Min": "5 min meditatie",
    "mobility5Min": "5 min mobility",
    "gratefulFor": "Ik ben dankbaar voor...",
    "intentionForDay": "Mijn intentie voor vandaag",
    "yourOne": "Je EEN",
    "yourThree": "Je DRIE",
    "otherTasks": "Overige taken",
    "lifePillars": "Levenszagen",
    "closeDay": "Dag afronden",
    "dayCompleted": "Goed gedaan. Rust lekker."
  }
}
```

### 7.3 Hook Usage

```tsx
const { t } = useTranslation();
return <h2>{t('today.dayStart')}</h2>;
```

---

## 8. Toegankelijkheid (WCAG 2.1 AA)

### 8.1 Vereisten

- **Kleurcontrast:** Minimaal 4.5:1 voor normale tekst, 3:1 voor grote tekst
- **Focus indicators:** Zichtbare focus-ring op alle interactieve elementen (gouden ring, 2px)
- **Keyboard navigatie:** Tab-volgorde logisch, alle acties bereikbaar via keyboard
- **Screen reader:** Alle interactieve elementen hebben aria-labels, formuliervelden hebben geassocieerde labels
- **Toetsenbord shortcuts:** Escape sluit modals, Enter submit formulieren
- **Skip links:** "Spring naar inhoud" link bovenaan
- **Formulieren:** Foutmeldingen gekoppeld via `aria-describedby`, verplichte velden met `aria-required`
- **Animaties:** Respecteer `prefers-reduced-motion` — schakel animaties uit
- **Beelden/iconen:** Decoratieve iconen hebben `aria-hidden="true"`, functionele iconen hebben alt-text

### 8.2 Implementatie

```css
/* Focus ring */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Skip link */
.sr-skip-link {
  position: absolute;
  left: -9999px;
  &:focus {
    left: var(--space-4);
    top: var(--space-4);
    z-index: 9999;
  }
}
```

---

## 9. Analytics & Tracking

### 9.1 Google Tag Manager Setup

```html
<!-- In Astro <head> -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');
</script>
```

### 9.2 Events om te tracken

| Event | Trigger | Parameters |
|-------|---------|------------|
| `sign_up` | Account aangemaakt | method |
| `login` | Ingelogd | method |
| `onboarding_complete` | Start Sterk afgerond | — |
| `day_start_complete` | Alle 4 dagstart items afgevinkt | items_checked |
| `pomodoro_started` | Timer gestart | task_type (one/three) |
| `pomodoro_completed` | Timer afgelopen | task_type, duration |
| `day_closed` | Dag handmatig afgesloten | reflection_filled |
| `pillar_checked` | Levenszaag afgevinkt | pillar_name |
| `buddy_checkin_sent` | Check-in verstuurd | — |
| `theme_changed` | Thema gewisseld | theme (light/dark) |
| `language_changed` | Taal gewisseld | language |

---

## 10. Hosting & Deployment

### 10.1 Build Output

- Astro in **SSG (Static Site Generation)** modus
- Output: statische HTML/CSS/JS bestanden
- Geen server-side rendering nodig voor v1

### 10.2 Hostinger Configuratie

```
# .htaccess (Apache — Hostinger)
RewriteEngine On
RewriteBase /

# SPA fallback: stuur alle niet-bestaande paden naar index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]

# Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

### 10.3 Netlify Fallback

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 10.4 Environment Variables

```env
# .env.example
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
PUBLIC_GTM_ID=GTM-XXXXXXX
PUBLIC_APP_URL=https://app.onlytoday.nl
PUBLIC_DEFAULT_LOCALE=nl
```

---

## 11. Tone of Voice in UI

Op basis van het tone-of-voice document, gelden deze regels voor alle UI-teksten:

- **Directe aanspreking:** Altijd "je" of "jij", nooit "u"
- **Kort en krachtig:** Buttons en labels zijn bondig. "Dag afronden", niet "Klik hier om je dag af te sluiten"
- **Contrast-constructies:** "Niet plannen, maar doen." — gebruik in onboarding en lege states
- **Empathisch maar daadkrachtig:** Foutmeldingen zijn behulpzaam, geen schuldgevoel
- **Nooit vaag:** Geen "er ging iets mis", wel "We konden je dag niet opslaan. Probeer opnieuw."
- **Geen jargon:** Geen technische termen in de UI
- **Motiverend zonder cringe:** "Goed gedaan. Rust lekker." — niet "🎉 Amazing! You crushed it! 🎉"

---

## 12. Backend Integratie (API Contract)

### 12.1 API Endpoints (conform backend blueprint)

| Methode | Endpoint | Functie |
|---------|----------|---------|
| POST | `/auth/register` | Account aanmaken |
| POST | `/auth/login` | Inloggen |
| POST | `/auth/logout` | Uitloggen |
| POST | `/auth/refresh` | Token vernieuwen |
| GET | `/documents?since={timestamp}` | Sync: ophalen na timestamp |
| POST | `/documents/sync` | Sync: batch upload |
| GET | `/documents/:docType/:docKey` | Enkel document ophalen |
| PUT | `/documents/:docType/:docKey` | Document bijwerken |
| GET | `/accountability/pair` | Buddy-paar ophalen |
| POST | `/accountability/pair` | Buddy koppelen |
| POST | `/accountability/checkin` | Check-in versturen |
| GET | `/accountability/partner/status` | Partner status |
| GET | `/analytics/completion-rates` | Afsluiting percentages |
| GET | `/analytics/pomodoro-stats` | Pomodoro statistieken |
| GET | `/analytics/streaks` | Huidige streaks |
| GET | `/analytics/correlations` | Correlatie-inzichten |
| GET | `/analytics/calendar-heatmap?year=` | Heatmap data |
| GET | `/user/settings` | Instellingen ophalen |
| PUT | `/user/settings` | Instellingen bijwerken |

### 12.2 API Response Format

```typescript
// Succes
{ success: true, data: T }

// Fout
{
  success: false,
  code: "VALIDATION_ERROR" | "UNAUTHORIZED" | "DOC_LOCKED" | ...,
  message: "Leesbare foutmelding",
  details?: { field: "reden" }
}
```

### 12.3 Auth Flow

1. Login → ontvang `access_token` + `refresh_token`
2. Sla tokens op in httpOnly cookies of secure localStorage
3. Elke API call: `Authorization: Bearer {access_token}`
4. Bij 401 → automatisch refresh proberen
5. Bij refresh fail → redirect naar `/login`

---

## 13. Performance Richtlijnen

- **Lighthouse score doel:** ≥90 op alle categorieën
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s
- **Font loading:** `display: swap`, preload kritieke fonts
- **Code splitting:** Astro islands laden alleen wat nodig is
- **Afbeeldingen:** Gebruik Astro `<Image>` component, WebP/AVIF
- **CSS:** Geen ongebruikte CSS (per-component bestanden helpen hier)
- **JS bundle:** React alleen laden op pagina's die het nodig hebben

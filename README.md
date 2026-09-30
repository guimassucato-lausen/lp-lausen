# Lausen — Landing Page

Next.js 15 (App Router) · Tailwind v4 · GSAP/ScrollTrigger/SplitText · Lenis · Framer Motion · next-intl (PT/EN).

## Rodar

```bash
cp .env.example .env.local
npm install
npm run dev                  # http://localhost:3000/pt e /en
npm run build && npm start   # produção
```

## Variáveis (.env.local / Vercel)

| Var | Uso |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical, sitemap, OG |
| `NEXT_PUBLIC_APP_URL` | Links "Entrar" / "Criar conta" (plataforma) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | E-mail exibido no footer (vazio = oculto) |

## Leads

Por enquanto sem backend: o formulário valida os dados e abre o WhatsApp da mesa (`CONTACT.whatsapp` em `src/lib/site.ts`) com a mensagem preenchida. O envio dispara `generate_lead` (GTM/Ads) e `Lead` (Pixel), incluindo as UTMs da visita.

## Estrutura

- `messages/pt.json`, `messages/en.json` — todo o texto do site
- `src/components/sections/*` — seções da página
- `src/components/motion/*` — smooth scroll, reveals, split de títulos, contadores, cursor, marquee
- `src/lib/market.ts` + `src/app/api/market` — cotações (Brasil Bitcoin ticker24h, cache 30s, fallback)
- `src/components/Tracking.tsx` — GTM, Google Ads, Meta Pixel (evento `generate_lead` / `Lead` no envio do formulário)

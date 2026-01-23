# Pages UI & routes (AgroLogistic)

Liste des routes exposées par le frontend. Les chemins sont conservés pour compatibilité.

## Public

- `/` : Landing (AgroLogistic redesigned)
- `/auth` : Auth moderne (login/register)
- `/login` : Login (page dédiée)
- `/register` : Inscription
- `/verify-email` : Vérification email
- `/forgot-password` : Mot de passe oublié
- `/reset-password` : Reset mot de passe
- `/demo` : Démo / landing demo

## Marketing / contenu

### Contact
- `/contact/general`
- `/contact/support`
- `/contact/partnerships`

### Story
- `/story/eco-practices`
- `/story/fair-trade`

### Practices
- `/practices/yield-growth`
- `/practices/water-efficiency`
- `/practices/renewable-energy`

### Projects
- `/projects/eco-farm`
- `/projects/smart-irrigation`
- `/projects/logistics`

## Admin (auth requis)

### Dashboard
- `/admin/overview`
- `/admin/dashboard`

### Modules (core)
- `/admin/marketplace`
- `/admin/chat`
- `/admin/analytics`
- `/admin/rental`
- `/admin/settings`
- `/admin/profile`
- `/admin/notifications`

### Blog / Academy
- `/admin/blog`
- `/admin/blog/article`
- `/admin/blog/manage`
- `/admin/academy`

### Admin-only (gated)
- `/admin/users` (permissions)
- `/admin/products` (permissions)
- `/admin/orders` (permissions)
- `/admin/categories` (permissions)
- `/admin/reports` (permissions)
- `/admin/labor` (role: admin)
- `/admin/automation` (role: admin)
- `/admin/finance` (permissions)
- `/admin/logistics` (permissions)

### Farm modules
- `/admin/crops` (role: admin|farmer)
- `/admin/weather` (role: admin|farmer)
- `/admin/soil-water` (role: admin|farmer)
- `/admin/equipment` (role: admin|farmer)
- `/admin/tasks` (role: admin|farmer)
- `/admin/help`

### B2B / logistics UI
- `/admin/transport-calculator`
- `/admin/tracking`
- `/admin/carrier-dashboard`
- `/admin/b2b-chat`
- `/admin/affiliate-dashboard`
- `/admin/panel`
- `/admin/iot`
- `/admin/ai-insights`

## Customer (auth requis)

### Dashboard
- `/customer/overview`
- `/customer/dashboard`

### Modules (core)
- `/customer/marketplace`
- `/customer/chat`
- `/customer/analytics`
- `/customer/rental`
- `/customer/settings`
- `/customer/profile`
- `/customer/notifications`
- `/customer/blog`
- `/customer/blog/article`
- `/customer/academy`

### Farm modules
- `/customer/crops`
- `/customer/weather`
- `/customer/soil-water`
- `/customer/equipment`
- `/customer/tasks`
- `/customer/help`

### B2B / logistics UI
- `/customer/transport-calculator`
- `/customer/tracking`
- `/customer/b2b-chat`
- `/customer/iot`
- `/customer/ai-insights`
- `/customer/finance` (permissions)
- `/customer/logistics` (permissions)
- `/customer/payments` (ajouté : lié depuis la Sidebar)


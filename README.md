# KUNJO by AuraGems

**A modern jewellery e-commerce storefront built with React, TypeScript and Vite.**

KUNJO is a frontend-focused e-commerce application designed around a refined, editorial shopping experience. The project combines a responsive storefront interface with structured product data, client-side catalogue operations, persistent shopping state and automated testing.

The application is built with an emphasis on component architecture, predictable state management, reusable services, type safety and maintainable frontend engineering.

---

## Project Overview

KUNJO explores how a contemporary jewellery brand can deliver a polished digital shopping experience through a modular React application.

The storefront provides customers with a way to discover jewellery, explore collections, inspect individual products, manage a wishlist and interact with a shopping bag.

The visual direction follows a quiet-luxury aesthetic, combining warm ivory backgrounds, espresso tones, champagne-gold accents, editorial typography and product-focused layouts.

## Features

### Product Catalogue
- Browse the available jewellery catalogue.
- Search products by name, category, collection and description.
- Filter by category, price range and stock availability.
- Sort products by featured status, price, name and rating.
- Navigate catalogue results using pagination.
- Share catalogue filter state through URL query parameters.

### Product Details
- Dedicated product detail pages.
- Product descriptions, pricing, categories and availability information.
- Related product discovery through the storefront experience.

### Shopping Bag
- Add available products to the shopping bag.
- Increase and decrease item quantities.
- Remove individual products.
- Calculate item totals and the cart subtotal.
- Persist shopping bag state across page reloads.

### Wishlist
- Add and remove products from a wishlist.
- Prevent duplicate wishlist entries.
- Persist wishlist selections across page reloads.
- Add wishlist products to the shopping bag.

### Collections
- Browse curated product collections.
- Explore products associated with individual collections.

### Responsive Experience
- Responsive layouts for different screen sizes.
- Desktop and mobile navigation.
- Reusable interface components and consistent design tokens.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| TypeScript 6 | Static typing and application contracts |
| Vite 8 | Development server and production build |
| React Router | Client-side routing |
| Zustand | Application state management |
| Zustand Persist | Persistent cart and wishlist state |
| CSS3 | Responsive styling and visual design |
| Vitest | Unit and service testing |
| React Testing Library | Component and interaction testing |
| Playwright | Browser-based end-to-end testing |
| ESLint | Code quality and linting |

---

## Application Architecture

The project uses a modular structure that separates interface components, application pages, product data, business logic and state management.

```text
Kunjo/
├── .github/
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── products/
│   ├── data/
│   │   └── products.ts
│   ├── pages/
│   ├── services/
│   │   └── catalogService.ts
│   ├── store/
│   │   ├── selectors.ts
│   │   └── useStore.ts
│   ├── types/
│   │   └── product.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── tests/
│   └── example.spec.ts
├── playwright.config.ts
├── vitest.config.ts
├── package.json
└── README.md
```

### Architectural responsibilities

**Components**

Reusable interface elements for the application layout, navigation and product presentation.

**Pages**

Route-level views for the homepage, catalogue, product details, cart, wishlist and collections.

**Data**

Structured product records used by the storefront.

**Services**

Catalogue operations, including searching, filtering, sorting and pagination, are separated from the presentation layer.

**Store**

Zustand manages shopping bag and wishlist state. Persistent storage retains these selections between browser sessions.

**Types**

Shared TypeScript interfaces define product records, cart items, catalogue filters and pagination results.

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/G1thub001/Kunjo.git
cd Kunjo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL displayed by Vite, normally:

```text
http://localhost:5173
```

### 4. Create a production build

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

---

## Testing

Testing is integrated into the development workflow to verify application logic, component behaviour and important customer journeys.

### Unit and component tests

The project uses Vitest and React Testing Library.

Run the test suite:

```bash
npm run test:run
```

Generate a coverage report:

```bash
npm run test:coverage
```

### End-to-end tests

Playwright verifies key storefront interactions in real browsers.

Run all configured browser projects:

```bash
npx playwright test
```

Run Chromium tests only:

```bash
npx playwright test --project=chromium
```

Open the HTML report:

```bash
npx playwright show-report
```

### Verified test results

The project has successfully completed the following verification run:

| Test suite | Passing tests |
|---|---:|
| Catalogue service tests | 42 |
| Zustand store tests | 16 |
| Store selector tests | 17 |
| Product card tests | 10 |
| Cart page tests | 10 |
| Wishlist page tests | 10 |
| **Vitest total** | **105** |
| Playwright end-to-end tests | **14** |
| **Combined total** | **119** |

The production TypeScript check and Vite build also completed successfully.

*These figures reflect the verified development run and should be updated if the test suite changes.*

---

## Design Direction

KUNJO uses an editorial visual language inspired by contemporary luxury jewellery storefronts.

The design system includes:

- Warm ivory and cream surfaces.
- Espresso and charcoal typography.
- Champagne-gold accents.
- Playfair Display for editorial headings.
- DM Sans for interface and body text.
- Product-led imagery and spacious layouts.

The objective is to keep the shopping experience visually restrained while maintaining clear navigation and usable interactions.

---

## Current Scope and Limitations

KUNJO is currently a frontend prototype with locally managed product data and client-side application state.

The following capabilities are not yet implemented as production services:

- Backend API and database integration.
- Customer authentication and account management.
- Payment gateway integration.
- Order processing and fulfilment.
- Live inventory synchronisation.
- Supplier-linked or market-linked jewellery pricing.
- Production-grade administrative catalogue management.

Product prices and ratings currently serve as sample catalogue data. They should not be interpreted as verified market valuations or live supplier prices.

Checkout and payment processing are intentionally not represented as completed functionality.

---

## Future Development

Potential next development stages include:

1. Backend services and database integration.
2. Customer registration and authentication.
3. Secure checkout and payment processing.
4. Order management and fulfilment workflows.
5. Live inventory and product management.
6. Administrative dashboard.
7. Production deployment, monitoring and security hardening.

---

## Project Status

**Frontend implementation and automated testing completed for the current prototype scope.**

KUNJO demonstrates a structured React and TypeScript storefront, reusable frontend architecture, client-side state management, catalogue operations and automated quality assurance.

---

## Repository

[GitHub – KUNJO by AuraGems](https://github.com/G1thub001/Kunjo)

## License

The KUNJO application code is licensed under the [MIT License](LICENSE).

See the individual asset and third-party dependency terms for their respective licensing conditions.

**Built with React, TypeScript and a focus on thoughtful frontend engineering.**
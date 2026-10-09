// Example gallery. All businesses here are fictional and for illustration only.

export const EXAMPLES = [
  {
    id: 'lean-petpal', type: 'lean', name: 'PetPal Dog Walking', description: 'A complete Lean Canvas for an on-demand dog-walking app.',
    text: `@startlean
title PetPal
subtitle On-demand dog walking you can trust
author Chris
date 2026-01-15
version 1.0

segments {
  - Busy urban professionals with dogs #green
  - Pet owners who travel for work
}

earlyadopters {
  - Remote-hybrid workers in dense cities
  - Already pay for meal delivery apps
}

problem {
  - Hard to find a walker I can trust #red
  - Last-minute schedule changes leave the dog alone
  - No proof the walk actually happened
}

alternatives {
  - Asking neighbors
  - Dog daycare
  - Generic gig apps
}

uvp {
  - Vetted walkers with live GPS proof of every walk #blue
}

concept {
  - Uber for dog walking
}

solution {
  - Background-checked walker network
  - Live GPS tracking and photo updates
  - Same-day booking in two taps
}

channels {
  - Local vet partnerships
  - Instagram and neighborhood groups
  - Referral credits
}

revenue {
  - 20% commission per walk
  - Premium subscription for unlimited rebooking
}

costs {
  - Walker background checks
  - Insurance
  - App development and hosting
  - Customer acquisition
}

metrics {
  - Walks per week
  - Repeat booking rate
  - Cost to acquire a customer
}

unfair {
  - Exclusive partnerships with three large vet chains
}
@endlean
`,
  },
  {
    id: 'lean-focusflow', type: 'lean', name: 'FocusFlow App', description: 'A software-product Lean Canvas with colored notes.',
    text: `@startlean
title FocusFlow
subtitle A distraction blocker that learns your rhythm
theme blueprint

segments {
  - Freelance developers and designers
  - Graduate students
}

problem {
  - Constant notifications break deep work #red
  - Existing blockers are all-or-nothing
}

uvp {
  - Protect your best focus hours automatically
}

solution {
  - Adaptive focus schedule
  - One-tap "do not disturb" across devices
}

channels {
  - Product Hunt launch
  - Productivity newsletters
}

revenue {
  - $6/month subscription
  - Team plans
}

costs {
  - Two engineers
  - Cloud hosting
}

metrics {
  - Weekly active users
  - Focus hours protected per user
}

unfair {
  - Proprietary focus-prediction model trained on opt-in data
}
@endlean
`,
  },
  {
    id: 'bmc-roaster', type: 'bmc', name: 'Local Coffee Roaster', description: 'A Business Model Canvas for a small-batch coffee roaster with a subscription.',
    text: `@startbmc
title Ember & Oak Coffee
subtitle Small-batch roaster with a subscription box
author Chris
date 2026-02-01

partners {
  - Direct-trade farms
  - Local cafes (wholesale)
  - Packaging supplier
}

activities {
  - Sourcing green beans
  - Roasting and quality control
  - Subscription fulfillment
}

resources {
  - Roasting equipment
  - Direct-trade relationships
  - Brand and e-commerce site
}

value {
  - Fresh coffee roasted within 48 hours of shipping #blue
  - Transparent, ethically sourced beans
  - Zero-effort monthly delivery
}

relationships {
  - Personal tasting notes with each box
  - Community events at the roastery
}

channels {
  - Website and subscription portal
  - Farmers markets
  - Partner cafes
}

segments {
  - Home coffee enthusiasts #green
  - Offices and small businesses
  - Local cafes
}

costs {
  - Green coffee purchases
  - Rent and utilities
  - Shipping
  - Part-time staff
}

revenue {
  - Monthly subscriptions
  - Wholesale to cafes
  - Gift boxes and merchandise
}
@endbmc
`,
  },
  {
    id: 'bmc-streaming', type: 'bmc', name: 'Music Streaming Service', description: 'A two-sided platform business model.',
    text: `@startbmc
title StreamBeat
subtitle Freemium music streaming

partners {
  - Record labels
  - Independent artists
  - Device makers
}

activities {
  - Platform development
  - Licensing negotiations
  - Recommendation engine tuning
}

resources {
  - Music catalog licenses
  - Recommendation algorithms
  - Engineering team
}

value {
  - Millions of songs, instantly
  - Personalized discovery
  - Free tier with ads, ad-free premium
}

relationships {
  - Self-service app
  - Personalized playlists
}

channels {
  - Mobile and desktop apps
  - Smart speakers
  - App stores
}

segments {
  - Casual listeners #green
  - Music fans who pay for premium
  - Advertisers #orange
}

costs {
  - Royalty payments
  - Cloud infrastructure
  - Marketing
}

revenue {
  - Premium subscriptions
  - Advertising
}
@endbmc
`,
  },
  {
    id: 'vpc-mealkit', type: 'vpc', name: 'Meal Kit for Busy Parents', description: 'Shows how a value map fits a customer profile.',
    text: `@startvpc
title FamilyFeast
subtitle Weeknight dinners without the stress

products {
  - Weekly meal kit subscription
  - Recipe app with kid-friendly filters
}

gaincreators {
  - Recipes ready in 20 minutes #green
  - Variety that kids actually eat
}

painrelievers {
  - Pre-portioned ingredients, no waste #red
  - No planning or shopping required
}

jobs {
  - Feed the family a healthy dinner
  - Keep weeknights calm
  - Stay within a grocery budget
}

gains {
  - More time together at the table
  - Kids try new foods
}

pains {
  - Decision fatigue about what to cook
  - Wasted groceries
  - Picky eaters
}
@endvpc
`,
  },
  {
    id: 'swot-bookstore', type: 'swot', name: 'Neighborhood Bookstore', description: 'A simple SWOT analysis.',
    text: `@startswot
title Corner Pages Bookstore
subtitle Strategic snapshot, 2026

strengths {
  - Loyal local customer base #green
  - Expert, personal recommendations
  - Strong events calendar
}

weaknesses {
  - Small online presence #orange
  - Limited shelf space
  - Thin margins
}

opportunities {
  - Local-author partnerships #blue
  - Subscription book boxes
  - School and library contracts
}

threats {
  - Online retailers #red
  - Rising rent
  - Shift to e-books and audiobooks
}
@endswot
`,
  },
  {
    id: 'empathy-remote', type: 'empathy', name: 'Remote Team Lead', description: 'An empathy map for a person managing a distributed team.',
    text: `@startempathy
title Dana, Remote Team Lead
subtitle Empathy map from five user interviews

says {
  - "I never know who is blocked."
  - "Standups feel like status theater."
}

thinks {
  - Am I being fair to people in other time zones?
  - Are they actually engaged?
}

does {
  - Checks chat constantly
  - Schedules extra one-on-ones
}

feels {
  - Anxious about losing visibility #orange
  - Isolated from the team
}

pains {
  - Context scattered across tools #red
  - Meetings across time zones
}

gains {
  - A single trusted view of progress #green
  - Team that feels connected
}
@endempathy
`,
  },
  {
    id: 'roam-release', type: 'roam', name: 'Release Train Risks', description: 'A ROAM board from a SAFe PI planning session.',
    text: `@startroam
title PI 12 Risk Board
subtitle Agile Release Train, PI planning

resolved {
  - Cloud environment quota approved #green
  - Design system v3 delivered
}

owned {
  - Payments API dependency (Priya) #blue
  - Data-retention rules unclear (Marcus)
}

accepted {
  - Holiday absences in Sprint 4 #orange
  - Third-party analytics outage risk
}

mitigated {
  - Single expert on billing module: cross-training #purple
  - Risky migration behind a feature flag
}
@endroam
`,
  },
  {
    id: 'lbc-mobile', type: 'lbc', name: 'Mobile Work Orders Epic', description: 'A SAFe Lean Business Case ready for portfolio review.',
    text: `@startlbc
title Mobile Work Orders
subtitle Lean Business Case, Field Operations

epic {
  - For field technicians who lose time on paperwork, Mobile Work Orders is an app that captures jobs on site #blue
  - Unlike the paper process, it works offline and syncs automatically
}

outcomes {
  - Cut admin time per job by 30% #green
  - Raise first-visit fix rate to 85%
}

indicators {
  - 20 technicians using the MVP weekly
  - Median form completion time
}

mvp {
  - Offline job capture for one region #purple
  - Photo and signature upload
}

nfr {
  - Works offline for 8 hours
  - Encrypted customer data
}

outofscope {
  - Customer-facing portal #red
  - Replacing the billing system
}

sponsors {
  - Epic Owner: Dana, Field Operations
  - Sponsor: VP Operations
}

estimate {
  - MVP: about 3 teams for 2 PIs #orange
  - Dependency: identity service upgrade
}
@endlbc
`,
  },
  {
    id: 'ia-pi12', type: 'ia', name: 'PI 12 Inspect & Adapt', description: 'End-of-PI retrospective that turns problems into improvement items.',
    text: `@startia
title PI 12 Inspect & Adapt
subtitle Agile Release Train, end of PI

wentwell {
  - Delivered 9 of 10 PI objectives #green
  - Cross-team swarming fixed the data migration
}

improve {
  - Late integration revealed defects #orange
  - Unclear ownership of shared services
}

metrics {
  - PI predictability: 82% #blue
  - Escaped defects up 15%
}

problems {
  - Integration issues found too late #red
}

causes {
  - No shared test environment until late
  - Dependencies identified only at PI Planning
}

actions {
  - Stand up shared test environment (Priya, Sprint 1) #purple
  - Mid-PI dependency check-in (RTE)
}
@endia
`,
  },
  {
    id: 'ddd-fulfillment', type: 'ddd', name: 'Order Fulfillment Context', description: 'A bounded context canvas for the part of an online shop that ships orders.',
    text: `@startddd
title Order Fulfillment
subtitle Bounded context, online shop

name {
  - Order Fulfillment #blue
}

purpose {
  - Turn confirmed orders into shipped parcels quickly and cheaply #blue
}

classification {
  - Core domain
  - Revenue generator
  - Custom-built
}

roles {
  - Execution context
  - Gateway to carriers
}

decisions {
  - Orders over $500 need address verification #purple
  - Backorders ship when stock arrives
}

inbound {
  - Checkout: PlaceOrder (command) #green
  - Warehouse: StockLevelChanged (event)
}

language {
  - Shipment: items sent together #purple
  - Backorder: order line awaiting stock
}

outbound {
  - Carrier gateway: BookPickup (command) #orange
  - Billing: OrderShipped (event)
}

assumptions {
  - Most orders ship from one warehouse
}

metrics {
  - Orders shipped within 24h
  - Cross-team changes per month
}

questions {
  - Who owns returns? #red
  - Should address validation be separate?
}
@endddd
`,
  },
  {
    id: 'story-pizza', type: 'story', name: 'Pizza Delivery Story', description: 'A domain story session for taking a phone order through to delivery.',
    text: `@startstory
title Pizza Delivery
subtitle Domain story, as-is, pure domain

scope {
  - Customer orders by phone and gets the pizza at home #blue
  - Starts with the call, ends with payment
}

actors {
  - Customer #green
  - Cashier
  - Baker
  - Driver
}

objects {
  - Menu #orange
  - Order
  - Pizza
  - Receipt
}

activities {
  - 1. Customer orders a Pizza from the Menu #blue
  - 2. Cashier writes down the Order
  - 3. Cashier hands the Order to the Baker
  - 4. Baker bakes the Pizza
  - 5. Driver delivers the Pizza to the Customer
  - 6. Customer pays the Driver and gets a Receipt
}

events {
  - Order placed #purple
  - Pizza baked
  - Pizza delivered
}

variations {
  - Customer cancels after baking has started
  - Delivery address is out of the zone
}

language {
  - Ticket: the paper slip for the Baker
  - Rush: order jumped the queue
}

hotspots {
  - Order is written down twice #red
  - Who decides about discounts?
}

contexts {
  - Ordering (counter and phone) #purple
  - Kitchen
  - Delivery
}
@endstory
`,
  },
];

export function examplesFor(type) {
  return EXAMPLES.filter((e) => e.type === type);
}

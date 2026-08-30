# Fintech pattern research (CRED · Jupiter · Fi · Ramp · Chime · Robinhood · doxo)

Concrete patterns to apply across Zeva. Source: web research 2026-08-30.

## Home / card-first
- Card is the literal hero at top; content scrolls beneath it (Robinhood).
- Tap card → full detail/management screen (Ramp "My Wallet").
- Multi-card carousel; swiping re-scopes the content below to that card (CRED, Ramp).
- Per-card balance is primary; aggregated "net worth" number lives one layer deeper (Jupiter).
- Quick-action row directly under the card: Pay, Freeze, Add, Statements, Details (Ramp, Chime).
- Home = glanceable (active card, balance, 3–5 recent txns, spend teaser, upcoming bills); depth = management.
- Merchant cashback/offer strip (Robinhood Card Offers).

## Card management (full menu to expose)
- Freeze/Lock (recolors card; recurring still process) · View number/CVV/expiry · Add to Apple/Google Pay
- Spending limits (daily/monthly/per-txn) · Spend controls (merchant/category restrictions, auto-lock)
- PIN view/set/change · Virtual card (own txn view) · Per-card filtered transactions · Statements (PDF/CSV)
- Rewards/cashback tracker · **Often missed:** replace/report lost, dispute a charge (from txn), FAQ/Help,
  request temp limit increase, receipt capture+auto-match, view expense policy, notification prefs,
  card nickname/art, shipping/activation status.

## Analytics / insights
- Color-coded donut by category (Jupiter) · auto-categorization smart tags · top-categories ranked list w/ % share
- Merchant-level breakdown w/ logos (Fi) · month/period selector re-scopes view
- Narrative insight lines "you spent X more than last month" (premium feel) · cashflow in vs out header
- Budgets w/ alerts + progress bars (Jupiter) · monthly "report card" recap digest.
- Premium = real-time categorization, narrative over raw numbers, one-number summary + drill-down.

## Bill pay hub
- Category TILE GRID (not flat list): Rent, Utilities, Electricity, Telecom, Internet, Insurance, Fees…
- Searchable biller directory · saved billers + autopay (frequency) · due dates + layered reminders
- Unified bill calendar · payment history + downloadable receipts · pay by card or bank
- Rewards/coins on bills (CRED) · rich = category tiles + "due soon" priority + per-biller cards + autopay + rewards payoff.

## Gap analysis (2026-08-30) — prioritized build order
Biggest gap = INFLOW/collection (the core value prop; money just "appeared" in the feed).
P0: (1) Collect/Get-Paid hub, (2) **charge card-on-file [DONE — CollectPayment.tsx]**, (3) payment links + text-to-pay (SMS/QR, no-login pay page — highest ROI in healthcare), (4) invoices (itemized visit+labs+supplements, reminders, auto-match), (5) memberships/recurring (GLP-1 monthly subscriptions, auto-charge, dunning), (6) approvals flow (make "needs approval" chips real; separate approver from payer), (7) staff roles/multi-user (Owner/Bookkeeper/Front-desk), (8) trust/FDIC/sponsor-bank + HIPAA disclosure.
P1: (9) QuickBooks/Xero export, (10) receipts+auto-memo on outflows, (11) 1099/vendor tax, (12) MetaPay settlement/reconciliation proof screen, (13) Rx supply orders (BOM tied to patient), (14) reserves/sub-accounts with jobs (Profit-First buckets).
P2: (15) instant-payout rewards/streaks, (16) proactive AI insight stream tied to actions, (17) limits/controls screen, (18) failed-payment dunning/retry.
Competitors cited: Mercury/Ramp/Relay/Novo/Brex (business), CRED/Jupiter/Fi (polish), Rectangle Health/Tebra/mConsent (healthcare collection).

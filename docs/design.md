# \# Financial Intelligence UI Design Pattern

# 

# \## 1. Design Direction

# 

# \### Design personality

# 

# \*\*Groww simplicity × Kite information density × modern AI product aesthetics\*\*

# 

# The product should immediately feel:

# 

# \- premium

# \- fast

# \- clean

# \- intelligent

# \- youthful

# \- trustworthy

# \- financial

# \- slightly futuristic

# 

# It should NOT feel like:

# 

# \- a traditional bank

# \- an old stock terminal

# \- a spreadsheet

# \- an overly colorful fintech app

# \- a generic AI chatbot

# 

# The visual language should communicate:

# 

# > \*\*"Your portfolio, but it actually understands what's happening."\*\*

# 

# \---

# 

# \# 2. Core Design Philosophy

# 

# \## Calm by default. Powerful when needed.

# 

# The default interface should be extremely simple.

# 

# Advanced information appears progressively.

# 

# Example:

# 

# ```text

# Portfolio

# ₹4,82,420

# 

# +₹12,840  +2.73%

# Today

# 

# Your portfolio is moving better

# than NIFTY 50 today.

# 

# ━━━━━━━━━━━━━━━━━━━━

# 

# AI SIGNAL

# 

# 3 things changed today

# 

# ↗ INFY

# Strong earnings momentum

# 

# ⚡ DIXON

# New regulatory filing

# 

# ! RELIANCE

# Large price movement

# 

# View all →

# ```

# 

# The user should understand the screen in \*\*under 3 seconds\*\*.

# 

# \---

# 

# \# 3. Visual References

# 

# The product should take inspiration from:

# 

# \### Groww

# 

# Use for:

# 

# \- simplicity

# \- large readable numbers

# \- clean stock pages

# \- obvious primary actions

# \- information hierarchy

# \- approachable investing experience

# 

# Groww's current stock-page design includes price, percentage change, time-range controls, charts, fundamentals, financials, news, events, shareholding and related-stock sections. citeturn0search45

# 

# \### Zerodha Kite

# 

# Use for:

# 

# \- compact market information

# \- watchlists

# \- powerful stock discovery

# \- charting

# \- advanced analysis

# \- customizable workspaces

# 

# Kite's newer interface also allows customizable workspaces and widgets, while its screener combines filtering, financial metrics, stock detail and actions. citeturn0search1turn0search2

# 

# \### Our differentiation

# 

# Add:

# 

# \*\*AI-first contextual intelligence.\*\*

# 

# Instead of making the user navigate:

# 

# ```text

# Stock

# → News

# → Results

# → Annual Report

# → Financials

# → Research

# ```

# 

# we surface:

# 

# ```text

# INFY

# 

# ₹1,642.20

# +2.84%

# 

# ━━━━━━━━━━━━━━━━

# 

# WHAT'S HAPPENING

# 

# INFY is up today after

# stronger-than-expected results.

# 

# Revenue ↑

# Margin ↑

# Guidance →

# 

# 3 supporting sources

# ```

# 

# \---

# 

# \# 4. Color System

# 

# Avoid excessive color.

# 

# \### Base

# 

# Use a near-white / very-light neutral background for light mode.

# 

# Dark mode should use a deep neutral/charcoal background rather than pure black.

# 

# \### Primary

# 

# Use one signature brand accent.

# 

# Recommended:

# 

# \*\*Electric violet / indigo\*\*

# 

# This differentiates the product from the typical green-heavy Indian investment UI.

# 

# \### Semantic colors

# 

# Green:

# 

# ```text

# positive

# profit

# growth

# buy-side movement

# ```

# 

# Red:

# 

# ```text

# loss

# negative movement

# risk

# ```

# 

# Amber:

# 

# ```text

# warning

# attention

# uncertainty

# ```

# 

# Blue/violet:

# 

# ```text

# AI

# information

# system state

# ```

# 

# Important:

# 

# \*\*Don't color every card.\*\*

# 

# Color should communicate meaning, not decoration.

# 

# \---

# 

# \# 5. Typography

# 

# Use a modern geometric/sans-serif typeface.

# 

# Recommended:

# 

# ```text

# Inter

# Plus Jakarta Sans

# Geist

# ```

# 

# Hierarchy:

# 

# ```text

# Hero number

# 36–48px

# 

# Page title

# 28–32px

# 

# Section title

# 18–20px

# 

# Body

# 14–16px

# 

# Metadata

# 12–13px

# ```

# 

# Financial numbers should use tabular numerals.

# 

# Example:

# 

# ```text

# ₹4,82,420.80

# ```

# 

# Numbers should visually align vertically in tables.

# 

# \---

# 

# \# 6. Layout

# 

# \## Desktop

# 

# Use a three-zone architecture:

# 

# ```text

# ┌──────────────────────────────────────────────────────────────┐

# │ LOGO        Search stocks...        Alerts    Profile        │

# ├───────────────┬──────────────────────────────────────────────┤

# │               │                                              │

# │ Dashboard     │                                              │

# │ Portfolio     │                 MAIN CONTENT                 │

# │ Stocks        │                                              │

# │ Watchlist     │                                              │

# │ Insights      │                                              │

# │ News          │                                              │

# │ Documents     │                                              │

# │               │                                              │

# │───────────────│                                              │

# │ Settings      │                                              │

# └───────────────┴──────────────────────────────────────────────┘

# ```

# 

# Sidebar width:

# 

# \*\*220–240px\*\*

# 

# Main content:

# 

# \*\*max-width 1400–1600px\*\*

# 

# Use generous spacing.

# 

# \---

# 

# \# 7. Mobile

# 

# Mobile should NOT simply be a compressed desktop layout.

# 

# Use a dedicated mobile information hierarchy.

# 

# ```text

# ┌──────────────────────────────┐

# │ Good morning, Sadwik     ◯   │

# │                              │

# │ Portfolio                    │

# │ ₹4,82,420                    │

# │ +₹12,840  +2.73%             │

# │                              │

# │ ───────── chart ─────────    │

# │                              │

# │ AI Brief                     │

# │                              │

# │ 3 things changed today       │

# │                              │

# │ ┌──────────────────────────┐ │

# │ │ INFY ↗                   │ │

# │ │ Earnings momentum        │ │

# │ └──────────────────────────┘ │

# │                              │

# │ Holdings                     │

# │                              │

# │ INFY          ₹1,642  +2.8% │

# │ TCS           ₹3,921  +1.4% │

# │ RELIANCE      ₹2,945  -0.7% │

# │                              │

# ├──────────────────────────────┤

# │ Home  Portfolio  Discover   │

# │       Insights    Profile    │

# └──────────────────────────────┘

# ```

# 

# \---

# 

# \# 8. Navigation

# 

# \## Desktop

# 

# Primary navigation:

# 

# ```text

# Home

# Portfolio

# Markets

# Discover

# Insights

# News

# ```

# 

# Secondary:

# 

# ```text

# Documents

# Alerts

# Settings

# ```

# 

# \## Mobile

# 

# Bottom navigation:

# 

# ```text

# Home

# Portfolio

# Discover

# Insights

# Profile

# ```

# 

# \---

# 

# \# 9. Global Search

# 

# Search should be one of the strongest interactions.

# 

# Top bar:

# 

# ```text

# ⌕  Search stocks, ETFs, companies...

# ```

# 

# On click:

# 

# ```text

# ┌────────────────────────────────────────────┐

# │ Search anything...                         │

# │                                            │

# │ RECENT                                     │

# │ INFY                                       │

# │ RELIANCE                                   │

# │ DIXON                                      │

# │                                            │

# │ TRENDING                                   │

# │ NIFTY 50                                   │

# │ BANK NIFTY                                 │

# │                                            │

# │ AI SEARCH                                  │

# │ "Why is IT sector falling?"                │

# └────────────────────────────────────────────┘

# ```

# 

# The search should understand both:

# 

# ```text

# INFY

# ```

# 

# and:

# 

# ```text

# Why is Infosys falling today?

# ```

# 

# This is a major differentiation.

# 

# \---

# 

# \# 10. Home Dashboard

# 

# The home page is not a traditional market dashboard.

# 

# It is:

# 

# > \*\*Portfolio intelligence feed\*\*

# 

# Top:

# 

# ```text

# Good morning

# 

# Here's what matters today.

# ```

# 

# Then:

# 

# ```text

# Portfolio value

# ₹4,82,420

# 

# +₹12,840

# +2.73% today

# ```

# 

# Then:

# 

# ```text

# PORTFOLIO PERFORMANCE

# ```

# 

# Interactive chart.

# 

# Tabs:

# 

# ```text

# 1D  1W  1M  1Y  5Y  MAX

# ```

# 

# \---

# 

# \# 11. AI Daily Brief

# 

# This is the signature component.

# 

# ```text

# ┌───────────────────────────────────────────┐

# │ ✦ DAILY BRIEF                             │

# │                                           │

# │ Your portfolio had a strong session.     │

# │                                           │

# │ 3 things worth knowing:                   │

# │                                           │

# │ ↗ INFY                                    │

# │ Earnings improved margin expectations.   │

# │                                           │

# │ ⚡ DIXON                                  │

# │ New company filing detected.             │

# │                                           │

# │ ! RELIANCE                               │

# │ Trading volume is unusually high.        │

# │                                           │

# │ View full brief →                         │

# └───────────────────────────────────────────┘

# ```

# 

# Use subtle animated gradient/glow around the AI icon.

# 

# Do NOT animate everything.

# 

# \---

# 

# \# 12. Holdings

# 

# Holdings should look familiar to Groww/Kite users.

# 

# ```text

# MY HOLDINGS

# 

# Search holdings...

# 

# Stock       Qty     LTP       Day       P\&L

# 

# INFY        20      ₹1,642    +2.84%    +₹8,420

# TCS         10      ₹3,921    +1.21%    +₹4,120

# DIXON       5       ₹11,240   -0.42%    -₹820

# ```

# 

# On hover:

# 

# ```text

# ⋯

# ```

# 

# Actions:

# 

# ```text

# View

# Analyze

# Set alert

# Add to watchlist

# ```

# 

# \---

# 

# \# 13. Holding Card

# 

# For mobile:

# 

# ```text

# INFY

# Infosys Limited

# 

# 20 shares

# 

# ₹32,844

# +₹1,240  +3.92%

# 

# Today +2.84%

# ```

# 

# Tap opens the complete stock page.

# 

# \---

# 

# \# 14. Stock Page

# 

# This is one of the most important screens.

# 

# ```text

# INFY

# 

# Infosys Limited

# ₹1,642.20

# 

# +₹45.40  +2.84%

# 

# NSE

# 

# \[Chart]

# 

# 1D  1W  1M  1Y  5Y  MAX

# ```

# 

# Below:

# 

# ```text

# Your position

# 

# 20 shares

# Avg ₹1,520

# Invested ₹30,400

# Current ₹32,844

# P\&L +₹2,444

# ```

# 

# \---

# 

# \# 15. Stock Page Navigation

# 

# Use sticky tabs:

# 

# ```text

# Overview

# Chart

# Financials

# News

# Filings

# Events

# Peers

# AI

# ```

# 

# On mobile, horizontal scroll.

# 

# \---

# 

# \# 16. AI Stock Summary

# 

# Immediately below the chart:

# 

# ```text

# ✦ AI TAKE

# 

# INFY looks fundamentally stable, while

# recent earnings improved margin visibility.

# 

# Bullish signals

# • Revenue growth

# • Margin improvement

# • Strong cash generation

# 

# Watch-outs

# • Currency sensitivity

# • IT spending slowdown

# 

# Confidence

# ●●●●○  84%

# ```

# 

# Important:

# 

# AI must distinguish evidence from interpretation.

# 

# \---

# 

# \# 17. "Why is it moving?"

# 

# This should be a first-class interaction.

# 

# ```text

# INFY +2.84%

# 

# Why?

# 

# ┌─────────────────────────────────────────┐

# │ ✦ AI ANALYSIS                           │

# │                                         │

# │ Today's move appears connected to:     │

# │                                         │

# │ 1. Earnings update          HIGH        │

# │ 2. IT sector movement       MEDIUM      │

# │ 3. Higher trading volume    MEDIUM      │

# │                                         │

# │ Evidence →                              │

# └─────────────────────────────────────────┘

# ```

# 

# \---

# 

# \# 18. Financials

# 

# Use clean visual metrics.

# 

# ```text

# FINANCIAL PERFORMANCE

# 

# Revenue

# ₹1,62,000 Cr

# ↑ 8.4%

# 

# EBITDA

# ₹42,300 Cr

# ↑ 11.2%

# 

# PAT

# ₹31,200 Cr

# ↑ 13.1%

# ```

# 

# Then charts.

# 

# ```text

# Revenue

# 2022 ──────

# 2023 ─────────

# 2024 ───────────

# 2025 ─────────────

# 2026 ───────────────

# ```

# 

# \---

# 

# \# 19. Fundamental Score

# 

# Use a simple scorecard.

# 

# ```text

# FUNDAMENTALS

# 

# Growth          8.7/10

# Profitability   9.1/10

# Balance Sheet   8.4/10

# Cash Flow       9.0/10

# Valuation       6.8/10

# ```

# 

# Do not make this look like a guaranteed recommendation.

# 

# \---

# 

# \# 20. Filings

# 

# Instead of dumping PDFs into a list:

# 

# ```text

# FILINGS

# 

# Annual Report                     2026

# Q4 Results                        2026

# Investor Presentation             Q4

# Corporate Announcement            Aug 28

# SEBI Disclosure                   Aug 21

# ```

# 

# Each item:

# 

# ```text

# \[document icon]

# Q4 FY26 Results

# Filed 28 Aug 2026

# 

# AI summary available

# 

# Open →

# ```

# 

# \---

# 

# \# 21. Document Intelligence

# 

# Inside every document:

# 

# ```text

# Q4 FY26 RESULTS

# 

# ✦ AI SUMMARY

# 

# Revenue increased...

# Margins improved...

# Management highlighted...

# 

# KEY NUMBERS

# 

# Revenue      ₹...

# EBITDA       ₹...

# PAT          ₹...

# 

# Ask this document anything →

# ```

# 

# This is where our product becomes more than a trading app.

# 

# \---

# 

# \# 22. News

# 

# Don't create a traditional news portal.

# 

# Create:

# 

# > \*\*News that matters to your portfolio.\*\*

# 

# ```text

# TODAY FOR YOU

# 

# INFY

# 2 new stories

# 

# DIXON

# 1 filing

# 

# RELIANCE

# 4 market events

# ```

# 

# Each article:

# 

# ```text

# INFY

# 

# Infosys announces...

# 

# 2h ago · Reuters

# 

# Impact

# ●●●●○

# 

# Why it matters →

# ```

# 

# \---

# 

# \# 23. News Impact

# 

# The system should classify:

# 

# ```text

# Positive

# Negative

# Neutral

# Unclear

# ```

# 

# and:

# 

# ```text

# High

# Medium

# Low

# ```

# 

# Example:

# 

# ```text

# ↗ POSITIVE

# HIGH IMPACT

# 

# Large contract win announced.

# ```

# 

# \---

# 

# \# 24. Portfolio Insights

# 

# Create a dedicated page:

# 

# ```text

# INSIGHTS

# 

# Your portfolio is...

# 

# Growth       Strong

# Risk         Moderate

# Diversification  Medium

# Concentration High

# ```

# 

# Then:

# 

# ```text

# TOP CONTRIBUTORS

# 

# INFY      +₹8,420

# TCS       +₹4,120

# DIXON     -₹820

# ```

# 

# \---

# 

# \# 25. Risk Map

# 

# Visualize concentration:

# 

# ```text

# YOUR EXPOSURE

# 

# IT             ███████████  42%

# Financials     ███████       28%

# Consumer       ████          16%

# Industrial     ███           10%

# Other          █             4%

# ```

# 

# Then:

# 

# ```text

# ⚠ Your IT exposure is above

# the portfolio's historical range.

# ```

# 

# \---

# 

# \# 26. Discover

# 

# This should feel like a modern discovery surface.

# 

# ```text

# DISCOVER

# 

# Trending

# Top Gainers

# Top Losers

# Most Active

# 52W Highs

# 52W Lows

# 

# ────────────

# 

# AI SCREENS

# 

# High Growth

# Strong Cash Flow

# Low Debt

# Dividend

# Quality

# ```

# 

# Kite's current screener already uses preset filters such as gainers, losers, 52-week highs/lows, volatility and fundamental filters. citeturn0search2

# 

# Our differentiator:

# 

# ```text

# "Find companies with growing profit

# but falling debt."

# ```

# 

# AI converts natural language into filters.

# 

# \---

# 

# \# 27. Watchlist

# 

# Use grouped watchlists.

# 

# ```text

# MY WATCHLIST

# 

# LONG TERM

# ────────────────

# INFY

# TCS

# RELIANCE

# 

# HIGH GROWTH

# ────────────────

# DIXON

# TRENT

# ```

# 

# Kite's latest MarketWatch supports multiple watchlists, custom groups and Discover lists, which is a good usability reference. citeturn0search5

# 

# \---

# 

# \# 28. AI Command Bar

# 

# Persistent optional command bar:

# 

# ```text

# ⌘  Ask about your portfolio...

# ```

# 

# Examples:

# 

# ```text

# "Why is my portfolio down today?"

# 

# "Which stock contributes most to my risk?"

# 

# "Summarize INFY's latest results."

# 

# "What changed in my portfolio this week?"

# 

# "Show me stocks with strong cash flow."

# ```

# 

# This should feel like a \*\*command palette\*\*, not a ChatGPT clone.

# 

# \---

# 

# \# 29. AI Interaction

# 

# When opened:

# 

# ```text

# ┌───────────────────────────────────────────┐

# │ ✦ Financial Intelligence                 │

# │                                           │

# │ What do you want to know?                │

# │                                           │

# │ \[ Ask anything...                    ]    │

# │                                           │

# │ Try asking                               │

# │                                           │

# │ Why did INFY move today?                 │

# │ What changed in my portfolio?            │

# │ Summarize my biggest risks.              │

# │                                           │

# └───────────────────────────────────────────┘

# ```

# 

# \---

# 

# \# 30. AI Response Design

# 

# Avoid giant paragraphs.

# 

# Use:

# 

# ```text

# Short answer

# 

# Why

# 

# Evidence

# 

# What changed

# 

# What to watch

# 

# Sources

# ```

# 

# Example:

# 

# ```text

# INFY is up today mainly because of

# its latest earnings update.

# 

# WHY

# • Revenue growth improved

# • Margin guidance strengthened

# 

# WHAT TO WATCH

# • IT sector demand

# • USD/INR movement

# 

# Sources

# 3 official filings

# 2 news reports

# ```

# 

# \---

# 

# \# 31. Animations

# 

# Gen-Z does NOT mean excessive animations.

# 

# Use:

# 

# \### Micro-interactions

# 

# \- number count-up

# \- chart draw animation

# \- card hover lift

# \- smooth tab transitions

# \- subtle gradient movement

# \- spring transitions

# \- skeleton loading

# \- command palette scale/fade

# \- notification slide-in

# 

# \### Avoid

# 

# \- constant floating objects

# \- spinning cards

# \- excessive particles

# \- unnecessary 3D

# \- huge gradients everywhere

# \- slow page transitions

# 

# The interface should feel:

# 

# > \*\*fast, not flashy.\*\*

# 

# \---

# 

# \# 32. Stock Price Animation

# 

# When price changes:

# 

# ```text

# ₹1,642.20

# ```

# 

# animate only the changed digits subtly.

# 

# Percentage:

# 

# ```text

# +2.84%

# ```

# 

# should pulse once when the value crosses a meaningful threshold.

# 

# Don't continuously animate live numbers.

# 

# \---

# 

# \# 33. Loading State

# 

# Instead of:

# 

# ```text

# Loading...

# ```

# 

# show contextual skeletons.

# 

# For a new stock:

# 

# ```text

# DIXON

# 

# Preparing your intelligence...

# 

# ✓ Company identified

# ✓ Market data connected

# ⏳ Fetching latest filings

# ⏳ Reading financial reports

# ○ Building AI context

# ```

# 

# \---

# 

# \# 34. New Stock Experience

# 

# This is a signature interaction.

# 

# User adds:

# 

# ```text

# DIXON

# ```

# 

# Immediately:

# 

# ```text

# ┌─────────────────────────────────────────┐

# │ ✦ DIXON is new to your portfolio       │

# │                                         │

# │ We're building its intelligence.        │

# │                                         │

# │ Market data             ✓               │

# │ Company profile         ✓               │

# │ News                    ✓               │

# │ Financial filings       ⏳              │

# │ AI analysis             ○               │

# │                                         │

# │ You can continue using the app.         │

# └─────────────────────────────────────────┘

# ```

# 

# No blocking modal.

# 

# \---

# 

# \# 35. Empty States

# 

# Never show:

# 

# ```text

# No data found.

# ```

# 

# Instead:

# 

# ```text

# We're still building this company's

# intelligence.

# 

# Check back shortly.

# ```

# 

# With:

# 

# ```text

# \[ Continue exploring ]

# ```

# 

# \---

# 

# \# 36. Data Source UI

# 

# Users should be able to inspect evidence.

# 

# Example:

# 

# ```text

# SOURCE

# 

# NSE

# Q4 FY26 Results

# Filed 28 Aug 2026

# 

# \[ View filing ]

# ```

# 

# For AI:

# 

# ```text

# Based on 4 sources

# 

# NSE · 2 filings

# SEBI · 1 filing

# Marketaux · 1 article

# ```

# 

# This creates trust.

# 

# \---

# 

# \# 37. Confidence UI

# 

# Do not show arbitrary confidence scores everywhere.

# 

# Use confidence only where useful.

# 

# ```text

# AI confidence

# High

# ```

# 

# or:

# 

# ```text

# Evidence strength

# Strong

# ```

# 

# For uncertain events:

# 

# ```text

# Possible reason

# Medium evidence

# ```

# 

# \---

# 

# \# 38. Cards

# 

# Cards should be:

# 

# \- 12–20px radius

# \- subtle border

# \- minimal shadow

# \- generous padding

# \- consistent spacing

# 

# Avoid making every section a floating card.

# 

# Use sections directly on the background when possible.

# 

# \---

# 

# \# 39. Border Radius

# 

# Recommended:

# 

# ```text

# Cards: 16px

# Buttons: 10–12px

# Inputs: 12px

# Modal: 20px

# Pills: 999px

# ```

# 

# \---

# 

# \# 40. Buttons

# 

# Primary:

# 

# ```text

# Analyze stock

# ```

# 

# Secondary:

# 

# ```text

# View filing

# ```

# 

# Tertiary:

# 

# ```text

# Learn more →

# ```

# 

# Avoid:

# 

# ```text

# BUY NOW!!!

# ```

# 

# The product is intelligence-first, not gambling-like.

# 

# \---

# 

# \# 41. Trading Actions

# 

# If trading is eventually enabled:

# 

# ```text

# Buy

# Sell

# ```

# 

# should remain visually prominent but separated from AI analysis.

# 

# The AI should never make an action look automatically approved.

# 

# \---

# 

# \# 42. Responsive Behavior

# 

# \### Desktop

# 

# Information-rich.

# 

# \### Tablet

# 

# Two-column.

# 

# \### Mobile

# 

# Single-column.

# 

# Charts remain full width.

# 

# Tables become cards.

# 

# \---

# 

# \# 43. Accessibility

# 

# Requirements:

# 

# \- WCAG-conscious contrast

# \- keyboard navigation

# \- screen-reader labels

# \- no color-only signals

# \- scalable typography

# \- reduced-motion support

# 

# For profit/loss:

# 

# Don't rely only on:

# 

# ```text

# green / red

# ```

# 

# Also show:

# 

# ```text

# \+₹1,240

# \-₹820

# ```

# 

# \---

# 

# \# 44. Design Tokens

# 

# ```text

# spacing:

# 4

# 8

# 12

# 16

# 20

# 24

# 32

# 40

# 48

# 

# radius:

# 10

# 12

# 16

# 20

# 999

# 

# font:

# 12

# 14

# 16

# 18

# 20

# 24

# 32

# 40

# 48

# ```

# 

# Keep the system consistent.

# 

# \---

# 

# \# 45. Component Library

# 

# Create reusable components:

# 

# ```text

# AppShell

# Sidebar

# BottomNav

# SearchBar

# StockRow

# StockCard

# PriceHeader

# PriceChart

# PortfolioCard

# HoldingCard

# MetricCard

# AIInsightCard

# NewsCard

# FilingCard

# EventCard

# RiskCard

# ScoreCard

# Watchlist

# Screener

# CommandPalette

# SourceCitation

# LoadingSkeleton

# EmptyState

# AlertToast

# ```

# 

# \---

# 

# \# 46. Signature Component

# 

# The component that should visually identify our product:

# 

# \## AI Insight Card

# 

# ```text

# ┌──────────────────────────────────────────┐

# │ ✦  PORTFOLIO INTELLIGENCE               │

# │                                          │

# │ 3 things changed                        │

# │                                          │

# │ ↗ INFY                                  │

# │ Earnings improved margin outlook.       │

# │                                          │

# │ ⚡ DIXON                                │

# │ New regulatory filing detected.         │

# │                                          │

# │ ! RELIANCE                              │

# │ Unusual volume today.                   │

# │                                          │

# │ \[ View intelligence → ]                 │

# └──────────────────────────────────────────┘

# ```

# 

# Use a subtle violet/indigo glow around the ✦.

# 

# \---

# 

# \# 47. Overall Visual Formula

# 

# The final product should feel approximately:

# 

# ```text

# 40% Groww

# &#x20;   simplicity + accessibility

# 

# 30% Zerodha

# &#x20;   information architecture + market tools

# 

# 20% modern AI product

# &#x20;   command palette + contextual intelligence

# 

# 10% our own identity

# &#x20;   intelligence feed + evidence + dynamic knowledge building

# ```

# 

# Not a literal visual copy.

# 

# \---

# 

# \# 48. The "Gen-Z" Rule

# 

# Gen-Z design should mean:

# 

# \*\*less friction + more personality + faster feedback\*\*

# 

# not:

# 

# \*\*more gradients + more animations.\*\*

# 

# The app should look like something a 20-year-old developer would proudly use while still being credible enough for serious investing.

# 

# \---

# 

# \# 49. Final Visual Identity

# 

# \### Brand feeling

# 

# ```text

# Smart

# Fast

# Minimal

# Confident

# Curious

# Transparent

# ```

# 

# \### Interface feeling

# 

# ```text

# clean

# airy

# slightly futuristic

# data-rich

# AI-native

# ```

# 

# \### The first impression

# 

# User opens the app:

# 

# > \*\*"Oh, this looks like a proper investing app."\*\*

# 

# After 10 seconds:

# 

# > \*\*"Wait — it actually understands my portfolio."\*\*

# 

# That second reaction is the product's real design goal.


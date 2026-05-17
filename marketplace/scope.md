# Project Scope — Digital Asset Marketplace

**Phase 1: Internal Team Marketplace**

- **Prepared for:** Amnon — virtuality.fashion
- **Prepared by:** Ebubeker
- **Status:** Draft for discussion
- **Date:** May 2026

---

## 1. Project summary

Add a digital asset marketplace to virtuality.fashion where verified team members can upload and sell 3D garment files, and the general public can browse, purchase, and download those files. Payments are collected centrally by virtuality.fashion, with commission retained and the remainder paid out to the selling team member.

Phase 1 is internal-only on the seller side — no external onboarding.

---

## 2. Scope of work — Phase 1

### 2.1 Public-facing marketplace

- Marketplace landing page with featured listings and collections.
- Browse / filter view (by collection, file format, price tier, seller).
- Search by keyword.
- Individual listing page with title, description, preview image or render, price, file format(s), and seller name.
- Guest checkout and buyer account checkout.
- Shopping cart and checkout flow.
- Order confirmation page and email.
- Secure download access for purchased files (time-limited signed links).
- Buyer order history.

### 2.2 Seller area (team members only)

- Team-member login (Supabase auth), gated by admin verification.
- Upload interface supporting `.zprj` (CLO3D), `.bw` (Browzwear), Style3D native, `.obj`, and `.fbx`.
- Multi-file uploads per listing (e.g. one product delivered in several formats).
- Preview image / render upload.
- Listing metadata: title, description, collection, format(s), price tier.
- Edit / unpublish / delete own listings.
- Personal dashboard: active listings, sales history, earnings, pending payouts.

### 2.3 Admin area (virtuality.fashion staff)

- Team-member verification and access control.
- Commission rate per seller (15% for founding members, 20% for new collaborators from Q3 onwards), editable per account.
- Price tier management (create / edit / archive tiers).
- Collection management.
- Listing moderation (approve, hide, remove).
- Sales reporting and payout tracking per seller.
- Refund handling.
- Basic analytics: revenue, top sellers, top listings.

### 2.4 Payments and payouts

- **Stripe** (with Stripe Connect) recommended as the payment processor.
- Stripe natively supports percentage-based payment splits, which means commission and seller share are routed automatically at the point of sale. virtuality.fashion does not need to manually transfer funds to team members — payouts flow directly from Stripe to each seller's connected account.
- Commission rules (15% / 20%) configured per seller account.
- Support for major cards; Apple Pay / Google Pay where low-effort to add.
- Refund workflow with corresponding adjustments to seller balances.

### 2.5 File handling, storage, and authentication

- **Supabase** for both authentication and file storage.
- Authentication covers role-based access for buyers, sellers (team members), and admins.
- Source 3D files stored in Supabase Storage, with chunked / resumable uploads to handle large garment files.
- Public CDN for preview images.
- Source files never publicly addressable; downloads only via time-limited signed URLs issued after payment is confirmed.

### 2.6 Notifications

- Buyer: order confirmation, download link, refund confirmation.
- Seller: new sale, payout sent.
- Admin: new listing submitted, refund request.

### 2.7 Landing page alignment with the marketplace

- Update the existing virtuality.fashion landing page so its visual language, navigation, and entry points align with the new marketplace.
- Add clear marketplace entry points from the homepage — hero section, featured listings, primary navigation.
- Consistent typography, colour palette, and component styling between landing page and marketplace pages.
- Update site navigation and footer to surface the new marketplace section.
- Ensure the transition between landing page and marketplace feels like one product, not two bolted-together sites.

---

## 3. Proposal

**Total project cost: $650 USD**

This includes:

- Marketplace platform (public-facing storefront, seller area, admin area).
- Alignment of the existing landing page with the new marketplace.
- Payments integration (Stripe with Stripe Connect, including commission splits and seller payouts).

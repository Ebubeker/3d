# Analytics & Tracking Setup for Virtuality.Fashion

This document provides instructions for configuring Google Analytics 4 and Facebook Meta Pixel via Google Tag Manager.

## ✅ Completed
- **Google Tag Manager**: GTM-TJP2J4L installed in head and body
- **Facebook Domain Verification**: Meta tag added to head

## 📋 Next Steps - Configure in GTM Dashboard

### 1. Google Analytics 4 Setup

**Measurement ID**: `G-02CZMD8K51`

1. Log into [Google Tag Manager](https://tagmanager.google.com/)
2. Select container **GTM-TJP2J4L**
3. Create a new Tag:
   - **Tag Type**: Google Analytics: GA4 Configuration
   - **Measurement ID**: `G-02CZMD8K51`
   - **Triggering**: All Pages
4. Submit and publish the container

### 2. Facebook Meta Pixel Setup

**Pixel ID**: `601494386664249`

1. In the same GTM container (GTM-TJP2J4L)
2. Create a new Tag:
   - **Tag Type**: Custom HTML
   - **HTML**:
     ```html
     <!-- Meta Pixel Code -->
     <script>
     !function(f,b,e,v,n,t,s)
     {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
     n.callMethod.apply(n,arguments):n.queue.push(arguments)};
     if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
     n.queue=[];t=b.createElement(e);t.async=!0;
     t.src=v;s=b.getElementsByTagName(e)[0];
     s.parentNode.insertBefore(t,s)}(window, document,'script',
     'https://connect.facebook.net/en_US/fbevents.js');
     fbq('init', '601494386664249');
     fbq('track', 'PageView');
     </script>
     <noscript><img height="1" width="1" style="display:none"
     src="https://www.facebook.com/tr?id=601494386664249&ev=PageView&noscript=1"
     /></noscript>
     <!-- End Meta Pixel Code -->
     ```
   - **Triggering**: All Pages
3. Submit and publish the container

### 3. Verification

After publishing the GTM container:

- **GA4**: Use [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/) to verify events
- **Meta Pixel**: Use [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) Chrome extension
- **Facebook Domain**: Verify in [Meta Business Manager](https://business.facebook.com/) under Brand Safety → Domains

## 🔗 WhatsApp Link

The WhatsApp Click to Chat link has been updated to: `https://wa.me/972584666008`

Check all instances in the codebase where WhatsApp links are used.

## 📝 Notes

- Do not implement GA4 or Meta Pixel directly via hardcoded scripts
- All tracking should go through GTM to maintain centralized control
- The GTM container should be the single source of truth for all tracking pixels

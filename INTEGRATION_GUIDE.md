# 🌐 LexFlow: External Chatbot Integration Guide

This guide explains how to embed the **LexFlow AI Intake Bot** into any external law firm website (WordPress, Wix, Custom HTML, etc.).

---

## 🛠️ Option 1: Simple Iframe (Fastest)

This is the easiest way. The law firm just needs to copy-paste this `<iframe>` tag anywhere on their site.

```html
<!-- LexFlow AI Intake Bot Iframe -->
<iframe 
  src="https://lexflow.ai/api/widget/bot?firm_id=YOUR_FIRM_ID" 
  style="border:none; width:100%; height:600px; border-radius:15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" 
  title="LexFlow AI Intake"
></iframe>
```

---

## 💎 Option 2: Floating Bubble Script (Recommended)

This creates the professional **Floating Button** in the bottom-right corner, just like on our landing page.

### 1. The Script Tag
Add this to the `<head>` or before the `</body>` tag of the law firm's website:

```html
<!-- LexFlow Widget Script -->
<script src="https://lexflow.ai/scripts/widget.js" data-firm-id="YOUR_FIRM_ID" defer></script>
```

### 2. The Logic (Internal Knowledge)
The `widget.js` file does the following:
1.  **Creates a Container**: Adds a `div` to the body.
2.  **Mounts React**: Injects the `IntakeBot` component into that div.
3.  **Communication**: The bot sends data to `https://lexflow.ai/api/leads` with the `firm_id`.

---

## 📂 3. Developer Implementation List

For the LexFlow team to support "Option 2", we must:

1.  **Host the Widget Script**: Create a separate mini-bundle of the `IntakeBot` component that can run outside of our main Next.js app.
2.  **Expose the API**: Ensure `POST /api/leads` allows **CORS** (Cross-Origin Resource Sharing) so that external websites can send lead data to our database.
3.  **Firm Identification**: Pass a `firm_id` in the request so the leads are saved under the correct law firm in the database.

---

## 🛡️ CORS Configuration (Backend Fix)
In `src/app/api/leads/route.ts`, you must allow external requests:

```typescript
// Add this to your API response headers
export async function POST(req: Request) {
  const response = await handleLeadCreation(req);
  response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all sites or specify firm domain
  return response;
}
```

---

**LexFlow: Litigation Automation for the Modern Firm.**

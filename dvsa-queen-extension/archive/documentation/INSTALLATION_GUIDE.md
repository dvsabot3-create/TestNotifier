# TestNotifier Extension - Installation & Testing Guide

## 📦 Step 1: Load Extension in Chrome

### Method 1: Chrome Extension Developer Mode (Recommended for Testing)

1. **Open Chrome Extensions Page:**
   - Type in address bar: `chrome://extensions/`
   - OR: Menu (⋮) → More Tools → Extensions

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load Unpacked Extension:**
   - Click "Load unpacked" button
   - Navigate to: `/Users/mosman/Documents/DVLA BOT/dvsa-queen-extension`
   - Click "Select"

4. **Verify Installation:**
   - You should see "TestNotifier - Multi-Pupil Manager" appear in your extensions
   - Version: 2.1.0
   - Status: Enabled

5. **Pin to Toolbar:**
   - Click the puzzle icon (🧩) in Chrome toolbar
   - Find "TestNotifier"
   - Click the pin icon to keep it visible

---

## ✅ Step 2: Test the Pupil Management

### Test 1: Add Your First Pupil

1. Click the TestNotifier icon in Chrome toolbar
2. You should see the multi-pupil interface with 3 tabs
3. Click "**+ Add New Pupil**" button
4. Fill in the form:
   - **Pupil Name:** John Smith
   - **Booking Reference:** A123456789
   - **Test Date:** (pick a future date)
   - **Test Centers:** Manchester North, Birmingham South
   - **Notification Preference:** SMS + Email + WhatsApp
   - **Status:** Active - Monitoring
5. Click "**Save Pupil**"
6. Verify the pupil card appears with green "Active" badge

### Test 2: Add Multiple Pupils

Repeat the process to add 2-3 more pupils:
- **Sarah Johnson** - B987654321
- **Mike Williams** - C555666777
- **Emma Davis** - D111222333

### Test 3: Switch Active Pupil

1. Click "**Set Active**" button on different pupil cards
2. Watch the blue highlight move between cards
3. Verify the card gets the gradient background

### Test 4: Edit a Pupil

1. Click "**✏️ Edit**" on any pupil card
2. Change the test centers
3. Click "**Save Pupil**"
4. Verify changes appear on the card

### Test 5: Toggle Status

1. Click the "⏸" (pause) icon on an active pupil
2. Watch the status badge change to "Paused"
3. Click "▶" to activate again

### Test 6: View Dashboard

1. Click the "**📊 Dashboard**" tab
2. Verify stats update:
   - Total Pupils: 4
   - Active Pupils: 3 (if 1 is paused)
   - Slots Found: 0 (none found yet)
   - Success Rate: 0%

### Test 7: Check Settings

1. Click the "**⚙️ Settings**" tab
2. Toggle switches on/off
3. Click "**💾 Save Settings**"

### Test 8: Delete a Pupil

1. Go back to "**👥 Pupils**" tab
2. Click "**🗑️**" on a pupil
3. Confirm deletion
4. Verify pupil is removed

---

## 🎬 Step 3: Record Demo Video

### Recommended: Loom (Easiest & Free)

1. **Install Loom:**
   - Go to: https://www.loom.com/
   - Click "Get Loom for Free"
   - Install Chrome extension

2. **Start Recording:**
   - Click Loom icon in toolbar
   - Select: "Screen + Camera" (or just "Screen Only")
   - Click "Start Recording"

3. **Demo Script (2-3 minutes):**

   **Introduction (15 seconds):**
   - "Hi, this is TestNotifier - a multi-pupil DVSA test slot finder built specifically for driving instructors"

   **Show Problem (20 seconds):**
   - "Managing multiple pupils' test bookings manually is time-consuming..."
   - "You'd need to check 5-10 test centers for each pupil, multiple times per day"

   **Show Solution (90 seconds):**
   - Open extension popup
   - "Here's the multi-pupil dashboard"
   - Click "Add New Pupil"
   - Fill in details: "Let me add John Smith..."
   - Save pupil
   - "Now he's being monitored 24/7"
   - Add another pupil quickly: "Sarah Johnson..."
   - "I can manage all my pupils from one place"
   - Click Dashboard tab: "Track performance and success rates"
   - Click Settings: "Customize notifications per pupil"

   **Show Benefits (30 seconds):**
   - "Each pupil can have different test centers"
   - "Different notification preferences - SMS, WhatsApp, Email"
   - "Everything synced and tracked automatically"

   **Call to Action (15 seconds):**
   - "Available now for driving instructors"
   - "Visit testnotifier.co.uk to get started"

4. **Stop & Save:**
   - Click "Stop Recording"
   - Loom will auto-process the video
   - Copy the shareable link

### Alternative: Descript (More Professional)

1. **Install Descript:**
   - Go to: https://www.descript.com/
   - Download desktop app
   - Free tier available

2. **Record:**
   - New Project → Record
   - Select "Screen" or "Screen + Camera"
   - Click record and follow same demo script

3. **Edit (AI Powered):**
   - Descript will auto-transcribe
   - Remove "ums" and pauses: Composition → Remove filler words
   - Cut sections: Edit the text transcript
   - Add captions: Captions → Auto-generate

4. **Export:**
   - File → Publish → Export
   - Choose: 1080p MP4
   - Upload to YouTube/website

---

## 📸 Bonus: Take Screenshots

While testing, take screenshots for:
- ✅ Empty state (no pupils)
- ✅ Add pupil modal
- ✅ Pupil cards (2-3 visible)
- ✅ Dashboard with stats
- ✅ Settings panel
- ✅ Active pupil highlighted

**How:**
- Mac: `Cmd + Shift + 4` (then select area)
- Windows: `Windows + Shift + S`

---

## 🐛 Troubleshooting

### Extension doesn't appear:
- Check Developer Mode is ON
- Check you selected the correct folder
- Check for errors in console: chrome://extensions/ → Details → Errors

### Popup doesn't open:
- Right-click extension icon → Inspect popup
- Check browser console for JavaScript errors

### Changes don't show:
- Click refresh icon on chrome://extensions/
- OR disable and re-enable the extension

### Icon is missing:
- Icons folder needs icon16.png, icon32.png, icon48.png, icon128.png
- If missing, extension still works but shows default icon

---

## 📝 Next Steps After Demo

1. ✅ Upload video to Loom/YouTube
2. ✅ Embed on testnotifier.co.uk
3. ✅ Share with 2-3 driving instructors for feedback
4. ✅ Iterate based on feedback
5. ✅ Build payment integration (Stripe)
6. ✅ Launch publicly

---

**Ready to test? Let's go! 🚀**


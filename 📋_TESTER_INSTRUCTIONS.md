# 📋 DVSA SLOT DETECTION - TESTING INSTRUCTIONS

**For:** Friend Testing  
**Date:** November 3, 2025  
**Time Required:** 15-20 minutes  
**What We're Testing:** Chrome extension detecting available test slots on DVSA website

---

## ⚠️ **IMPORTANT - READ FIRST**

- You MUST have an **active driving test booking** to test this
- You need access to the DVSA "Change test" page
- Don't worry - we're just checking, not actually booking anything
- The extension won't make any changes unless you click "Book"

---

## 📦 **STEP 1: INSTALL THE EXTENSION (5 min)**

### **1.1 - Get the Extension File**

I'll send you a ZIP file called:
- **`testnotifier-extension-final.zip`** (if you're testing Premium)
- OR **`testnotifier-extension-professional.zip`** (if testing ADI Professional)

**Download it and remember where you saved it.**

---

### **1.2 - Extract the ZIP File**

**On Windows:**
1. Right-click the ZIP file
2. Select **"Extract All..."**
3. Click **"Extract"**
4. Remember this folder location

**On Mac:**
1. Double-click the ZIP file
2. It extracts automatically
3. Remember this folder location

---

### **1.3 - Load Extension in Chrome**

1. Open **Google Chrome**
2. Type in address bar: `chrome://extensions/`
3. Press Enter
4. In top-right corner, turn ON **"Developer mode"** (toggle switch)
5. Click **"Load unpacked"** button (top-left)
6. Navigate to the extracted folder from Step 1.2
7. Select the folder and click **"Select Folder"** (Windows) or **"Open"** (Mac)

**You should see:** A new extension card appear with "TestNotifier" and a blue icon

---

### **1.4 - Sign In to Extension**

1. Click the **puzzle icon** (🧩) in Chrome toolbar (top-right)
2. Find **"TestNotifier"** in the list
3. Click the **pin icon** to pin it to toolbar
4. Click the **TestNotifier icon** in toolbar
5. Click **"Sign In with Google"**
6. Sign in with the Google account I gave you access to
7. Wait for the extension to sync (should close the tab and reload)

**You should see:** Extension shows your subscription tier (Premium or ADI Professional)

---

## 🧪 **STEP 2: TEST SLOT DETECTION (10 min)**

### **2.1 - Go to DVSA Website**

1. In Chrome, go to: **https://driverpracticaltest.dvsa.gov.uk/**
2. Sign in with your DVSA account
3. Navigate to your **existing test booking**

**You should see:** Your current test booking details (date, time, test centre)

---

### **2.2 - Open "Change Test"**

1. Click the **"Change test"** button
2. You should land on the calendar page
3. **IMPORTANT:** Keep the extension popup CLOSED for now

**You should see:** A calendar showing available dates (some dates highlighted in green/blue)

---

### **2.3 - Open Extension and Watch**

1. Click the **TestNotifier extension icon** in toolbar
2. The extension popup should open
3. **Look at the "Activity Log" section** (bottom half of popup)

**What you should see:**

✅ **SUCCESS - Look for these messages:**
```
🔍 Scanning DVSA page...
📍 Test centre detected: [NAME OF TEST CENTRE]
📅 Found X available dates
🕐 Checking time slots for [DATE]...
✅ Found X slots on [DATE] at [TEST CENTRE]
```

❌ **ERROR - If you see these instead:**
```
❌ DVSA scan failed: [error message]
⚠️ Slot detection unavailable
⚠️ Real DVSA slot detection not implemented
```

---

### **2.4 - Click on Different Dates**

1. In the DVSA calendar, **click on a highlighted date** (one that has availability)
2. Wait for the time slots to load
3. **Check the extension popup Activity Log again**

**You should see:**
```
🕐 Checking time slots for [THE DATE YOU CLICKED]...
✅ Found slots: 09:00, 10:30, 14:00 (example times)
```

---

### **2.5 - Test Multiple Dates**

1. Click on **2-3 different available dates** in the calendar
2. Watch the Activity Log in the extension each time
3. Note if it detects the time slots correctly

---

## 📸 **STEP 3: TAKE SCREENSHOTS (3 min)**

Please take screenshots of:

### **Screenshot 1: Extension Popup**
- Click the TestNotifier icon
- Make sure Activity Log is visible
- **Take screenshot**
- Save as: `screenshot-1-extension-log.png`

### **Screenshot 2: DVSA Calendar Page**
- Go back to the DVSA calendar tab
- Make sure the calendar is visible
- **Take screenshot**
- Save as: `screenshot-2-dvsa-calendar.png`

### **Screenshot 3: Time Slots (if visible)**
- If time slots are showing on DVSA page
- **Take screenshot**
- Save as: `screenshot-3-dvsa-timeslots.png`

### **Screenshot 4: Chrome Console (IMPORTANT)**
1. On the DVSA page, press **F12** (or right-click → "Inspect")
2. Click the **"Console"** tab in the developer tools
3. Look for messages starting with:
   - `📍 DVSA Slot Detector`
   - `✅ Found X slots`
   - `❌ Detection failed`
4. **Take screenshot of the console**
5. Save as: `screenshot-4-console-logs.png`

---

## 📝 **STEP 4: REPORT BACK**

### **Send me:**

1. ✅ All 4 screenshots
2. ✅ Answers to these questions:

**Questions:**

**Q1:** Did the extension detect the test centre name correctly?
- [ ] Yes - Name: _______________
- [ ] No - It showed: _______________

**Q2:** Did it find available dates?
- [ ] Yes - How many dates: _______________
- [ ] No - Error message: _______________

**Q3:** When you clicked a date, did it show the time slots?
- [ ] Yes - It listed the correct times
- [ ] Partially - It found some but not all
- [ ] No - It showed an error

**Q4:** Did you see any errors in the Activity Log?
- [ ] No errors - Everything worked
- [ ] Yes - Error message: _______________

**Q5:** Overall, did the slot detection work?
- [ ] ✅ Worked perfectly - Found dates and times
- [ ] ⚠️ Partially worked - Found dates but not times
- [ ] ⚠️ Partially worked - Found times but not all correct
- [ ] ❌ Didn't work - Errors or no detection

**Q6:** Did the DVSA website behave normally? (No blocks, no errors)
- [ ] Yes - Website worked normally
- [ ] No - Website showed error: _______________

---

## 🚨 **WHAT TO LOOK OUT FOR (Red Flags)**

### **🔴 CRITICAL ISSUES:**

1. **DVSA Website Blocks/Errors:**
   - "Too many requests"
   - "Access denied"
   - CAPTCHA appears
   - Website freezes or crashes

2. **Extension Crashes:**
   - Extension popup won't open
   - Browser freezes
   - Error: "Extension has crashed"

3. **Wrong Data Detected:**
   - Shows wrong test centre
   - Shows dates that don't exist on DVSA
   - Shows times that aren't there

### **⚠️ MINOR ISSUES (Note but not critical):**

1. **Slow Detection:**
   - Takes more than 5 seconds to detect slots

2. **Partial Detection:**
   - Finds some dates but misses others
   - Finds some time slots but not all

3. **Console Warnings:**
   - Yellow warnings in console (not red errors)

---

## 🆘 **IF SOMETHING GOES WRONG**

### **If Extension Won't Load:**
- Make sure Developer Mode is ON
- Try reloading the extension (trash icon → reload)
- Check the folder path is correct

### **If Extension Won't Sign In:**
- Check your internet connection
- Try signing in at https://testnotifier.co.uk first
- Then reload the extension

### **If DVSA Page Won't Load:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try in incognito mode (extension must be enabled for incognito)
- Check if DVSA website is down: https://www.isitdownrightnow.com/

### **If You Get Stuck:**
- Take a screenshot of the error
- Note exactly what you clicked before the error
- Send me the details

---

## ✅ **SUCCESS CRITERIA**

**The test is SUCCESSFUL if:**

1. ✅ Extension detects the test centre name
2. ✅ Extension finds available dates in the calendar
3. ✅ Extension extracts time slots when you click a date
4. ✅ Times shown match what's on the DVSA page
5. ✅ No errors in Activity Log or Console
6. ✅ DVSA website behaves normally (no blocks)

**The test FAILS if:**

1. ❌ Extension shows "Slot detection unavailable"
2. ❌ Console shows "❌ Real DVSA slot detection not implemented"
3. ❌ DVSA website blocks or shows CAPTCHA
4. ❌ Extension crashes or won't load
5. ❌ Completely wrong data detected

---

## 📊 **EXPECTED RESULTS**

### **What SHOULD Happen:**

```
Timeline:
00:00 - You click "Change test" on DVSA
00:01 - Extension detects page type
00:02 - Extension identifies test centre
00:03 - Extension scans calendar for dates
00:04 - Extension finds 5-10 available dates
00:05 - You click a date with availability
00:06 - Extension extracts time slots
00:07 - Activity Log shows: "✅ Found 3 slots: 09:00, 14:00, 16:30"
```

### **Activity Log Should Look Like:**

```
🔍 DVSA page detected: Calendar view
📍 Test centre: Example Test Centre (Code: ABC123)
📅 Scanning calendar for available dates...
✅ Found 8 available dates in next 6 weeks
🕐 Checking time slots for 2025-11-15...
✅ Found 3 slots on 2025-11-15:
   • 09:00 AM
   • 02:00 PM
   • 04:30 PM
```

---

## 🎯 **YOUR MISSION**

**Goal:** Verify the extension can accurately detect available test slots on the real DVSA website

**Success = Extension correctly:**
1. Detects test centre ✅
2. Finds available dates ✅
3. Extracts time slots ✅
4. No errors or blocks ✅

**Failure = Extension:**
1. Can't detect slots ❌
2. Shows errors ❌
3. DVSA blocks access ❌

---

## 📞 **HELP & SUPPORT**

**If you need help:**
- Send me a screenshot
- Tell me what step you're on
- Copy any error messages

**Testing time:** 15-20 minutes total  
**Best time to test:** During office hours (9am-5pm) when DVSA is less busy

---

## 🙏 **THANK YOU!**

Your testing is crucial for verifying this works on the real DVSA website before we launch to paying customers.

**After testing, send me:**
1. 4 screenshots
2. Answers to 6 questions
3. Overall thumbs up 👍 or thumbs down 👎

**Thanks for your help! 🚀**


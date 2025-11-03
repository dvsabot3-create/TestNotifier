# 🧪 DVSA SLOT DETECTION - TESTING GUIDE
## How to Test Real Slot Detection on Live DVSA Website
**Date:** November 3, 2025  
**Purpose:** Validate that DVSASlotDetector works on actual DVSA site

---

## 🎯 WHAT WAS IMPLEMENTED

**New File:** `dvsa-slot-detector.js` (467 lines)

**Features:**
- ✅ Real calendar DOM parsing
- ✅ Multiple selector fallbacks (handles DVSA UI changes)
- ✅ Test centre extraction
- ✅ Date/time slot detection
- ✅ Cancellation vs. new slot identification
- ✅ Error handling (returns [] instead of crashing)
- ✅ Human-like delays (anti-detection)
- ✅ Validation before returning results

**Integration:**
- ✅ Added to manifest.json content_scripts
- ✅ Loads BEFORE content-script.js
- ✅ Available as `window.DVSASlotDetector`
- ✅ Content-script.js already calls it

---

## 🧪 TESTING STEPS

### Prerequisites:

1. **You need a DVSA booking** to test with
   - An existing practical test booking
   - Access to "Change test date/time" feature
   
2. **Load unpacked extension** in Chrome
   - chrome://extensions
   - Enable Developer mode
   - Load unpacked → Select READY_TO_DEPLOY_EXTENSION folder

---

### Test 1: Manual Detection Test

**Steps:**
1. Open Chrome
2. Go to: https://driverpracticaltest.dvsa.gov.uk
3. Login with your DVSA credentials
4. Navigate to "Change test date/time"
5. Open extension popup
6. Click **"Manual Check"** button
7. Open Chrome DevTools (F12)
8. Watch Console tab

**Expected Output:**
```
🔍 Starting REAL DVSA slot detection...
📍 Current page: calendar
✅ Calendar loaded
📍 Test centre: { code: "LONDON-WD", name: "London - Wood Green" }
📅 Found 5 available dates
🕐 Getting time slots for 2025-11-15...
✅ Found 3 time slots for 2025-11-15
🕐 Getting time slots for 2025-11-16...
✅ Found 2 time slots for 2025-11-16
✅ DVSA slot detection complete: 5 valid slots found
```

**If it works:**
- ✅ Real dates appear in console
- ✅ Real times extracted
- ✅ Test centre matches what you see on page
- ✅ Extension popup shows found slots

**If it fails:**
- ❌ Check Console for error messages
- ❌ Note which selector failed
- ❌ Take screenshot of DVSA page
- ❌ Report back for debugging

---

### Test 2: Selector Verification

**If Test 1 fails, run this diagnostic:**

**In Chrome DevTools Console (on DVSA page):**

```javascript
// Test calendar container
console.log('Calendar:', document.querySelector('.BookingCalendar, .booking-calendar'));

// Test dates container
console.log('Dates:', document.querySelector('.BookingCalendar-datesContainer, .calendar-dates'));

// Test available dates
console.log('Available:', document.querySelectorAll('[data-available="true"], .date-available'));

// Test test centre
console.log('Centre:', document.querySelector('#test-centre, select[name*="centre"]'));

// If any return null, the DVSA website changed its structure
```

**Report results** - I'll update selectors if needed.

---

### Test 3: Integration Test

**Test full workflow:**

1. Add a monitor in extension popup:
   - Pupil name: "Test User"
   - Licence number: (your test licence)
   - Test centres: Select your centre
   - Enable monitoring

2. Click "Start Monitoring"

3. Wait 30 seconds (default check interval)

4. Open DevTools Console

**Expected:**
```
🔍 Checking 1 monitor(s)...
🔍 Starting REAL DVSA slot detection...
📍 Current page: calendar
✅ DVSA slot detection complete: X slots found
📢 Sending notifications for Test User...
✅ Browser notification sent
```

5. Should see browser notification popup
6. Extension popup should show found slots

---

### Test 4: Error Handling Test

**Test graceful degradation:**

**On a non-DVSA page:**
1. Go to: https://google.com
2. Open extension popup
3. Click "Manual Check"

**Expected:**
```
📍 Current page: unknown
🔄 Attempting direct navigation to calendar...
⚠️ Calendar did not load
❌ Detection failed: Calendar did not load
ℹ️ Returned 0 slots (graceful)
```

**Should NOT crash** - just return empty array.

---

## 🔍 WHAT TO LOOK FOR

### ✅ Success Indicators:

1. **Real dates extracted:**
   - Dates match what you see on DVSA calendar
   - Format: YYYY-MM-DD
   - Future dates only

2. **Real times extracted:**
   - Times like "09:00", "14:30", etc.
   - Match DVSA available times

3. **Centre correct:**
   - Matches your selected test centre
   - Code + name both present

4. **No crashes:**
   - Extension continues working after check
   - Console shows completion message
   - No "undefined is not a function" errors

### ❌ Failure Indicators:

1. **Wrong dates:**
   - Old dates (past)
   - Invalid dates ("NaN-NaN-NaN")
   - Empty dates

2. **No slots found when calendar shows some:**
   - Selector mismatch
   - DVSA changed their DOM structure
   - Need to update selectors

3. **Crashes:**
   - Extension popup goes blank
   - Console shows errors
   - "Cannot read property" errors

---

## 🛠️ TROUBLESHOOTING

### Issue: "Calendar not found"

**Cause:** DVSA changed calendar selector  
**Fix:** Update `this.selectors.calendar.container` in dvsa-slot-detector.js

**How to find new selector:**
1. Open DVSA calendar page
2. Right-click calendar → Inspect
3. Note the class name or ID
4. Update selector

---

### Issue: "No dates found"

**Cause:** Date cell selector changed  
**Fix:** Update `this.selectors.calendar.dateCell`

**How to fix:**
1. Inspect a date cell in calendar
2. Note the class: `.BookingCalendar-date` or similar
3. Update selector array

---

### Issue: "Cannot get time slots"

**Cause:** Time slot selector changed or clicking doesn't work  
**Options:**
1. Update `this.selectors.timeSlots.slot`
2. Or: DVSA shows times on same page (no click needed)
3. Adjust `getTimeSlotsForDate()` logic

---

## 📊 VALIDATION CHECKLIST

Before considering detection "working":

- [ ] Detects page type correctly
- [ ] Navigates to calendar (if not there)
- [ ] Waits for calendar to load
- [ ] Extracts test centre name
- [ ] Finds available dates
- [ ] Extracts time slots for each date
- [ ] Returns valid slot objects with all fields
- [ ] Doesn't crash on errors
- [ ] Returns empty array gracefully on failure
- [ ] Integrates with content-script.js
- [ ] Sends notifications when slots found
- [ ] Works on actual DVSA website (not just mock)

---

## 🎯 NEXT STEPS AFTER TESTING

### If Detection WORKS:
1. ✅ Mark as production-ready
2. ✅ Package extension for deployment
3. ✅ Update website to remove "beta" label
4. ✅ Launch to customers

### If Detection FAILS:
1. Note which step fails
2. Check Console error messages
3. Inspect DVSA page HTML
4. Update selectors in dvsa-slot-detector.js
5. Re-test

### If DVSA Structure Changed:
1. Document new selectors
2. Update selector arrays
3. Add fallback patterns
4. Test again

---

## 🚀 DEPLOYMENT READINESS

**After successful testing:**

### Update Extension Version:
```json
// manifest.json
"version": "2.6.0"  // Increment for real detection
```

### Update Description:
```json
"description": "REAL-TIME DVSA test slot detector - Monitor unlimited pupils with instant notifications when slots appear"
```

### Package for Distribution:
```bash
cd READY_TO_DEPLOY_EXTENSION
zip -r testnotifier-extension-v2.6.0.zip . -x "*.md" -x "*.txt" -x "test-*"
```

---

## 💡 TESTING TIPS

1. **Test on different times of day** - DVSA may show different slots
2. **Test with different test centres** - Selector compatibility
3. **Test when calendar has NO slots** - Should return [] gracefully
4. **Test when calendar has MANY slots** - Should handle pagination
5. **Test error scenarios** - Network failures, page redirects

---

**Start with Test 1 on actual DVSA website. Report results!**



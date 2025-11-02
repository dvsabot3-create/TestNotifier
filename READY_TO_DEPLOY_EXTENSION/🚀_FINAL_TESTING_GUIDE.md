# 🚀 FINAL TESTING GUIDE - v2.5.0

## ⚡ QUICK START

### 1. Reload Extension
```
chrome://extensions/
→ Find "TestNotifier - Multi-Pupil Manager"
→ Click Remove
→ Click "Load unpacked"
→ Select: /Users/mosman/Documents/DVLA BOT/READY_TO_DEPLOY_EXTENSION
→ Should show v2.5.0
```

### 2. Open Extension
- Click extension icon
- Should see beautiful blue header
- 4 stats, risk indicator, emergency controls

---

## ✅ TEST CHECKLIST (15 MINUTES)

### Phase 1: Form & Validation (5 min)

**Test 1: Add New Monitor with ALL Fields**
```
1. Click "+ Add New Monitor"
2. Fill fields:
   - Name: "Test Student"
   - License: "SMITH123456AB9CD"
   - Email: "test@example.com"
   - Phone: "07123456789" (auto-formats to +44 7123456789) ✅
   - Current Date: Select any future date
   - Preferred Date: Select date BEFORE current
   - Search centres: "Manchester"
   - Add 2 centres
   - Check: Email ✅, SMS ✅, WhatsApp ❌, Browser ✅
3. Submit
4. Should see monitor in list with ALL details ✅
```

**Test 2: Validation Errors**
```
- Name: "A" → Error "Must be 2+ characters" ✅
- License: "ABC123" → Error "Need 10 more characters" ✅
- License: "12345678901234567" → Error "Invalid format" ✅
- Email: "notanemail" → Error "Invalid email format" ✅
- Phone: "123" → Error "Invalid UK mobile number" ✅
- Preferred > Current → Error "Must be BEFORE current" ✅
```

**Test 3: Duplicate Detection**
```
- Try to add license: JOHNS123456J99AB (Sarah's)
- Should show: "❌ Duplicate! Sarah Johnson already uses this license" ✅
```

**Test 4: Tier Limits** (If not Professional)
```
- Add monitors until hitting limit
- Should show: "Monitor Limit Reached" prompt ✅
- Try adding 4th test centre on Starter
- Should show: "Your starter plan allows 3 test centres" ✅
```

---

### Phase 2: Monitor Management (3 min)

**Test 5: Monitor Details**
```
1. Click Sarah Johnson card
2. Should show:
   - Name, License, Email, Phone ✅
   - Current test date ✅
   - Preferred test date (green) ✅
   - Test centres (2 listed) ✅
   - Notification badges (Email, SMS, WhatsApp if applicable) ✅
   - Status badge ✅
   - Slots found count ✅
   - Edit/Delete buttons ✅
```

**Test 6: Status Toggle**
```
- Click "Active" badge on any monitor
- Changes to "Paused" (red) ✅
- Activity log updates ✅
- Click again → Back to "Active" ✅
```

**Test 7: Delete Monitor**
```
- Click monitor card
- Click "Delete" button
- Confirmation appears
- Click OK
- Monitor removed from list ✅
- Activity log shows deletion ✅
```

---

### Phase 3: Stats & Modals (2 min)

**Test 8: Clickable Stats**
```
- Click "3 Monitors" → Shows list of all monitors ✅
- Click "4 Found" → Shows all found slots (names clickable) ✅
- Click monitor name → Opens full dashboard ✅
- Click "3/5 Rebooks" → Shows quota breakdown ✅
- Click "2m Last" → Shows check history ✅
```

**Test 9: Risk Indicator**
```
- Click "LOW RISK 12%"
- Shows risk breakdown
- Percentage, level, recommendations ✅
```

---

### Phase 4: Notifications & Booking (3 min)

**Test 10: Slot Details**
```
1. Click "3 slots found!" on Sarah Johnson
2. Should show:
   - All 3 slots with dates/times/centres ✅
   - "🚀 Book This Slot Now" buttons ✅
3. Click "Book This Slot Now"
4. If not Premium/Professional:
   - Shows "Upgrade Required" ✅
5. If Premium/Professional:
   - Shows confirmation dialog ✅
   - Lists slot details ✅
   - Click OK → Opens DVSA page ✅
   - Page should load and wait for automation ✅
```

**Test 11: Quota Enforcement**
```
(If not Professional)
- Use all rebooks
- Try to book another
- Should show: "Quota Exceeded" prompt ✅
```

---

### Phase 5: Settings & Controls (2 min)

**Test 12: Settings Tab**
```
1. Click "Settings" tab
2. Toggle auto-check → Switch animates ✅
3. Drag interval slider → Value updates ✅
4. Toggle sound → Switch animates ✅
5. Toggle notifications → Switch animates ✅
6. Click "Save Settings" → Confirmation ✅
7. Activity log shows "Settings saved" ✅
```

**Test 13: Emergency Controls**
```
- Click "🛑 STOP ALL" → Alert appears, all paused ✅
- Click "🔍 CHECK NOW" → Button shows "CHECKING..." ✅
- After 2s → Shows "Manual Check Complete" ✅
```

**Test 14: Activity Tab**
```
- Click "Activity" tab
- Shows timestamped entries ✅
- Click "Clear" → Confirmation → Clears all ✅
```

---

### Phase 6: Instructor Profile (Professional Only)

**Test 15: Instructor Tab**
```
(Only if subscription tier = Professional)

1. Tab should be visible ✅
2. Click "Instructor" tab
3. Enter ADI: "123456"
4. Enter Base Location: "Manchester"
5. Drag travel radius slider → Updates ✅
6. Check stats: Total Pupils, Active Pupils ✅
7. Click "⏸ Pause All" → Pauses all monitors ✅
8. Click "▶️ Resume All" → Resumes all monitors ✅
9. Click "Save Instructor Profile" → Saves ✅
10. Activity log shows update ✅
```

---

## 🔍 DETAILED VALIDATION TESTS

### Email Validation:
- ✅ "test@example.com" → Valid
- ❌ "test@" → Invalid
- ❌ "test" → Invalid
- ❌ "@example.com" → Invalid

### Phone Validation:
- ✅ "07123456789" → Converts to "+44 7123456789"
- ✅ "+447123456789" → Valid as-is
- ✅ "447123456789" → Converts to "+447123456789"
- ❌ "123456" → Invalid (too short)
- ❌ "+441234567890" → Invalid (not mobile 7/6)

### License Validation:
- ✅ "JOHNS123456J99AB" → Valid (5 letters + 6 digits + 5 chars)
- ❌ "JOHN123456J99AB" → Invalid (only 4 letters)
- ❌ "JOHNS12345J99AB" → Invalid (only 5 digits)
- ❌ "12345678901234567" → Invalid (all numbers)

---

## 📊 BACKEND API TESTING

### If Backend is Live:

**Test 16: Subscription Loading**
```
1. Add authToken to chrome.storage.local
2. Open extension
3. Check console for:
   "🔐 Loading subscription from backend API..."
   "✅ Subscription loaded: premium"
4. Verify tier shows in header ✅
```

**Test 17: Notification Sending**
```
1. Trigger a slot find (or use demo)
2. Check console for:
   "📢 Sending notifications for Sarah Johnson..."
   "📊 Notification results: { browser: true, email: true, sms: true }"
3. Check email inbox ✅
4. Check SMS (if configured) ✅
```

### If Backend is Not Live:
- Extension uses demo subscription
- Browser notifications still work
- Backend calls gracefully fail
- Fallback to cached data

---

## ⚠️ EXPECTED CONSOLE OUTPUT

When extension loads:
```
🚀 Initializing TestNotifier popup (COMPLETE VERSION)...
📊 Data loaded: { monitors: 3, subscription: 'premium', authenticated: false }
🔒 Subscription limits enforced: { maxMonitors: 20, maxTestCentres: 5, ... }
🔗 Setting up event listeners...
✅ All event listeners attached
✅ Popup initialized successfully
```

When adding monitor:
```
📝 Filling license details...
✅ License details filled
📍 Selecting test centre: Manchester (Bury Old Road)
✅ Test centre selected
```

When slot found:
```
📢 Sending notifications for Sarah Johnson - 2025-02-10 at 09:00
✅ Browser notification sent: <notification-id>
📊 Notification results: { browser: true, email: true, sms: false, ... }
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Not authenticated" error
**Solution:** Extension needs authToken in chrome.storage for backend API calls. In demo mode, uses fallback data.

### Issue: Instructor tab not visible
**Solution:** Only shows for Professional tier. Change demo subscription tier to 'professional' to test.

### Issue: Can't add more than X monitors
**Solution:** WORKING AS INTENDED - Subscription tier limits are enforced.

### Issue: WhatsApp checkbox disabled
**Solution:** WORKING AS INTENDED - WhatsApp only for Professional tier.

### Issue: Auto-booking shows "Upgrade Required"
**Solution:** WORKING AS INTENDED - Auto-booking only for Premium/Professional.

---

## ✅ SUCCESS CRITERIA

### All Tests Pass:
- [ ] All form validations working
- [ ] All modals close properly  
- [ ] All stats clickable
- [ ] All tabs switchable
- [ ] Emergency stop works
- [ ] Manual check works
- [ ] Add monitor with full form
- [ ] Duplicate detection working
- [ ] Email/phone validation
- [ ] Test centre search working
- [ ] Tier limits enforced
- [ ] Book slot opens DVSA page
- [ ] Instructor profile (if Professional)
- [ ] Bulk operations work
- [ ] Activity log updates
- [ ] Settings save
- [ ] Risk percentage updates

### Code Quality:
- [ ] No console errors
- [ ] No broken features
- [ ] Clean console logs
- [ ] Proper error messages
- [ ] Good user feedback

---

## 🎯 FINAL VERDICT

If all tests pass:
✅ Extension is **PRODUCTION READY**
✅ All audit requirements met
✅ 100% implementation complete
✅ Ready for Chrome Web Store
✅ Ready for customer use

---

##📞 SUPPORT

**If ANY test fails:**
1. Check browser console (F12)
2. Look for error messages
3. Verify extension version is 2.5.0
4. Try removing and re-loading extension
5. Check manifest.json is correct

**If backend tests fail:**
- Normal - backend may not be live yet
- Extension still works in demo mode
- Will auto-connect when backend is ready

---

**Version:** 2.5.0  
**Testing Level:** Comprehensive  
**Expected Duration:** 15 minutes  
**Status:** READY FOR FINAL VALIDATION 🎉


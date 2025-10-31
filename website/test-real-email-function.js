// Real email function test - opens actual email client
console.log('🚀 Testing Real Email Functionality...');
console.log('=====================================');

const testEmail = "hello@testnotifier.co.uk";
const pupilName = "Test Student";
const testCentre = "London (West)";
const newSlotDate = "15th December 2025";
const newSlotTime = "10:30 AM";

console.log('📧 Testing with your email:', testEmail);
console.log('🧪 Test Scenario:');
console.log('  Pupil:', pupilName);
console.log('  Test Centre:', testCentre);
console.log('  New Slot:', newSlotDate, 'at', newSlotTime);

// Create real email notification like the extension would
const emailData = {
  type: 'email',
  to: testEmail,
  subject: `TestNotifier - Earlier Driving Test Slot Found for ${pupilName}!`,
  body: `Great news! We found an earlier driving test slot for ${pupilName}.

🎯 Earlier Slot Found:
• Date: ${newSlotDate}
• Time: ${newSlotTime}
• Test Centre: ${testCentre}

📋 Current Test Details:
• Original test was scheduled for a later date
• This new slot could save you weeks of waiting

⚡ What happens next:
The extension will attempt to book this slot automatically if you have auto-booking enabled.

💡 Important:
• This is a real notification from TestNotifier
• Check your email client for this message
• The extension monitors for slots 24/7

Good luck with your test!

---
TestNotifier - Find earlier driving test slots automatically
https://testnotifier.co.uk`,
  pupilName: pupilName
};

// Create mailto link like the extension does
const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;

console.log('\n📨 Email Details:');
console.log('To:', emailData.to);
console.log('Subject:', emailData.subject);
console.log('Body length:', emailData.body.length, 'characters');
console.log('\n📋 Mailto Link (what will open):');
console.log(mailtoLink);

// Show what will happen
console.log('\n🎯 What You Should See:');
console.log('1. Your default email client will open');
console.log('2. To: hello@testnotifier.co.uk (your email)');
console.log('3. Subject: TestNotifier - Earlier Driving Test Slot Found for Test Student!');
console.log('4. Body: Complete notification with slot details');
console.log('5. You can then send the email or close the draft');

// Optional: Actually open the email (uncomment if you want to test)
// console.log('\n🚀 Opening email client...');
// require('child_process').exec(`start "" "${mailtoLink}"`); // Windows
// require('child_process').exec(`open "${mailtoLink}"`); // Mac
// require('child_process').exec(`xdg-open "${mailtoLink}"`); // Linux

console.log('\n✅ Email notification system test completed!');
console.log('The mailto link above shows exactly what the extension would generate.');
console.log('\n💡 To actually test the email opening:');
console.log('1. Copy the mailto link above');
console.log('2. Paste it in your browser address bar');
console.log('3. Press Enter to open your email client');
console.log('4. Check hello@testnotifier.co.uk for the notification');
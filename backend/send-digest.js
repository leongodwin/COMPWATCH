const ChangeDetector = require('./change-detector');
const EmailGenerator = require('./email-generator');
const EmailSender = require('./email-sender');
const fs = require('fs');
const path = require('path');

/**
 * Send Weekly Digest
 * Main script to generate and send weekly competitive intelligence digest
 */

async function sendWeeklyDigest() {
    console.log('📧 CompWatch AI - Weekly Digest Generator\n');
    console.log('='.repeat(50));

    // Step 1: Load current and previous reports
    console.log('\n[1/5] Loading reports...');

    const detector = new ChangeDetector();
    const currentReport = detector.loadReport('latest-report.json');

    if (!currentReport) {
        console.error('❌ Current report not found. Run `node run-report.js` first.');
        process.exit(1);
    }

    // For now, we'll simulate a previous report by using the current one
    // In production, you'd save weekly snapshots
    const previousReport = detector.loadReport('previous-report.json') || currentReport;

    console.log(`✅ Current report: ${currentReport.companies.length} companies`);
    console.log(`✅ Previous report: ${previousReport.companies.length} companies`);

    // Step 2: Detect changes
    console.log('\n[2/5] Detecting changes...');
    const { changes, error } = detector.detectChanges(currentReport, previousReport);

    if (error) {
        console.warn(`⚠️  ${error}`);
    }

    console.log(`✅ Detected ${changes.length} changes`);

    if (changes.length === 0) {
        console.log('\n📭 No significant changes this week. Skipping email.');
        return;
    }

    const top5 = detector.getTopChanges(changes, 5);
    console.log(`📊 Top 5 priorit changes selected`);

    // Step 3: Generate email content
    console.log('\n[3/5] Generating email...');
    const generator = new EmailGenerator();
    const htmlContent = generator.generateHTML(top5, currentReport);
    const plainTextContent = generator.generatePlainText(top5, currentReport);
    console.log('✅ Email content generated');

    // Step 4: Get recipients from environment
    console.log('\n[4/5] Preparing to send...');
    const recipientsEnv = process.env.DIGEST_RECIPIENTS;

    if (!recipientsEnv) {
        console.error('❌ DIGEST_RECIPIENTS not set in .env file');
        console.log('\nTo fix: Add to backend/.env:');
        console.log('DIGEST_RECIPIENTS=email1@example.com,email2@example.com');
        process.exit(1);
    }

    const recipients = recipientsEnv.split(',').map(email => email.trim());
    console.log(`📫 Recipients: ${recipients.join(', ')}`);

    // Step 5: Send email
    console.log('\n[5/5] Sending email digest...');
    const sender = new EmailSender();
    const result = await sender.sendDigest(recipients, htmlContent, plainTextContent);

    if (result.success) {
        console.log('\n✅ Email digest sent successfully!');
        console.log(`📧 Delivered to ${result.recipients} recipient(s)`);
        console.log(`🆔 Message ID: ${result.messageId}`);

        // Save current report as previous for next week
        savePreviousReport(currentReport);
    } else {
        console.error('\n❌ Failed to send email digest');
        console.error(`Error: ${result.error}`);
        if (result.details) {
            console.error('Details:', JSON.stringify(result.details, null, 2));
        }
        process.exit(1);
    }

    console.log('\n' + '='.repeat(50));
    console.log('Done! 🎉\n');
}

/**
 * Save current report as previous for next comparison
 */
function savePreviousReport(currentReport) {
    const previousPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'previous-report.json');
    fs.writeFileSync(previousPath, JSON.stringify(currentReport, null, 2));
    console.log('💾 Saved current report as previous for next week');
}

/**
 * Send test email
 */
async function sendTestEmail(testEmail) {
    console.log(`📧 Sending test email to ${testEmail}...\n`);

    const sender = new EmailSender();
    const result = await sender.sendTest(testEmail);

    if (result.success) {
        console.log('\n✅ Test email sent successfully!');
        console.log(`🆔 Message ID: ${result.messageId}`);
    } else {
        console.error('\n❌ Failed to send test email');
        console.error(`Error: ${result.error}`);
        if (result.details) {
            console.error('Details:', JSON.stringify(result.details, null, 2));
        }
        process.exit(1);
    }
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--test')) {
    const testEmailIndex = args.indexOf('--test');
    const testEmail = args[testEmailIndex + 1];

    if (!testEmail) {
        console.error('Usage: node send-digest.js --test your@email.com');
        process.exit(1);
    }

    sendTestEmail(testEmail);
} else {
    sendWeeklyDigest();
}

const sgMail = require('@sendgrid/mail');

/**
 * Email Sender
 * Handles email delivery via SendGrid
 */

class EmailSender {
    constructor() {
        this.apiKey = process.env.SENDGRID_API_KEY;
        this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'compwatch@clouddirect.com';
        this.fromName = process.env.SENDGRID_FROM_NAME || 'CompWatch AI';

        if (this.apiKey) {
            sgMail.setApiKey(this.apiKey);
        }
    }

    /**
     * Send email digest
     */
    async sendDigest(recipients, htmlContent, plainTextContent, subject) {
        if (!this.apiKey) {
            console.error('[Email] SendGrid API key not configured');
            return {
                success: false,
                error: 'SENDGRID_API_KEY not set in .env file'
            };
        }

        if (!recipients || recipients.length === 0) {
            console.error('[Email] No recipients specified');
            return {
                success: false,
                error: 'No recipients specified'
            };
        }

        const msg = {
            to: recipients,
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            subject: subject || `CompWatch Weekly Digest - ${this.getWeekRange()}`,
            text: plainTextContent,
            html: htmlContent
        };

        try {
            console.log(`[Email] Sending digest to ${recipients.length} recipient(s)...`);
            const response = await sgMail.send(msg);

            console.log('[Email] ✅ Digest sent successfully');
            return {
                success: true,
                messageId: response[0].headers['x-message-id'],
                recipients: recipients.length
            };
        } catch (error) {
            console.error('[Email] ❌ Failed to send digest:', error.message);

            if (error.response) {
                console.error('[Email] SendGrid error details:', error.response.body);
            }

            return {
                success: false,
                error: error.message,
                details: error.response ? error.response.body : null
            };
        }
    }

    /**
     * Send test email
     */
    async sendTest(testEmail) {
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #3b82f6;">CompWatch AI - Test Email</h1>
                <p>This is a test email from your CompWatch AI email digest system.</p>
                <p>If you're seeing this, your SendGrid configuration is working correctly! 🎉</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #6b7280;">
                    Sent at ${new Date().toLocaleString()}
                </p>
            </div>
        `;

        const plainText = `
CompWatch AI - Test Email

This is a test email from your CompWatch AI email digest system.

If you're seeing this, your SendGrid configuration is working correctly!

Sent at ${new Date().toLocaleString()}
        `.trim();

        return await this.sendDigest(
            [testEmail],
            htmlContent,
            plainText,
            'CompWatch AI - Test Email'
        );
    }

    getWeekRange() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const format = (date) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()}`;
        };

        return `${format(weekAgo)} - ${format(now)}, ${now.getFullYear()}`;
    }
}

module.exports = EmailSender;

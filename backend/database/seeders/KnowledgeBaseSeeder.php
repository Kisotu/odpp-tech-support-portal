<?php

namespace Database\Seeders;

use App\Models\KnowledgeBaseArticle;
use App\Models\User;
use Illuminate\Database\Seeder;

class KnowledgeBaseSeeder extends Seeder
{
    public function run(): void
    {
        if (KnowledgeBaseArticle::count() > 0) {
            return;
        }

        $admin = User::where('role', 'admin')->first();
        $ictOfficer = User::where('role', 'ict_officer')->first();

        $articles = [
            [
                'title' => 'How to Connect to Office WiFi',
                'content' => '<h2>Connecting to ODPP-WiFi</h2>
<p>Follow these steps to connect your device to the office wireless network:</p>
<ol>
<li>Open your device\'s WiFi settings</li>
<li>Select the network named <strong>ODPP-WiFi</strong></li>
<li>Enter your network credentials (same as your computer login)</li>
<li>Click Connect</li>
</ol>
<h3> Troubleshooting Tips</h3>
<ul>
<li>If you cannot see the network, move closer to a WiFi access point</li>
<li>Restart your WiFi adapter if connection fails</li>
<li>Contact ICT if you continue to have issues</li>
</ul>',
                'category' => 'network',
                'author_id' => $admin->id,
                'views' => 156,
                'is_published' => true,
            ],
            [
                'title' => 'Setting Up Outlook Email on Your Computer',
                'content' => '<h2>Microsoft Outlook Setup Guide</h2>
<p>This guide will help you configure your Outlook email client to work with the ODPP mail server.</p>
<h3>Automatic Configuration</h3>
<p>Most settings are configured automatically when you first sign in. If prompted:</p>
<ul>
<li>Email Address: your.name@odpp.go.ke</li>
<li>Password: Your computer login password</li>
</ul>
<h3>Manual Configuration</h3>
<p>If automatic setup fails, use these settings:</p>
<ul>
<li><strong>Server:</strong> mail.odpp.go.ke</li>
<li><strong>Port:</strong> 993 (SSL) or 143 (TLS)</li>
<li><strong>Incoming:</strong> IMAP</li>
<li><strong>Outgoing:</strong> SMTP port 587</li>
</ul>',
                'category' => 'email',
                'author_id' => $admin->id,
                'views' => 203,
                'is_published' => true,
            ],
            [
                'title' => 'Printer Setup and Troubleshooting',
                'content' => '<h2>Network Printer Setup</h2>
<p>To add a network printer on your Windows computer:</p>
<ol>
<li>Open <strong>Settings > Devices > Printers & Scanners</strong></li>
<li>Click "Add a printer or scanner"</li>
<li>If your printer is not found, click "The printer I want isn\'t listed"</li>
<li>Enter the printer IP address (e.g., 192.168.1.50)</li>
</ol>
<h3>Common Printer Issues</h3>
<h4>Paper Jam</h4>
<p>Turn off the printer, open all doors and covers, remove the toner cartridge, and carefully pull out any stuck paper. Check for small torn pieces.</p>
<h4>Poor Print Quality</h4>
<p>Run the printer\'s cleaning utility from the printer settings menu. Replace the toner cartridge if quality does not improve.</p>',
                'category' => 'printer',
                'author_id' => $ictOfficer->id,
                'views' => 89,
                'is_published' => true,
            ],
            [
                'title' => 'How to Request IT Support',
                'content' => '<h2>Submitting a Support Ticket</h2>
<p>Follow these steps to submit an IT support request:</p>
<ol>
<li>Log in to the Tech Support Portal</li>
<li>Click on "New Ticket" button</li>
<li>Fill in the required information:
   <ul>
   <li><strong>Title:</strong> Brief description of your issue</li>
   <li><strong>Category:</strong> Hardware, Software, Network, Printer, Email, Account, or Other</li>
   <li><strong>Priority:</strong> Low, Medium, High, or Critical</li>
   <li><strong>Description:</strong> Detailed description of your problem</li>
   </ul>
</li>
<li>Click Submit</li>
</ol>
<h3>What Happens Next?</h3>
<p>Once submitted, your ticket will be reviewed by the ICT team. You will receive updates on the status of your ticket via email.</p>
<h3>For Critical Issues</h3>
<p>For critical issues that affect work, call the ICT helpdesk directly at <strong>+254 700 100 100</strong>.</p>',
                'category' => 'other',
                'author_id' => $admin->id,
                'views' => 312,
                'is_published' => true,
            ],
            [
                'title' => 'Password Policy and Reset Procedures',
                'content' => '<h2>ODPP Password Policy</h2>
<p>All passwords must meet the following requirements:</p>
<ul>
<li>Minimum 8 characters</li>
<li>At least one uppercase letter</li>
<li>At least one lowercase letter</li>
<li>At least one number</li>
<li>At least one special character (!@#$%^&*)</li>
</ul>
<h3>Password Expiry</h3>
<p>Passwords expire every 90 days. You will receive email reminders before expiration.</p>
<h3>Resetting Your Password</h3>
<ol>
<li>Go to the login page</li>
<li>Click "Forgot Password"</li>
<li>Enter your email address</li>
<li>Check your email for reset instructions</li>
<li>Follow the link and create a new password</li>
</ol>
<h3>Locked Account</h3>
<p>If your account is locked after multiple failed attempts, contact ICT to unlock it.</p>',
                'category' => 'account',
                'author_id' => $admin->id,
                'views' => 178,
                'is_published' => true,
            ],
            [
                'title' => 'VPN Setup for Remote Work',
                'content' => '<h2>Setting Up Remote Access VPN</h2>
<p>To work from home, you need to connect to the office VPN.</p>
<h3>Installation</h3>
<ol>
<li>Download the VPN client from the ICT portal</li>
<li>Install the software with administrator rights</li>
<li>Restart your computer after installation</li>
</ol>
<h3>Connecting</h3>
<ol>
<li>Open the VPN client</li>
<li>Enter the server address: <strong>vpn.odpp.go.ke</strong></li>
<li>Use your network credentials to login</li>
<li>Click Connect</li>
</ol>
<h3>Troubleshooting</h3>
<ul>
<li>Ensure your internet connection is stable</li>
<li>Try disconnecting other devices from your network</li>
<li>If connection drops frequently, contact ICT support</li>
</ul>',
                'category' => 'network',
                'author_id' => $ictOfficer->id,
                'views' => 245,
                'is_published' => true,
            ],
            [
                'title' => 'Installing Software on Office Computers',
                'content' => '<h2>Software Installation Policy</h2>
<p>Due to licensing and security requirements, only ICT staff can install software on office computers.</p>
<h3>How to Request Software</h3>
<ol>
<li>Submit a support ticket through the portal</li>
<li>Select category "Software" and describe the software you need</li>
<li>Provide business justification for the software</li>
<li>ICT will review and install if approved</li>
</ol>
<h3>Approved Software List</h3>
<ul>
<li>Microsoft Office Suite (Word, Excel, PowerPoint, Outlook)</li>
<li>Adobe Acrobat Reader</li>
<li>Google Chrome / Mozilla Firefox</li>
<li>Zoom / Microsoft Teams</li>
<li>7-Zip (file compression)</li>
<li> VLC Media Player</li>
</ul>
<h3>Prohibited Software</h3>
<p>Games, torrents, and unauthorized remote access tools are strictly prohibited.</p>',
                'category' => 'software',
                'author_id' => $admin->id,
                'views' => 134,
                'is_published' => true,
            ],
            [
                'title' => 'Hardware Maintenance Best Practices',
                'content' => '<h2>Keeping Your Computer Running Smoothly</h2>
<p>Regular maintenance can prevent many common hardware issues.</p>
<h3>Daily Tips</h3>
<ul>
<li>Shutdown your computer properly at the end of each day</li>
<li>Keep liquids away from your keyboard</li>
<li>Don\'t eat near your computer</li>
</ul>
<h3>Weekly Maintenance</h3>
<ul>
<li>Restart your computer once a week</li>
<li>Delete unnecessary files from your desktop</li>
<li>Empty your Recycle Bin</li>
</ul>
<h3>Monthly Tasks</h3>
<ul>
<li>Run Windows Update</li>
<li>Scan for malware</li>
<li>Check for dust buildup around vents</li>
</ul>
<h3>Warning Signs</h3>
<p>If you notice any of these signs, contact ICT immediately:</p>
<ul>
<li>Unusual noises from your computer</li>
<li>Computer overheating</li>
<li>Frequent crashes or blue screens</li>
<li>Strange smells</li>
</ul>',
                'category' => 'hardware',
                'author_id' => $ictOfficer->id,
                'views' => 67,
                'is_published' => true,
            ],
        ];

        foreach ($articles as $articleData) {
            KnowledgeBaseArticle::create($articleData);
        }
    }
}
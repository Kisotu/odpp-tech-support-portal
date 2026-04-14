<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketComment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        if (Ticket::count() > 0) {
            return;
        }

        $admin = User::where('role', 'admin')->first();
        $ictOfficers = User::where('role', 'ict_officer')->get();
        $staff = User::where('role', 'staff')->get();

        $tickets = [
            [
                'title' => 'Computer not starting after power outage',
                'description' => 'The desktop computer in Room 102 is not turning on after yesterday\'s power outage. The indicator light is off and there is no sound from the fan. I tried plugging into a different socket but it still does not work.',
                'category' => 'hardware',
                'priority' => 'high',
                'status' => 'in_progress',
                'location' => 'Room 102, Ground Floor',
                'contact_phone' => '+254722000004',
                'user_id' => $staff[0]->id,
                'assigned_to' => $ictOfficers[0]->id,
                'created_at' => now()->subDays(3),
                'resolved_at' => null,
            ],
            [
                'title' => 'Outlook not receiving emails from external senders',
                'description' => 'I have been unable to receive emails from external email addresses since Monday. Internal emails within the organization work fine. I have tried restarting Outlook and my computer but the issue persists. This is urgent as I need to receive documents from the court.',
                'category' => 'email',
                'priority' => 'critical',
                'status' => 'new',
                'location' => 'Room 205, First Floor',
                'contact_phone' => '+254722000006',
                'user_id' => $staff[2]->id,
                'assigned_to' => null,
                'created_at' => now()->subHours(6),
                'resolved_at' => null,
            ],
            [
                'title' => 'Printer jam on HP LaserJet P4015dn',
                'description' => 'There is a persistent paper jam in the printer located in the print room. I have tried removing the stuck paper but it keeps jamming at the same spot. The error message on the printer display says "Fuser Error".',
                'category' => 'printer',
                'priority' => 'medium',
                'status' => 'resolved',
                'location' => 'Print Room, Ground Floor',
                'contact_phone' => '+254722000005',
                'user_id' => $staff[1]->id,
                'assigned_to' => $ictOfficers[1]->id,
                'created_at' => now()->subDays(5),
                'resolved_at' => now()->subDays(2),
            ],
            [
                'title' => 'VPN connection drops frequently',
                'description' => 'My VPN connection to the remote server keeps dropping every 10-15 minutes. This is making it difficult to access case files from home. I am using the standard VPN client provided by ICT. My internet connection at home is stable.',
                'category' => 'network',
                'priority' => 'high',
                'status' => 'in_progress',
                'location' => 'Home Office',
                'contact_phone' => '+254722000004',
                'user_id' => $staff[0]->id,
                'assigned_to' => $ictOfficers[0]->id,
                'created_at' => now()->subDays(2),
                'resolved_at' => null,
            ],
            [
                'title' => 'Cannot login to case management system',
                'description' => 'I am getting an "Invalid credentials" error when trying to login to the case management system. I am using the same credentials I have always used. I cleared my browser cache and tried different browsers but nothing works.',
                'category' => 'account',
                'priority' => 'high',
                'status' => 'resolved',
                'location' => 'Room 301, Second Floor',
                'contact_phone' => '+254722000006',
                'user_id' => $staff[2]->id,
                'assigned_to' => $admin->id,
                'created_at' => now()->subDays(4),
                'resolved_at' => now()->subDays(3),
            ],
            [
                'title' => 'New software installation request - Adobe Acrobat Pro',
                'description' => 'I need Adobe Acrobat Pro installed on my computer for reviewing and annotating PDF documents received from the DPP\'s office. This is required for my daily work on case file reviews.',
                'category' => 'software',
                'priority' => 'medium',
                'status' => 'new',
                'location' => 'Room 410, Third Floor',
                'contact_phone' => '+254722000005',
                'user_id' => $staff[1]->id,
                'assigned_to' => null,
                'created_at' => now()->subDays(1),
                'resolved_at' => null,
            ],
            [
                'title' => 'Network printer not discovered on new computer',
                'description' => 'I got a new laptop and I cannot find the network printers in the office. The IT team set up the laptop but the printers are not showing up in the printer list. I need to print case documents for the meeting tomorrow.',
                'category' => 'printer',
                'priority' => 'medium',
                'status' => 'in_progress',
                'location' => 'Room 315, Second Floor',
                'contact_phone' => '+254722000004',
                'user_id' => $staff[0]->id,
                'assigned_to' => $ictOfficers[0]->id,
                'created_at' => now()->subHours(12),
                'resolved_at' => null,
            ],
            [
                'title' => 'Email inbox full - cannot send or receive',
                'description' => 'My email inbox has reached the storage limit and I cannot send or receive new emails. I have tried deleting some old emails but the issue persists. This is blocking my communication with the prosecution team.',
                'category' => 'email',
                'priority' => 'high',
                'status' => 'resolved',
                'location' => 'Room 208, First Floor',
                'contact_phone' => '+254722000006',
                'user_id' => $staff[2]->id,
                'assigned_to' => $admin->id,
                'created_at' => now()->subDays(6),
                'resolved_at' => now()->subDays(5),
            ],
            [
                'title' => 'Slow internet connection in the morning',
                'description' => 'The internet connection is very slow every morning between 8-10 AM. This makes it difficult to access cloud-based case management tools and send large email attachments. The connection improves after 10 AM.',
                'category' => 'network',
                'priority' => 'low',
                'status' => 'closed',
                'location' => 'General Office',
                'contact_phone' => null,
                'user_id' => $staff[1]->id,
                'assigned_to' => $admin->id,
                'created_at' => now()->subDays(10),
                'resolved_at' => now()->subDays(8),
                'closed_at' => now()->subDays(7),
            ],
            [
                'title' => 'Monitor display flickering intermittently',
                'description' => 'The external monitor connected to my desktop computer flickers intermittently throughout the day. The issue started about a week ago and is getting worse. I tried using a different monitor cable but the problem persists.',
                'category' => 'hardware',
                'priority' => 'low',
                'status' => 'new',
                'location' => 'Room 105, Ground Floor',
                'contact_phone' => '+254722000005',
                'user_id' => $staff[1]->id,
                'assigned_to' => null,
                'created_at' => now()->subHours(48),
                'resolved_at' => null,
            ],
            [
                'title' => 'Password reset - locked out of system',
                'description' => 'I have been locked out of my computer account after forgetting my password. I need urgent access as I have a court hearing tomorrow and need to prepare documents. My employee ID is EMP/2019/0456.',
                'category' => 'account',
                'priority' => 'critical',
                'status' => 'resolved',
                'location' => 'Room 202, First Floor',
                'contact_phone' => '+254722000004',
                'user_id' => $staff[0]->id,
                'assigned_to' => $admin->id,
                'created_at' => now()->subDays(2),
                'resolved_at' => now()->subDays(2),
            ],
            [
                'title' => 'Scanner not working - ADF paper feed issue',
                'description' => 'The document scanner in the records room is not feeding papers automatically. When I place documents in the ADF tray, it makes a grinding noise but does not pull the paper through. I have to scan one page at a time manually.',
                'category' => 'hardware',
                'priority' => 'medium',
                'status' => 'in_progress',
                'location' => 'Records Room, Ground Floor',
                'contact_phone' => '+254722000006',
                'user_id' => $staff[2]->id,
                'assigned_to' => $ictOfficers[1]->id,
                'created_at' => now()->subDays(1),
                'resolved_at' => null,
            ],
        ];

        foreach ($tickets as $ticketData) {
            $ticket = Ticket::create([
                'ticket_number' => 'TKT-' . date('Ymd') . '-' . Str::upper(Str::random(6)),
                'title' => $ticketData['title'],
                'description' => $ticketData['description'],
                'category' => $ticketData['category'],
                'priority' => $ticketData['priority'],
                'status' => $ticketData['status'],
                'location' => $ticketData['location'],
                'contact_phone' => $ticketData['contact_phone'],
                'user_id' => $ticketData['user_id'],
                'assigned_to' => $ticketData['assigned_to'],
                'created_at' => $ticketData['created_at'],
                'updated_at' => $ticketData['created_at'],
                'resolved_at' => $ticketData['resolved_at'],
                'closed_at' => $ticketData['closed_at'] ?? null,
            ]);

            if ($ticket->status !== 'new' && $ticket->assigned_to) {
                TicketComment::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $ticket->assigned_to,
                    'comment' => 'Ticket received and being worked on.',
                    'is_internal' => false,
                    'created_at' => $ticket->created_at->addHours(1),
                ]);
            }

            if ($ticket->status === 'resolved' || $ticket->status === 'closed') {
                TicketComment::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $ticket->assigned_to,
                    'comment' => 'Issue has been resolved. Please confirm if your problem is solved.',
                    'is_internal' => false,
                    'created_at' => $ticket->resolved_at,
                ]);
            }
        }
    }
}
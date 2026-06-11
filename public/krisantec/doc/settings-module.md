# Settings Module Documentation

## Overview

The Settings module was rebuilt into a CRM administration console inspired by mature CRM products such as Salesforce Setup and Zoho CRM Setup. The goal is to move away from personal/demo settings and provide a production-style admin area for configuring the company workspace, users, permissions, CRM modules, automation, integrations, data controls, and notification rules.

Route:

```txt
/settings
```

Primary file:

```txt
src/CRM/Pages/SettingsPage.tsx
```

## Admin Console Structure

The Settings module now uses a grouped setup navigation with search.

Implemented navigation groups:

| Group | Section | Purpose |
| --- | --- | --- |
| Setup | Setup Home | Admin overview and setup health summary |
| Company | Company Settings | Workspace identity, company details, branches, departments, teams |
| Company | Staff & Users | Real staff directory, invitations, user status, role assignment |
| Security | Roles & Permissions | Role-based CRM access controls |
| Security | Security Center | Login policy, MFA, sessions, IP policy, audit posture |
| Customization | Modules & Fields | CRM object/module customization, fields, layouts, pipeline stages |
| Automation | Workflow Rules | Lead routing, reminders, approvals, support escalations |
| Automation | Integrations | Connected systems such as Google Workspace, Stripe, Slack, Zendesk |
| Data | Data Administration | Import, export, deduplication, backups, retention policy |
| Channels | Notifications | Workspace-level notification delivery rules |

The sidebar includes:

- Setup search.
- Grouped navigation labels.
- Active section state.
- Improved dark-sidebar contrast for readable text.
- Empty state when no setup result matches the search.

## Implemented Components

### SettingsPage

File:

```txt
src/CRM/Pages/SettingsPage.tsx
```

Responsibilities:

- Owns active Settings tab state.
- Renders setup sidebar and search.
- Groups admin sections into Setup, Company, Security, Customization, Automation, Data, and Channels.
- Routes each selected section to the correct component.

Key implementation detail:

```ts
export type SettingsTabId =
  | 'home'
  | 'organization'
  | 'team'
  | 'roles'
  | 'security'
  | 'data-model'
  | 'automation'
  | 'integrations'
  | 'data-admin'
  | 'notifications'
```

### Setup Home

File:

```txt
src/CRM/Components/AdminSetupHome.tsx
```

Purpose:

- Provides a CRM admin landing page.
- Shows setup health, company name, active staff, enabled modules, and security posture.
- Gives shortcut cards into the major admin sections.

This behaves like the first page an admin sees in Salesforce/Zoho-style setup areas.

### Company Settings

File:

```txt
src/CRM/Components/OrganizationSettings.tsx
```

Purpose:

- Manages company workspace profile.
- Uses real organization state from the shared platform store.
- Allows editing company name, industry, website, tax ID, GST number, address, timezone, departments, teams, and branches.
- Shows enabled modules.
- Includes company logo upload UI feedback.

Store used:

```txt
src/platform/store/usePlatformStore.ts
```

Important state:

```ts
organization.companyName
organization.industry
organization.website
organization.taxId
organization.gstNumber
organization.address
organization.timezone
organization.departments
organization.teams
organization.branches
organization.selectedModules
```

### Staff & Users

File:

```txt
src/CRM/Components/TeamSettings.tsx
```

Purpose:

- Uses real employee data from the platform store.
- Shows staff counts:
  - Total staff
  - Active members
  - Pending invites
  - Admins and managers
- Allows adding staff.
- Allows changing role, department, and status.
- Allows removing staff.

Store actions used:

```ts
addEmployee()
updateEmployee()
removeEmployee()
```

Employee source:

```ts
organization.invitedEmployees
```

### Roles & Permissions

File:

```txt
src/CRM/Components/RolesPermissionsSettings.tsx
```

Purpose:

- Defines CRM role profiles.
- Shows how many users belong to each role.
- Allows toggling permission items per role.

Current roles:

- Admin
- Sales Manager
- Sales Executive
- Support Agent
- Finance Manager

Permission examples:

- Workspace configuration
- Staff management
- Roles and permissions
- Lead assignment
- Pipeline editing
- Customer records
- Support tickets
- Invoices
- Financial reporting

This follows the CRM pattern where roles/profiles control what users can access and what actions they can perform.

### Security Center

File:

```txt
src/CRM/Components/SecurityComplianceSettings.tsx
```

Purpose:

- Adds admin security controls.
- Shows enabled security policies.
- Provides toggles for:
  - Two-factor authentication
  - Session timeout
  - Trusted IP ranges
  - Admin change approvals
- Shows a recent audit trail table.

Audit events include:

- Permission changes
- Workflow changes
- Export activity
- Scheduled backup completion

### Modules & Fields

File:

```txt
src/CRM/Components/DataModelSettings.tsx
```

Purpose:

- Adds an Object Manager style setup area.
- Allows admins to view and customize CRM modules and fields.
- Supports adding fields to a module.
- Supports toggling field required/visible settings.
- Shows pipeline stages for the Sales Pipeline module.

Implemented modules:

- Leads
- Sales Pipeline
- Customers
- Support Tickets
- Finance Invoices

Field examples:

- Company
- Lead Source
- Assigned Staff
- Deal Amount
- Close Date
- Priority
- SLA Due
- Payment Status

Supported field types:

- Text
- Picklist
- User lookup
- Date
- Date time
- Currency
- Number
- Percent
- Lookup

### Workflow Rules

File:

```txt
src/CRM/Components/AutomationSettings.tsx
```

Purpose:

- Provides CRM workflow automation configuration.
- Shows enabled and paused automations.
- Allows creating automation rules with:
  - Rule name
  - Owner
  - Trigger
  - Action
- Allows enabling and pausing rules.

Current sample workflow rules:

- Lead assignment
- Invoice reminder
- SLA escalation

Trigger examples:

- New lead created
- Deal stage changed
- Invoice due in 3 days
- Ticket unresolved after 24 hours
- Customer marked at risk

Action examples:

- Assign to the on-duty sales rep
- Send finance reminder
- Escalate to support manager
- Create a follow-up task
- Notify the account owner in-app

### Integrations

File:

```txt
src/CRM/Components/IntegrationSettings.tsx
```

Purpose:

- Shows connected and available integrations.
- Adds richer CRM admin metadata:
  - Owner
  - Sync cadence
  - Last sync
  - Connection status
- Allows toggling connection state.

Current integrations:

- Google Workspace
- Slack
- Stripe
- Zoom
- Mailchimp
- Zendesk

### Data Administration

File:

```txt
src/CRM/Components/DataAdministrationSettings.tsx
```

Purpose:

- Adds data governance controls.
- Supports import/export/deduplication/backup action cards.
- Shows data job table.
- Provides retention policy selector.
- Allows marking duplicate-review jobs complete.

Current data jobs:

- Healthcare leads import
- Customer email match
- Finance invoice archive
- Daily workspace backup

### Notifications

File:

```txt
src/CRM/Components/NotificationSettings.tsx
```

Purpose:

- Converts notification settings into workspace-level delivery rules.
- Uses controlled checkbox state.
- Shows counts for email and in-app alerts.

Notification groups:

- Sales & pipeline
- Customer & support
- Team & organization

Channels:

- Email
- In-app

## Store Integration

Shared platform store:

```txt
src/platform/store/usePlatformStore.ts
```

The Settings module uses real persisted organization and employee data from this store.

Important types:

```ts
export type EmployeeRecord = {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Invited' | 'Inactive'
  department: string
  team: string
}

export type OrganizationProfile = {
  companyName: string
  industry: string
  website: string
  taxId: string
  gstNumber: string
  address: string
  timezone: string
  departments: string[]
  teams: string[]
  branches: string[]
  invitedEmployees: EmployeeRecord[]
  selectedModules: PlatformModule[]
}
```

Store actions used by Settings:

```ts
updateOrganization(patch)
addEmployee(employee)
updateEmployee(employeeId, patch)
removeEmployee(employeeId)
```

## UI Improvements

The Settings UI was updated to feel more like a real CRM admin console.

Implemented UI improvements:

- Removed personal/demo profile navigation from Settings.
- Added setup-style grouped navigation.
- Added search to the setup sidebar.
- Added dark admin sidebar with readable high-contrast text.
- Added card-based setup overview.
- Added realistic admin sections instead of placeholder "coming soon" items.
- Added metrics, statuses, and action controls for admin context.
- Added controlled forms/toggles where possible.

## Real CRM Patterns Considered

The implementation follows common concepts from mature CRMs:

- Setup home / admin landing page
- Setup search
- Users and staff management
- Roles, profiles, and permissions
- Security policy and audit trail
- Object manager / modules and fields
- Field visibility and required rules
- Workflow automation rules
- Integration management
- Import/export/deduplication/backups
- Workspace-level notifications

These concepts are inspired by CRM administration patterns used in tools like Salesforce Setup and Zoho CRM Setup, adapted to this app's current data model and frontend-only architecture.

## Validation

Build command run:

```txt
npm.cmd run build
```

Result:

```txt
Build passed.
```

Known remaining note:

```txt
Vite reports a bundle-size warning because the built JavaScript chunk is larger than 500 kB.
This is a warning only, not a compile failure.
```

## Current Limitations

The Settings module is still frontend-only.

Current limitations:

- No backend persistence beyond Zustand/localStorage.
- Roles and permissions UI does not yet enforce access globally across routes.
- Workflow rules are configurable in UI but do not yet execute against real lead/ticket/invoice events.
- Data import/export/backup actions are simulated with UI feedback.
- Integrations are simulated connection states, not real OAuth/API connections.
- Audit log entries are static sample events.

## Recommended Next Steps

Suggested next implementation work:

1. Connect Roles & Permissions to actual route/component access.
2. Build a real workflow automation engine.
3. Add automatic lead assignment using staff directory and workflow rules.
4. Show assigned staff directly in Lead Capture.
5. Persist module/field customization in the platform store.
6. Add real audit events when admins change users, roles, automation, or company settings.
7. Add import/export flows for CSV and spreadsheet data.
8. Replace simulated integrations with real provider configuration models.

## Files Changed or Added

Main page:

```txt
src/CRM/Pages/SettingsPage.tsx
```

Settings components:

```txt
src/CRM/Components/AdminSetupHome.tsx
src/CRM/Components/OrganizationSettings.tsx
src/CRM/Components/TeamSettings.tsx
src/CRM/Components/RolesPermissionsSettings.tsx
src/CRM/Components/SecurityComplianceSettings.tsx
src/CRM/Components/DataModelSettings.tsx
src/CRM/Components/AutomationSettings.tsx
src/CRM/Components/IntegrationSettings.tsx
src/CRM/Components/DataAdministrationSettings.tsx
src/CRM/Components/NotificationSettings.tsx
```

Shared state:

```txt
src/platform/store/usePlatformStore.ts
```

export const supportData = {
  metrics: {
    openTickets: '142',
    openDelta: '+12% this week',
    avgResolution: '4.2h',
    resolutionDelta: '-15m since yesterday',
    unassigned: '28',
    unassignedAction: 'Action required',
    escalated: '7',
    escalatedAction: 'High priority',
  },
  categories: [
    { name: 'Billing', value: 45, amount: '64', color: '#3b82f6' },
    { name: 'Technical', value: 30, amount: '42', color: '#10b981' },
    { name: 'Account', value: 15, amount: '22', color: '#8b5cf6' },
    { name: 'Other', value: 10, amount: '14', color: '#94a3b8' },
  ],
  ticketHealth: {
    critical: '12',
    high: '45',
    medium: '60',
    low: '25',
  },
  tickets: [
    {
      id: 'TCK-2041',
      subject: 'Cannot access dashboard',
      customer: 'Acme Corp',
      status: 'Open',
      priority: 'High',
      assignee: 'Sarah J.',
      initials: 'SJ',
      color: '#8b5cf6',
      lastUpdated: '10m ago'
    },
    {
      id: 'TCK-2042',
      subject: 'Billing inquiry',
      customer: 'Global Tech',
      status: 'Pending',
      priority: 'Medium',
      assignee: 'Mike T.',
      initials: 'MT',
      color: '#3b82f6',
      lastUpdated: '1h ago'
    },
    {
      id: 'TCK-2043',
      subject: 'API documentation missing',
      customer: 'DevSolutions',
      status: 'Resolved',
      priority: 'Low',
      assignee: 'Alex W.',
      initials: 'AW',
      color: '#10b981',
      lastUpdated: '2h ago'
    },
    {
      id: 'TCK-2044',
      subject: 'System performance degradation',
      customer: 'MegaCorp',
      status: 'Open',
      priority: 'Critical',
      assignee: 'Unassigned',
      initials: 'UN',
      color: '#94a3b8',
      lastUpdated: '5m ago'
    },
    {
      id: 'TCK-2045',
      subject: 'Feature request: Export to PDF',
      customer: 'DesignIt',
      status: 'In Progress',
      priority: 'Medium',
      assignee: 'Sarah J.',
      initials: 'SJ',
      color: '#8b5cf6',
      lastUpdated: '3h ago'
    },
    {
      id: 'TCK-2046',
      subject: 'Login failure on mobile',
      customer: 'MobileFirst',
      status: 'Open',
      priority: 'High',
      assignee: 'Mike T.',
      initials: 'MT',
      color: '#3b82f6',
      lastUpdated: '30m ago'
    },
    {
      id: 'TCK-2047',
      subject: 'Integration with Slack',
      customer: 'ChatterBox',
      status: 'Resolved',
      priority: 'Medium',
      assignee: 'Alex W.',
      initials: 'AW',
      color: '#10b981',
      lastUpdated: '1d ago'
    },
    {
      id: 'TCK-2048',
      subject: 'Data sync issue',
      customer: 'SyncMaster',
      status: 'Pending',
      priority: 'High',
      assignee: 'Unassigned',
      initials: 'UN',
      color: '#94a3b8',
      lastUpdated: '45m ago'
    }
  ],
  recentActivity: [
    {
      id: 1,
      action: 'Sarah J. replied to TCK-2041',
      time: '10 mins ago',
      type: 'reply',
      isPositive: true,
      initials: 'SJ',
      color: '#8b5cf6'
    },
    {
      id: 2,
      action: 'TCK-2044 created by MegaCorp',
      time: '15 mins ago',
      type: 'new',
      isPositive: false,
      initials: 'MC',
      color: '#f43f5e'
    },
    {
      id: 3,
      action: 'Alex W. resolved TCK-2043',
      time: '2 hours ago',
      type: 'resolve',
      isPositive: true,
      initials: 'AW',
      color: '#10b981'
    },
    {
      id: 4,
      action: 'Mike T. claimed TCK-2046',
      time: '30 mins ago',
      type: 'claim',
      isPositive: true,
      initials: 'MT',
      color: '#3b82f6'
    }
  ]
}

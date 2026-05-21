import type { IndustryKey } from './industries'

export type LeadColumnType = 'text' | 'email' | 'phone' | 'select' | 'number' | 'currency' | 'date'

export interface LeadColumn {
  key: string
  label: string
  type: LeadColumnType
  options?: string[]
  width?: number
}

export interface LeadSchema {
  columns: LeadColumn[]
  sources: string[]
  statuses: string[]
}

export type LeadRow = Record<string, string | number>

export interface LeadsConfig {
  schema: LeadSchema
  rows: LeadRow[]
}

export const leadsByIndustry: Record<IndustryKey, LeadsConfig> = {
  healthcare: {
    schema: {
      columns: [
        { key: 'name', label: 'Patient Name', type: 'text', width: 180 },
        { key: 'phone', label: 'Phone', type: 'phone', width: 140 },
        { key: 'email', label: 'Email', type: 'email', width: 220 },
        { key: 'condition', label: 'Concern', type: 'select', width: 160, options: ['General Checkup', 'Diabetes', 'Cardiology', 'Dental', 'Orthopedic', 'Dermatology', 'Pediatric'] },
        { key: 'doctor', label: 'Preferred Doctor', type: 'select', width: 180, options: ['Dr. Mehta', 'Dr. Sharma', 'Dr. Iyer', 'Dr. Khan', 'Any Available'] },
        { key: 'source', label: 'Source', type: 'select', width: 140, options: ['WhatsApp', 'Google Ads', 'Meta Ads', 'JustDial', 'Referral', 'Walk-in'] },
        { key: 'appointment', label: 'Appointment', type: 'date', width: 140 },
        { key: 'status', label: 'Status', type: 'select', width: 130, options: ['New', 'Contacted', 'Booked', 'Visited', 'Follow-up', 'Closed'] },
        { key: 'value', label: 'Est. Value', type: 'currency', width: 120 },
      ],
      sources: ['WhatsApp', 'Google Ads', 'Meta Ads', 'JustDial', 'Referral', 'Walk-in'],
      statuses: ['New', 'Contacted', 'Booked', 'Visited', 'Follow-up', 'Closed'],
    },
    rows: [
      { name: 'Aarav Sharma', phone: '+91 98201 12345', email: 'aarav.s@gmail.com', condition: 'General Checkup', doctor: 'Dr. Mehta', source: 'WhatsApp', appointment: '2026-05-12', status: 'Booked', value: 2500 },
      { name: 'Priya Iyer', phone: '+91 98765 43210', email: 'priya.iyer@yahoo.com', condition: 'Diabetes', doctor: 'Dr. Sharma', source: 'Google Ads', appointment: '2026-05-14', status: 'Contacted', value: 4800 },
      { name: 'Rohit Verma', phone: '+91 99876 11223', email: 'rohit.v@hotmail.com', condition: 'Cardiology', doctor: 'Dr. Iyer', source: 'Meta Ads', appointment: '2026-05-18', status: 'New', value: 8200 },
      { name: 'Meera Nair', phone: '+91 90120 88888', email: 'meera.nair@gmail.com', condition: 'Dental', doctor: 'Dr. Khan', source: 'JustDial', appointment: '2026-05-10', status: 'Visited', value: 3200 },
      { name: 'Sanjay Desai', phone: '+91 88990 12321', email: 'sanjay.d@gmail.com', condition: 'Orthopedic', doctor: 'Dr. Iyer', source: 'Referral', appointment: '2026-05-20', status: 'Booked', value: 6400 },
      { name: 'Anita Bose', phone: '+91 91111 22333', email: 'anita.bose@gmail.com', condition: 'Dermatology', doctor: 'Dr. Mehta', source: 'WhatsApp', appointment: '2026-05-16', status: 'Follow-up', value: 1800 },
      { name: 'Karan Singh', phone: '+91 92345 67890', email: 'karan.s@gmail.com', condition: 'Pediatric', doctor: 'Dr. Khan', source: 'Meta Ads', appointment: '2026-05-13', status: 'New', value: 1500 },
      { name: 'Divya Rao', phone: '+91 99001 23456', email: 'divya.rao@gmail.com', condition: 'General Checkup', doctor: 'Any Available', source: 'Walk-in', appointment: '2026-05-09', status: 'Visited', value: 2100 },
      { name: 'Vikram Patel', phone: '+91 97000 11111', email: 'vikram.p@gmail.com', condition: 'Diabetes', doctor: 'Dr. Sharma', source: 'Google Ads', appointment: '2026-05-22', status: 'Booked', value: 5200 },
      { name: 'Neha Kapoor', phone: '+91 88001 22322', email: 'neha.k@gmail.com', condition: 'Cardiology', doctor: 'Dr. Iyer', source: 'WhatsApp', appointment: '2026-05-17', status: 'Contacted', value: 7400 },
      { name: 'Ramesh Gupta', phone: '+91 90909 80808', email: 'ramesh.g@gmail.com', condition: 'Orthopedic', doctor: 'Dr. Iyer', source: 'JustDial', appointment: '2026-05-19', status: 'New', value: 4200 },
      { name: 'Sunita Joshi', phone: '+91 91234 56789', email: 'sunita.j@gmail.com', condition: 'Dental', doctor: 'Dr. Khan', source: 'Referral', appointment: '2026-05-11', status: 'Closed', value: 2800 },
    ],
  },

  realestate: {
    schema: {
      columns: [
        { key: 'name', label: 'Buyer Name', type: 'text', width: 180 },
        { key: 'phone', label: 'Phone', type: 'phone', width: 140 },
        { key: 'email', label: 'Email', type: 'email', width: 220 },
        { key: 'project', label: 'Project Interest', type: 'select', width: 200, options: ['Skyline Towers', 'Lake View Villas', 'Greenfield Plots', 'Urban Heights', 'Coastal Residency'] },
        { key: 'config', label: 'Configuration', type: 'select', width: 130, options: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Plot', 'Villa'] },
        { key: 'budget', label: 'Budget', type: 'currency', width: 140 },
        { key: 'location', label: 'Location', type: 'select', width: 140, options: ['Mumbai', 'Pune', 'Bengaluru', 'Hyderabad', 'NCR', 'Chennai'] },
        { key: 'source', label: 'Source', type: 'select', width: 140, options: ['99acres', 'MagicBricks', 'Meta Ads', 'Google Ads', 'Walk-in', 'Channel Partner'] },
        { key: 'visit', label: 'Site Visit', type: 'date', width: 140 },
        { key: 'status', label: 'Stage', type: 'select', width: 140, options: ['New', 'Contacted', 'Site Visit', 'Negotiation', 'Token Paid', 'Booked', 'Lost'] },
      ],
      sources: ['99acres', 'MagicBricks', 'Meta Ads', 'Google Ads', 'Walk-in', 'Channel Partner'],
      statuses: ['New', 'Contacted', 'Site Visit', 'Negotiation', 'Token Paid', 'Booked', 'Lost'],
    },
    rows: [
      { name: 'Amit Khanna', phone: '+91 98201 12000', email: 'amit.k@gmail.com', project: 'Skyline Towers', config: '3 BHK', budget: 12500000, location: 'Mumbai', source: '99acres', visit: '2026-05-12', status: 'Site Visit' },
      { name: 'Pooja Reddy', phone: '+91 98712 33445', email: 'pooja.r@gmail.com', project: 'Lake View Villas', config: 'Villa', budget: 28000000, location: 'Hyderabad', source: 'Meta Ads', visit: '2026-05-15', status: 'Negotiation' },
      { name: 'Nikhil Mehta', phone: '+91 99001 88990', email: 'nikhil.m@gmail.com', project: 'Greenfield Plots', config: 'Plot', budget: 4800000, location: 'Pune', source: 'MagicBricks', visit: '2026-05-10', status: 'Token Paid' },
      { name: 'Sara Khan', phone: '+91 88990 12121', email: 'sara.k@gmail.com', project: 'Urban Heights', config: '2 BHK', budget: 8500000, location: 'Bengaluru', source: 'Google Ads', visit: '2026-05-18', status: 'New' },
      { name: 'Rajeev Pillai', phone: '+91 91234 12121', email: 'rajeev.p@gmail.com', project: 'Coastal Residency', config: '3 BHK', budget: 18500000, location: 'Chennai', source: '99acres', visit: '2026-05-14', status: 'Contacted' },
      { name: 'Shalini Mishra', phone: '+91 90000 22112', email: 'shalini.m@gmail.com', project: 'Skyline Towers', config: '4 BHK', budget: 24000000, location: 'Mumbai', source: 'Channel Partner', visit: '2026-05-20', status: 'Site Visit' },
      { name: 'Anil Aggarwal', phone: '+91 99988 12345', email: 'anil.a@gmail.com', project: 'Lake View Villas', config: 'Villa', budget: 32000000, location: 'NCR', source: 'Meta Ads', visit: '2026-05-22', status: 'Negotiation' },
      { name: 'Kritika Sen', phone: '+91 92002 11122', email: 'kritika.s@gmail.com', project: 'Greenfield Plots', config: 'Plot', budget: 6200000, location: 'Pune', source: 'Walk-in', visit: '2026-05-09', status: 'Booked' },
      { name: 'Vivek Tripathi', phone: '+91 88112 99001', email: 'vivek.t@gmail.com', project: 'Urban Heights', config: '1 BHK', budget: 5800000, location: 'Bengaluru', source: 'MagicBricks', visit: '2026-05-13', status: 'Lost' },
      { name: 'Aishwarya Pillai', phone: '+91 91212 88990', email: 'aishwarya.p@gmail.com', project: 'Coastal Residency', config: '4 BHK', budget: 36000000, location: 'Chennai', source: 'Google Ads', visit: '2026-05-21', status: 'Contacted' },
      { name: 'Sandeep Yadav', phone: '+91 90909 70707', email: 'sandeep.y@gmail.com', project: 'Skyline Towers', config: '2 BHK', budget: 9800000, location: 'Mumbai', source: 'Meta Ads', visit: '2026-05-16', status: 'Site Visit' },
      { name: 'Lakshmi Iyer', phone: '+91 99876 11212', email: 'lakshmi.i@gmail.com', project: 'Lake View Villas', config: 'Villa', budget: 26000000, location: 'Hyderabad', source: '99acres', visit: '2026-05-19', status: 'Negotiation' },
    ],
  },

  ecommerce: {
    schema: {
      columns: [
        { key: 'name', label: 'Customer Name', type: 'text', width: 180 },
        { key: 'email', label: 'Email', type: 'email', width: 220 },
        { key: 'phone', label: 'Phone', type: 'phone', width: 140 },
        { key: 'product', label: 'Product Interest', type: 'select', width: 180, options: ['Apparel', 'Footwear', 'Beauty', 'Electronics', 'Home Decor', 'Wellness'] },
        { key: 'cart', label: 'Cart Value', type: 'currency', width: 130 },
        { key: 'channel', label: 'Channel', type: 'select', width: 140, options: ['Meta Ads', 'Google Shopping', 'Email', 'Influencer', 'Organic', 'WhatsApp'] },
        { key: 'segment', label: 'Segment', type: 'select', width: 130, options: ['New', 'Repeat', 'VIP', 'Lapsed', 'Cart Abandoner'] },
        { key: 'lastVisit', label: 'Last Visit', type: 'date', width: 130 },
        { key: 'status', label: 'Status', type: 'select', width: 140, options: ['New', 'Engaged', 'Cart Abandoned', 'Recovered', 'Ordered', 'Returned'] },
      ],
      sources: ['Meta Ads', 'Google Shopping', 'Email', 'Influencer', 'Organic', 'WhatsApp'],
      statuses: ['New', 'Engaged', 'Cart Abandoned', 'Recovered', 'Ordered', 'Returned'],
    },
    rows: [
      { name: 'Tanya Bhatia', email: 'tanya.b@gmail.com', phone: '+91 98765 11000', product: 'Apparel', cart: 4200, channel: 'Meta Ads', segment: 'Cart Abandoner', lastVisit: '2026-05-07', status: 'Cart Abandoned' },
      { name: 'Aryan Malhotra', email: 'aryan.m@gmail.com', phone: '+91 99001 22112', product: 'Footwear', cart: 6800, channel: 'Google Shopping', segment: 'Repeat', lastVisit: '2026-05-08', status: 'Ordered' },
      { name: 'Riya Kapoor', email: 'riya.k@gmail.com', phone: '+91 88990 33445', product: 'Beauty', cart: 1850, channel: 'Influencer', segment: 'New', lastVisit: '2026-05-08', status: 'Engaged' },
      { name: 'Mohit Saxena', email: 'mohit.s@gmail.com', phone: '+91 91234 90909', product: 'Electronics', cart: 28400, channel: 'Google Shopping', segment: 'VIP', lastVisit: '2026-05-06', status: 'Ordered' },
      { name: 'Ishita Roy', email: 'ishita.r@gmail.com', phone: '+91 90000 12345', product: 'Home Decor', cart: 3600, channel: 'Meta Ads', segment: 'New', lastVisit: '2026-05-05', status: 'Cart Abandoned' },
      { name: 'Dev Mishra', email: 'dev.m@gmail.com', phone: '+91 99988 11122', product: 'Wellness', cart: 1200, channel: 'Email', segment: 'Lapsed', lastVisit: '2026-04-28', status: 'Engaged' },
      { name: 'Khushi Jain', email: 'khushi.j@gmail.com', phone: '+91 98201 88776', product: 'Apparel', cart: 5400, channel: 'WhatsApp', segment: 'VIP', lastVisit: '2026-05-08', status: 'Recovered' },
      { name: 'Yash Pandey', email: 'yash.p@gmail.com', phone: '+91 91212 33445', product: 'Footwear', cart: 4400, channel: 'Meta Ads', segment: 'Repeat', lastVisit: '2026-05-07', status: 'Ordered' },
      { name: 'Saanvi Reddy', email: 'saanvi.r@gmail.com', phone: '+91 92001 22112', product: 'Beauty', cart: 2200, channel: 'Influencer', segment: 'New', lastVisit: '2026-05-08', status: 'Engaged' },
      { name: 'Arjun Khanna', email: 'arjun.k@gmail.com', phone: '+91 88001 99988', product: 'Electronics', cart: 18900, channel: 'Google Shopping', segment: 'Repeat', lastVisit: '2026-05-04', status: 'Returned' },
      { name: 'Naina Singh', email: 'naina.s@gmail.com', phone: '+91 99001 90909', product: 'Home Decor', cart: 6200, channel: 'Organic', segment: 'New', lastVisit: '2026-05-06', status: 'Ordered' },
      { name: 'Veer Sharma', email: 'veer.s@gmail.com', phone: '+91 88990 22112', product: 'Wellness', cart: 980, channel: 'Email', segment: 'Cart Abandoner', lastVisit: '2026-05-08', status: 'Cart Abandoned' },
    ],
  },

  saas: {
    schema: {
      columns: [
        { key: 'company', label: 'Company', type: 'text', width: 180 },
        { key: 'name', label: 'Contact Name', type: 'text', width: 160 },
        { key: 'email', label: 'Work Email', type: 'email', width: 220 },
        { key: 'role', label: 'Role', type: 'select', width: 150, options: ['Founder', 'CTO', 'Head of Sales', 'Product Manager', 'Operations', 'Marketing'] },
        { key: 'teamSize', label: 'Team Size', type: 'select', width: 110, options: ['1-10', '11-50', '51-200', '201-500', '500+'] },
        { key: 'plan', label: 'Plan Interest', type: 'select', width: 130, options: ['Starter', 'Growth', 'Pro', 'Enterprise'] },
        { key: 'mrr', label: 'Potential MRR', type: 'currency', width: 140 },
        { key: 'source', label: 'Source', type: 'select', width: 140, options: ['LinkedIn', 'Google Search', 'Product Hunt', 'G2', 'Email', 'Referral'] },
        { key: 'trialEnds', label: 'Trial Ends', type: 'date', width: 130 },
        { key: 'status', label: 'Pipeline', type: 'select', width: 140, options: ['New', 'Trial', 'Activated', 'Demo Done', 'Negotiation', 'Won', 'Lost'] },
      ],
      sources: ['LinkedIn', 'Google Search', 'Product Hunt', 'G2', 'Email', 'Referral'],
      statuses: ['New', 'Trial', 'Activated', 'Demo Done', 'Negotiation', 'Won', 'Lost'],
    },
    rows: [
      { company: 'Brightline Labs', name: 'Maya Chen', email: 'maya@brightline.io', role: 'Founder', teamSize: '11-50', plan: 'Growth', mrr: 1200, source: 'LinkedIn', trialEnds: '2026-05-15', status: 'Trial' },
      { company: 'NovaPay', name: 'Rahul Verma', email: 'rahul@novapay.com', role: 'CTO', teamSize: '51-200', plan: 'Pro', mrr: 4800, source: 'Google Search', trialEnds: '2026-05-12', status: 'Demo Done' },
      { company: 'StackForge', name: 'Anika Iyer', email: 'anika@stackforge.dev', role: 'Head of Sales', teamSize: '11-50', plan: 'Growth', mrr: 1800, source: 'Product Hunt', trialEnds: '2026-05-18', status: 'Activated' },
      { company: 'Polaris Health', name: 'David Kim', email: 'david@polarishealth.com', role: 'Operations', teamSize: '201-500', plan: 'Enterprise', mrr: 12000, source: 'G2', trialEnds: '2026-05-22', status: 'Negotiation' },
      { company: 'Loop Studios', name: 'Priya Shah', email: 'priya@loop.studio', role: 'Founder', teamSize: '1-10', plan: 'Starter', mrr: 480, source: 'Referral', trialEnds: '2026-05-10', status: 'Won' },
      { company: 'Quantum Reach', name: 'Marcus Lee', email: 'marcus@quantumreach.ai', role: 'Marketing', teamSize: '11-50', plan: 'Growth', mrr: 1400, source: 'LinkedIn', trialEnds: '2026-05-14', status: 'Trial' },
      { company: 'Helix Robotics', name: 'Sneha Pillai', email: 'sneha@helix.bot', role: 'Product Manager', teamSize: '51-200', plan: 'Pro', mrr: 3800, source: 'Email', trialEnds: '2026-05-20', status: 'Demo Done' },
      { company: 'Apex Realty', name: 'Owen Wright', email: 'owen@apexrealty.com', role: 'Head of Sales', teamSize: '201-500', plan: 'Enterprise', mrr: 9800, source: 'LinkedIn', trialEnds: '2026-05-16', status: 'Negotiation' },
      { company: 'Verdant Foods', name: 'Lina Park', email: 'lina@verdant.foods', role: 'Operations', teamSize: '11-50', plan: 'Growth', mrr: 1600, source: 'Google Search', trialEnds: '2026-05-11', status: 'Trial' },
      { company: 'Halcyon Travel', name: 'Vikas Bhatt', email: 'vikas@halcyon.travel', role: 'Founder', teamSize: '1-10', plan: 'Starter', mrr: 380, source: 'Product Hunt', trialEnds: '2026-05-09', status: 'Activated' },
      { company: 'Atlas Logistics', name: 'Divya Nair', email: 'divya@atlaslogistics.in', role: 'CTO', teamSize: '500+', plan: 'Enterprise', mrr: 18000, source: 'G2', trialEnds: '2026-05-25', status: 'Negotiation' },
      { company: 'Mosaic Edu', name: 'Faisal Khan', email: 'faisal@mosaic.edu', role: 'Marketing', teamSize: '11-50', plan: 'Pro', mrr: 2400, source: 'Referral', trialEnds: '2026-05-13', status: 'Demo Done' },
    ],
  },

  education: {
    schema: {
      columns: [
        { key: 'student', label: 'Student Name', type: 'text', width: 180 },
        { key: 'parent', label: 'Parent Name', type: 'text', width: 160 },
        { key: 'phone', label: 'Phone', type: 'phone', width: 140 },
        { key: 'email', label: 'Email', type: 'email', width: 220 },
        { key: 'course', label: 'Course / Class', type: 'select', width: 180, options: ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'JEE Crash', 'NEET Foundation', 'Coding Bootcamp', 'Spoken English'] },
        { key: 'mode', label: 'Mode', type: 'select', width: 110, options: ['Online', 'Offline', 'Hybrid'] },
        { key: 'city', label: 'City', type: 'text', width: 130 },
        { key: 'fee', label: 'Fee Quote', type: 'currency', width: 130 },
        { key: 'source', label: 'Source', type: 'select', width: 140, options: ['Meta Ads', 'Google Ads', 'YouTube', 'JustDial', 'School Tie-up', 'Referral'] },
        { key: 'counsel', label: 'Counselling', type: 'date', width: 140 },
        { key: 'status', label: 'Status', type: 'select', width: 140, options: ['Inquiry', 'Counselled', 'Test Done', 'Admission Offered', 'Admitted', 'Dropped'] },
      ],
      sources: ['Meta Ads', 'Google Ads', 'YouTube', 'JustDial', 'School Tie-up', 'Referral'],
      statuses: ['Inquiry', 'Counselled', 'Test Done', 'Admission Offered', 'Admitted', 'Dropped'],
    },
    rows: [
      { student: 'Arnav Kulkarni', parent: 'Rajesh Kulkarni', phone: '+91 98201 11221', email: 'rajesh.k@gmail.com', course: 'Class 11', mode: 'Hybrid', city: 'Pune', fee: 84000, source: 'Meta Ads', counsel: '2026-05-12', status: 'Counselled' },
      { student: 'Diya Sharma', parent: 'Anju Sharma', phone: '+91 99001 88776', email: 'anju.s@gmail.com', course: 'JEE Crash', mode: 'Online', city: 'Delhi', fee: 124000, source: 'YouTube', counsel: '2026-05-14', status: 'Test Done' },
      { student: 'Kabir Joshi', parent: 'Suresh Joshi', phone: '+91 88990 12121', email: 'suresh.j@gmail.com', course: 'NEET Foundation', mode: 'Offline', city: 'Mumbai', fee: 96000, source: 'Google Ads', counsel: '2026-05-15', status: 'Admission Offered' },
      { student: 'Mishti Roy', parent: 'Ananya Roy', phone: '+91 91234 22112', email: 'ananya.r@gmail.com', course: 'Class 12', mode: 'Hybrid', city: 'Kolkata', fee: 78000, source: 'School Tie-up', counsel: '2026-05-10', status: 'Admitted' },
      { student: 'Neil Pillai', parent: 'Suresh Pillai', phone: '+91 90000 33445', email: 'suresh.p@gmail.com', course: 'Coding Bootcamp', mode: 'Online', city: 'Bengaluru', fee: 48000, source: 'Meta Ads', counsel: '2026-05-13', status: 'Inquiry' },
      { student: 'Saanvi Mehra', parent: 'Vivek Mehra', phone: '+91 92002 88990', email: 'vivek.m@gmail.com', course: 'Class 10', mode: 'Offline', city: 'Mumbai', fee: 64000, source: 'JustDial', counsel: '2026-05-16', status: 'Counselled' },
      { student: 'Aarav Bose', parent: 'Sanchita Bose', phone: '+91 99988 11221', email: 'sanchita.b@gmail.com', course: 'Spoken English', mode: 'Online', city: 'Hyderabad', fee: 14000, source: 'Referral', counsel: '2026-05-09', status: 'Admitted' },
      { student: 'Anvi Kapoor', parent: 'Nitin Kapoor', phone: '+91 88001 22333', email: 'nitin.k@gmail.com', course: 'Class 9', mode: 'Hybrid', city: 'Pune', fee: 56000, source: 'Meta Ads', counsel: '2026-05-18', status: 'Inquiry' },
      { student: 'Ishaan Gupta', parent: 'Manoj Gupta', phone: '+91 91212 99001', email: 'manoj.g@gmail.com', course: 'JEE Crash', mode: 'Offline', city: 'Delhi', fee: 138000, source: 'YouTube', counsel: '2026-05-20', status: 'Test Done' },
      { student: 'Kiara Nair', parent: 'Sunita Nair', phone: '+91 90909 11221', email: 'sunita.n@gmail.com', course: 'NEET Foundation', mode: 'Online', city: 'Chennai', fee: 84000, source: 'Google Ads', counsel: '2026-05-22', status: 'Admission Offered' },
      { student: 'Veer Patel', parent: 'Kalpesh Patel', phone: '+91 99001 12333', email: 'kalpesh.p@gmail.com', course: 'Coding Bootcamp', mode: 'Hybrid', city: 'Ahmedabad', fee: 52000, source: 'Referral', counsel: '2026-05-11', status: 'Counselled' },
      { student: 'Riya Mathur', parent: 'Aarti Mathur', phone: '+91 88990 99876', email: 'aarti.m@gmail.com', course: 'Class 12', mode: 'Online', city: 'Jaipur', fee: 72000, source: 'School Tie-up', counsel: '2026-05-17', status: 'Admitted' },
    ],
  },

  manufacturing: {
    schema: {
      columns: [
        { key: 'company', label: 'Company', type: 'text', width: 200 },
        { key: 'contact', label: 'Contact Person', type: 'text', width: 160 },
        { key: 'phone', label: 'Phone', type: 'phone', width: 140 },
        { key: 'email', label: 'Email', type: 'email', width: 220 },
        { key: 'industry', label: 'Buyer Industry', type: 'select', width: 160, options: ['Auto', 'Pharma', 'FMCG', 'Construction', 'Textile', 'Electronics'] },
        { key: 'product', label: 'Product Inquiry', type: 'select', width: 180, options: ['Steel Sheets', 'PVC Pipes', 'Industrial Gears', 'Packaging', 'Custom Fabrication'] },
        { key: 'qty', label: 'Quantity (units)', type: 'number', width: 130 },
        { key: 'value', label: 'Order Value', type: 'currency', width: 140 },
        { key: 'location', label: 'Location', type: 'text', width: 130 },
        { key: 'source', label: 'Source', type: 'select', width: 140, options: ['IndiaMART', 'TradeIndia', 'LinkedIn', 'Google Ads', 'Trade Show', 'Email'] },
        { key: 'status', label: 'Stage', type: 'select', width: 140, options: ['Inquiry', 'Quoted', 'Negotiation', 'Sample Sent', 'PO Received', 'Shipped', 'Lost'] },
      ],
      sources: ['IndiaMART', 'TradeIndia', 'LinkedIn', 'Google Ads', 'Trade Show', 'Email'],
      statuses: ['Inquiry', 'Quoted', 'Negotiation', 'Sample Sent', 'PO Received', 'Shipped', 'Lost'],
    },
    rows: [
      { company: 'Tata Motors Vendors', contact: 'Suresh Iyer', phone: '+91 98201 11000', email: 'suresh@tatamv.com', industry: 'Auto', product: 'Industrial Gears', qty: 12000, value: 1840000, location: 'Pune', source: 'IndiaMART', status: 'Quoted' },
      { company: 'Cipla Packaging', contact: 'Anita Rao', phone: '+91 99001 33445', email: 'anita.r@ciplap.com', industry: 'Pharma', product: 'Packaging', qty: 84000, value: 2400000, location: 'Goa', source: 'TradeIndia', status: 'Negotiation' },
      { company: 'Britannia Procurement', contact: 'Vikram Bhatt', phone: '+91 88990 12333', email: 'vikram@britannia.com', industry: 'FMCG', product: 'Packaging', qty: 124000, value: 3200000, location: 'Bengaluru', source: 'LinkedIn', status: 'Sample Sent' },
      { company: 'L&T Construction', contact: 'Ramesh Kulkarni', phone: '+91 91234 22112', email: 'ramesh.k@lntcon.com', industry: 'Construction', product: 'Steel Sheets', qty: 4800, value: 5200000, location: 'Mumbai', source: 'Trade Show', status: 'PO Received' },
      { company: 'Reliance Polymers', contact: 'Pooja Mehta', phone: '+91 90000 11221', email: 'pooja.m@rpoly.com', industry: 'Construction', product: 'PVC Pipes', qty: 32000, value: 1240000, location: 'Surat', source: 'IndiaMART', status: 'Shipped' },
      { company: 'Maruti Suzuki Vendors', contact: 'Anil Kumar', phone: '+91 92002 88990', email: 'anil.k@msuzv.com', industry: 'Auto', product: 'Industrial Gears', qty: 18000, value: 2840000, location: 'Gurgaon', source: 'IndiaMART', status: 'Negotiation' },
      { company: 'Raymond Textiles', contact: 'Shalini Desai', phone: '+91 99988 22333', email: 'shalini.d@raymond.com', industry: 'Textile', product: 'Custom Fabrication', qty: 600, value: 980000, location: 'Mumbai', source: 'LinkedIn', status: 'Inquiry' },
      { company: 'Samsung India OEM', contact: 'Rohit Sen', phone: '+91 88001 33445', email: 'rohit.s@samsoem.com', industry: 'Electronics', product: 'Custom Fabrication', qty: 2400, value: 4200000, location: 'Noida', source: 'Email', status: 'Quoted' },
      { company: 'Asian Paints Procurement', contact: 'Nikhil Gupta', phone: '+91 91212 11221', email: 'nikhil.g@apaints.com', industry: 'FMCG', product: 'Packaging', qty: 96000, value: 1840000, location: 'Mumbai', source: 'TradeIndia', status: 'PO Received' },
      { company: 'Sun Pharma Suppliers', contact: 'Kavita Joshi', phone: '+91 90909 22112', email: 'kavita.j@sunps.com', industry: 'Pharma', product: 'Packaging', qty: 48000, value: 1480000, location: 'Vadodara', source: 'IndiaMART', status: 'Sample Sent' },
      { company: 'BHEL Procurement', contact: 'Sandeep Shukla', phone: '+91 99001 88990', email: 'sandeep.s@bhelp.com', industry: 'Construction', product: 'Steel Sheets', qty: 8400, value: 8200000, location: 'Bhopal', source: 'Trade Show', status: 'Negotiation' },
      { company: 'Bajaj Auto Vendors', contact: 'Manish Reddy', phone: '+91 88990 99876', email: 'manish.r@bajajav.com', industry: 'Auto', product: 'Industrial Gears', qty: 9600, value: 1640000, location: 'Pune', source: 'Google Ads', status: 'Lost' },
    ],
  },

  hospitality: {
    schema: {
      columns: [
        { key: 'guest', label: 'Guest Name', type: 'text', width: 180 },
        { key: 'phone', label: 'Phone', type: 'phone', width: 140 },
        { key: 'email', label: 'Email', type: 'email', width: 220 },
        { key: 'property', label: 'Property', type: 'select', width: 180, options: ['Lakeside Resort', 'City Boutique Hotel', 'Beach Villa', 'Mountain Retreat', 'Heritage Palace'] },
        { key: 'roomType', label: 'Room Type', type: 'select', width: 140, options: ['Deluxe', 'Premium', 'Suite', 'Villa', 'Family'] },
        { key: 'guests', label: 'Guests', type: 'number', width: 90 },
        { key: 'checkin', label: 'Check-in', type: 'date', width: 130 },
        { key: 'nights', label: 'Nights', type: 'number', width: 90 },
        { key: 'value', label: 'Booking Value', type: 'currency', width: 140 },
        { key: 'source', label: 'Source', type: 'select', width: 150, options: ['MakeMyTrip', 'Booking.com', 'Direct Website', 'WhatsApp', 'Meta Ads', 'TripAdvisor'] },
        { key: 'status', label: 'Status', type: 'select', width: 140, options: ['Inquiry', 'Quoted', 'Tentative', 'Confirmed', 'Checked-in', 'Cancelled'] },
      ],
      sources: ['MakeMyTrip', 'Booking.com', 'Direct Website', 'WhatsApp', 'Meta Ads', 'TripAdvisor'],
      statuses: ['Inquiry', 'Quoted', 'Tentative', 'Confirmed', 'Checked-in', 'Cancelled'],
    },
    rows: [
      { guest: 'Aditya Rao', phone: '+91 98201 22112', email: 'aditya.r@gmail.com', property: 'Lakeside Resort', roomType: 'Suite', guests: 2, checkin: '2026-05-15', nights: 3, value: 38400, source: 'MakeMyTrip', status: 'Confirmed' },
      { guest: 'Saumya Joshi', phone: '+91 99001 11221', email: 'saumya.j@gmail.com', property: 'Beach Villa', roomType: 'Villa', guests: 4, checkin: '2026-05-20', nights: 5, value: 124000, source: 'Booking.com', status: 'Confirmed' },
      { guest: 'Karan Bhatia', phone: '+91 88990 33445', email: 'karan.b@gmail.com', property: 'Mountain Retreat', roomType: 'Deluxe', guests: 2, checkin: '2026-05-12', nights: 2, value: 18800, source: 'Direct Website', status: 'Checked-in' },
      { guest: 'Pooja Iyer', phone: '+91 91234 90909', email: 'pooja.i@gmail.com', property: 'Heritage Palace', roomType: 'Premium', guests: 3, checkin: '2026-05-22', nights: 4, value: 86400, source: 'Meta Ads', status: 'Tentative' },
      { guest: 'Vivek Sharma', phone: '+91 90000 22112', email: 'vivek.s@gmail.com', property: 'City Boutique Hotel', roomType: 'Family', guests: 5, checkin: '2026-05-18', nights: 2, value: 24800, source: 'WhatsApp', status: 'Inquiry' },
      { guest: 'Ananya Pillai', phone: '+91 92002 11221', email: 'ananya.p@gmail.com', property: 'Lakeside Resort', roomType: 'Premium', guests: 2, checkin: '2026-05-25', nights: 3, value: 32400, source: 'TripAdvisor', status: 'Quoted' },
      { guest: 'Manish Kapoor', phone: '+91 99988 12333', email: 'manish.k@gmail.com', property: 'Beach Villa', roomType: 'Suite', guests: 2, checkin: '2026-05-30', nights: 4, value: 64800, source: 'Booking.com', status: 'Confirmed' },
      { guest: 'Nidhi Verma', phone: '+91 88001 11000', email: 'nidhi.v@gmail.com', property: 'Mountain Retreat', roomType: 'Family', guests: 6, checkin: '2026-05-28', nights: 3, value: 42600, source: 'MakeMyTrip', status: 'Tentative' },
      { guest: 'Rohan Desai', phone: '+91 91212 33445', email: 'rohan.d@gmail.com', property: 'Heritage Palace', roomType: 'Suite', guests: 2, checkin: '2026-06-02', nights: 2, value: 38400, source: 'Direct Website', status: 'Quoted' },
      { guest: 'Sneha Bose', phone: '+91 90909 88990', email: 'sneha.b@gmail.com', property: 'City Boutique Hotel', roomType: 'Deluxe', guests: 1, checkin: '2026-05-14', nights: 1, value: 6800, source: 'Meta Ads', status: 'Confirmed' },
      { guest: 'Arjun Mehta', phone: '+91 99001 22112', email: 'arjun.m@gmail.com', property: 'Lakeside Resort', roomType: 'Villa', guests: 8, checkin: '2026-06-08', nights: 5, value: 184000, source: 'WhatsApp', status: 'Inquiry' },
      { guest: 'Riya Sen', phone: '+91 88990 33445', email: 'riya.s@gmail.com', property: 'Beach Villa', roomType: 'Premium', guests: 2, checkin: '2026-05-19', nights: 3, value: 48000, source: 'TripAdvisor', status: 'Cancelled' },
    ],
  },

  agency: {
    schema: {
      columns: [
        { key: 'company', label: 'Client Company', type: 'text', width: 200 },
        { key: 'contact', label: 'Contact', type: 'text', width: 160 },
        { key: 'email', label: 'Email', type: 'email', width: 220 },
        { key: 'service', label: 'Service Interest', type: 'select', width: 180, options: ['Branding', 'Web Development', 'Performance Marketing', 'SEO', 'Content', 'Consulting'] },
        { key: 'budget', label: 'Budget Range', type: 'select', width: 160, options: ['<₹50K', '₹50K-₹2L', '₹2L-₹10L', '₹10L-₹50L', '₹50L+'] },
        { key: 'timeline', label: 'Timeline', type: 'select', width: 130, options: ['Immediate', '1 month', '3 months', '6 months+'] },
        { key: 'value', label: 'Project Value', type: 'currency', width: 140 },
        { key: 'source', label: 'Source', type: 'select', width: 140, options: ['LinkedIn', 'Google Ads', 'Referral', 'Email', 'Twitter', 'Conference'] },
        { key: 'discoveryCall', label: 'Discovery Call', type: 'date', width: 140 },
        { key: 'status', label: 'Stage', type: 'select', width: 140, options: ['Inquiry', 'Discovery', 'Proposal', 'Negotiation', 'Signed', 'Lost'] },
      ],
      sources: ['LinkedIn', 'Google Ads', 'Referral', 'Email', 'Twitter', 'Conference'],
      statuses: ['Inquiry', 'Discovery', 'Proposal', 'Negotiation', 'Signed', 'Lost'],
    },
    rows: [
      { company: 'Bluewave Foods', contact: 'Tarun Bhalla', email: 'tarun@bluewave.in', service: 'Branding', budget: '₹2L-₹10L', timeline: '1 month', value: 480000, source: 'LinkedIn', discoveryCall: '2026-05-12', status: 'Proposal' },
      { company: 'Polaris EdTech', contact: 'Meera Sundar', email: 'meera@polarisedu.com', service: 'Performance Marketing', budget: '₹10L-₹50L', timeline: 'Immediate', value: 1840000, source: 'Referral', discoveryCall: '2026-05-10', status: 'Negotiation' },
      { company: 'Helios Realty', contact: 'Anand Kapoor', email: 'anand@heliosrealty.com', service: 'Web Development', budget: '₹2L-₹10L', timeline: '3 months', value: 640000, source: 'Google Ads', discoveryCall: '2026-05-14', status: 'Discovery' },
      { company: 'Verdant Wellness', contact: 'Riya Pillai', email: 'riya@verdantwell.com', service: 'SEO', budget: '₹50K-₹2L', timeline: '1 month', value: 124000, source: 'Email', discoveryCall: '2026-05-08', status: 'Signed' },
      { company: 'Apex Fintech', contact: 'Saurabh Shah', email: 'saurabh@apexfin.in', service: 'Content', budget: '₹2L-₹10L', timeline: '6 months+', value: 380000, source: 'LinkedIn', discoveryCall: '2026-05-15', status: 'Discovery' },
      { company: 'Zenith Auto', contact: 'Pranav Iyer', email: 'pranav@zenithauto.in', service: 'Consulting', budget: '₹10L-₹50L', timeline: 'Immediate', value: 1240000, source: 'Conference', discoveryCall: '2026-05-11', status: 'Proposal' },
      { company: 'Sapphire Travel', contact: 'Kritika Roy', email: 'kritika@sapphiretrvl.com', service: 'Performance Marketing', budget: '₹50K-₹2L', timeline: '1 month', value: 184000, source: 'Twitter', discoveryCall: '2026-05-16', status: 'Inquiry' },
      { company: 'Quantum Health', contact: 'Vivek Mehra', email: 'vivek@quantumh.com', service: 'Branding', budget: '₹50L+', timeline: '6 months+', value: 6400000, source: 'Referral', discoveryCall: '2026-05-20', status: 'Negotiation' },
      { company: 'Nimbus Logistics', contact: 'Lakshmi Nair', email: 'lakshmi@nimbuslog.com', service: 'Web Development', budget: '₹10L-₹50L', timeline: '3 months', value: 1840000, source: 'LinkedIn', discoveryCall: '2026-05-09', status: 'Signed' },
      { company: 'Crest Beverages', contact: 'Arjun Patel', email: 'arjun@crestbev.com', service: 'Content', budget: '₹2L-₹10L', timeline: '3 months', value: 420000, source: 'Email', discoveryCall: '2026-05-22', status: 'Inquiry' },
      { company: 'Halcyon Apparel', contact: 'Naina Joshi', email: 'naina@halcyonap.com', service: 'Performance Marketing', budget: '₹10L-₹50L', timeline: 'Immediate', value: 1240000, source: 'Google Ads', discoveryCall: '2026-05-13', status: 'Discovery' },
      { company: 'Iris Skincare', contact: 'Devika Rao', email: 'devika@irisskincare.com', service: 'SEO', budget: '<₹50K', timeline: '1 month', value: 48000, source: 'Twitter', discoveryCall: '2026-05-07', status: 'Lost' },
    ],
  },
}



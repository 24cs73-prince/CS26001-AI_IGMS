/** Dummy leave-application records for the teacher portal. */
export const leaveApplications = [
  { id: 'LV-3012', teacher: 'Dr. Meenakshi Iyer', type: 'Casual Leave', from: '2026-07-28', to: '2026-07-29', days: 2, reason: 'Family function at hometown.', status: 'Approved', appliedOn: '2026-07-20' },
  { id: 'LV-3013', teacher: 'Rakesh Menon', type: 'Sick Leave', from: '2026-07-30', to: '2026-07-30', days: 1, reason: 'Fever and medical rest advised.', status: 'Approved', appliedOn: '2026-07-30' },
  { id: 'LV-3014', teacher: 'Sushmita Roy', type: 'Earned Leave', from: '2026-08-11', to: '2026-08-14', days: 4, reason: 'Pre-planned travel with family.', status: 'Pending', appliedOn: '2026-08-01' },
  { id: 'LV-3015', teacher: 'Sandeep Yadav', type: 'Casual Leave', from: '2026-08-05', to: '2026-08-05', days: 1, reason: 'Personal work at bank.', status: 'Pending', appliedOn: '2026-08-02' },
  { id: 'LV-3016', teacher: 'Ritu Malviya', type: 'Sick Leave', from: '2026-07-18', to: '2026-07-19', days: 2, reason: 'Viral infection.', status: 'Rejected', appliedOn: '2026-07-17' },
];

// Static balance summary shown as cards on the Apply Leave page (demo values).
export const leaveBalance = [
  { key: 'casual', type: 'Casual Leave', used: 4, total: 12 },
  { key: 'sick', type: 'Sick Leave', used: 6, total: 12 },
  { key: 'earned', type: 'Earned Leave', used: 15, total: 30 },
];

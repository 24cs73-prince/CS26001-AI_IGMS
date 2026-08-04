/** Weekly timetable dummy data (Class 10-A view). */
export const periods = [
  '08:00 – 08:45',
  '08:45 – 09:30',
  '09:30 – 10:15',
  '10:15 – 10:30', // break
  '10:30 – 11:15',
  '11:15 – 12:00',
  '12:00 – 12:45',
];

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// subject palette key -> used for colored cards
const S = {
  math: { subject: 'Mathematics', teacher: 'Dr. M. Iyer', tone: 'primary' },
  sci: { subject: 'Science', teacher: 'R. Menon', tone: 'accent' },
  eng: { subject: 'English', teacher: 'S. Roy', tone: 'secondary' },
  soc: { subject: 'Social Science', teacher: 'A. Nair', tone: 'warning' },
  cs: { subject: 'Computer Sci.', teacher: 'S. Yadav', tone: 'info' },
  pe: { subject: 'Phys. Education', teacher: 'G. Saxena', tone: 'danger' },
  break: { subject: 'Short Break', teacher: '', tone: 'muted' },
};

export const timetable = {
  className: 'Class 10 · Section A',
  periods,
  days,
  grid: {
    Monday: [S.math, S.eng, S.sci, S.break, S.soc, S.cs, S.pe],
    Tuesday: [S.sci, S.math, S.eng, S.break, S.cs, S.soc, S.math],
    Wednesday: [S.eng, S.soc, S.math, S.break, S.sci, S.pe, S.cs],
    Thursday: [S.cs, S.sci, S.soc, S.break, S.math, S.eng, S.sci],
    Friday: [S.math, S.pe, S.eng, S.break, S.soc, S.cs, S.sci],
    Saturday: [S.eng, S.math, S.cs, S.break, S.sci, S.soc, S.pe],
  },
};

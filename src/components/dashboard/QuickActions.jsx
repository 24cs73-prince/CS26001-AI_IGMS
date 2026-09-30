import { useNavigate } from 'react-router-dom';
import { FiUserPlus, FiCheckSquare, FiFilePlus, FiBell, FiCpu } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Dashboard quick-action shortcuts with bilingual support.
 */
export default function QuickActions() {
  const navigate = useNavigate();
  const { language, isGu } = useLanguage();

  const ACTIONS = [
    {
      label: isGu ? 'વિદ્યાર્થી ઉમેરો' : 'Add Student',
      icon: FiUserPlus,
      to: '/students',
      tone: 'text-primary bg-primary/10',
    },
    {
      label: isGu ? 'હાજરી પૂરો' : 'Mark Attendance',
      icon: FiCheckSquare,
      to: '/attendance',
      tone: 'text-accent bg-accent/10',
    },
    {
      label: isGu ? 'પરીક્ષા બનાવો' : 'Create Exam',
      icon: FiFilePlus,
      to: '/examination',
      tone: 'text-secondary bg-secondary/10',
    },
    {
      label: isGu ? 'સૂચના મૂકો' : 'Post Notice',
      icon: FiBell,
      to: '/notices',
      tone: 'text-warning bg-warning/10',
    },
    {
      label: isGu ? 'AI પ્રશ્નપત્ર' : 'AI Paper',
      icon: FiCpu,
      to: '/ai/question-paper',
      tone: 'text-danger bg-danger/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {ACTIONS.map((a) => {
        const Icon = a.icon;
        return (
          <button
            key={a.label}
            onClick={() => navigate(a.to)}
            className="flex flex-col items-center gap-2 rounded-xl border border-hairline bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-xs font-medium text-slate-600">{a.label}</span>
          </button>
        );
      })}
    </div>
  );
}

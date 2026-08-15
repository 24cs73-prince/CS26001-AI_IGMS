import PageHeader from '../components/common/PageHeader';
import Card from '../components/ui/Card';

export default function Principals() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Principal Management"
        description="Assign or manage school principal credentials from the Super Admin layer."
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Principals' }]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Create Principal" subtitle="School + District + Principal profile" className="bg-white">
          <div className="mt-4 rounded-2xl border border-dashed border-primary/50 p-4 text-sm text-slate-600">
            School details, district, principal details, and initial credentials can be assigned here.
          </div>
        </Card>
        <Card title="Principal Credentials" subtitle="Credential assignment" className="bg-white">
          <div className="mt-4 rounded-2xl border border-hairline p-4 text-sm text-slate-600">
            Super Admin &rarr; Principal credential setup remains controlled at this layer.
          </div>
        </Card>
        <Card title="School Assignment" subtitle="Principal linked to one school" className="bg-white">
          <div className="mt-4 rounded-2xl border border-hairline p-4 text-sm text-slate-600">
            School A: Principal Rohan Administrator
          </div>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";

export default function Schools() {
  const [schools, setSchools] = useState([
    {
      schoolName: "Govt. Higher Secondary School · School A",
      district: "North District",
      principal: "Rohan Administrator",
      principalEmail: "principal@school-a.igms.gov.in",
      status: "Active",
    },
    {
      schoolName: "Govt. Model School · School B",
      district: "East District",
      principal: "Pending Assignment",
      principalEmail: "unassigned",
      status: "Pending",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    schoolName: "",
    district: "",
    address: "",
    principalName: "",
    principalEmail: "",
    principalPhone: "",
    principalPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAddSchool = () => {
    const newSchool = {
      schoolName: form.schoolName || "New School",
      district: form.district || "Unassigned District",
      principal: form.principalName || "Pending Assignment",
      principalEmail: form.principalEmail || "unassigned",
      status: "Pending",
    };

    setSchools((current) => [newSchool, ...current]);
    setForm({
      schoolName: "",
      district: "",
      address: "",
      principalName: "",
      principalEmail: "",
      principalPhone: "",
      principalPassword: "",
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Management"
        description="Create, review, and manage schools and district assignments."
        breadcrumbs={[{ label: "Super Admin" }, { label: "Schools" }]}
        action={
          <Button type="button" size="md" onClick={() => setModalOpen(true)}>
            Add School
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Total Schools"
          subtitle="Active school records"
          className="bg-white"
        >
          <div className="mt-4 text-3xl font-bold text-ink">
            {String(schools.length).padStart(2, "0")}
          </div>
        </Card>
        <Card
          title="Districts"
          subtitle="Assigned districts"
          className="bg-white"
        >
          <div className="mt-4 text-3xl font-bold text-ink">02</div>
        </Card>
        <Card
          title="Principals"
          subtitle="School principals"
          className="bg-white"
        >
          <div className="mt-4 text-3xl font-bold text-ink">02</div>
        </Card>
        <Card
          title="Status"
          subtitle="Overall school health"
          className="bg-white"
        >
          <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
            Healthy
          </div>
        </Card>
      </div>

      <Card
        title="School Directory"
        subtitle="Super Admin → School → Principal credentials"
      >
        <div className="mt-4 space-y-3">
          {schools.map((school, index) => (
            <div
              key={`${school.schoolName}-${index}`}
              className="flex items-center justify-between rounded-2xl border border-hairline p-4"
            >
              <div>
                <p className="font-semibold text-ink">{school.schoolName}</p>
                <p className="text-xs text-slate-500">
                  District: {school.district} · Principal: {school.principal}
                </p>
                <p className="text-xs text-slate-500">
                  Principal email: {school.principalEmail}
                </p>
              </div>
              <span
                className={
                  school.status === "Active"
                    ? "rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                    : "rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700"
                }
              >
                {school.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New School"
        subtitle="Create a school and assign initial principal credentials."
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAddSchool}>
              Save School
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="School Name"
            name="schoolName"
            value={form.schoolName}
            onChange={handleChange}
            placeholder="e.g. Govt. Senior Secondary School"
            required
          />
          <Input
            label="District"
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="District name"
            required
          />
          <Input
            label="School Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street / village / city"
            className="md:col-span-2"
          />
          <Input
            label="Principal Name"
            name="principalName"
            value={form.principalName}
            onChange={handleChange}
            placeholder="Principal full name"
          />
          <Input
            label="Principal Email"
            name="principalEmail"
            value={form.principalEmail}
            onChange={handleChange}
            placeholder="principal@school.edu"
          />
          <Input
            label="Principal Phone"
            name="principalPhone"
            value={form.principalPhone}
            onChange={handleChange}
            placeholder="+91 9876543210"
          />
          <Input
            label="Initial Principal Password"
            name="principalPassword"
            type="password"
            value={form.principalPassword}
            onChange={handleChange}
            placeholder="Temporary password"
          />
        </div>
      </Modal>
    </div>
  );
}

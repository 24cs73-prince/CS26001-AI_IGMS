import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiKey, FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import PageHeader from "../components/common/PageHeader";

export default function ChangePassword() {
  const { user, changePassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await changePassword(form);
      toast.success(result.message);
      navigate(user?.home || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <PageHeader
        title="Change Password"
        description={
          user?.mustChangePassword
            ? "You must change your temporary password before continuing."
            : "Update your password"
        }
        breadcrumbs={[{ label: "Account" }, { label: "Change Password" }]}
      />

      <div className="rounded-3xl border border-hairline bg-white p-6 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Current password"
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
            leadingIcon={FiLock}
            required
          />

          <Input
            label="New password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="New password"
            leadingIcon={FiKey}
            required
          />

          <Input
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            leadingIcon={FiShield}
            error={error}
            required
          />

          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            Password must be at least 8 characters, include upper/lower case
            letters, a number, and a special character.
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              loading={loading}
              className="w-full md:w-auto"
            >
              Update Password
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                navigate(user?.home || "/dashboard", { replace: true })
              }
            >
              Later
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

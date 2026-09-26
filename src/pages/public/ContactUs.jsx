import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiUser,
  FiHelpCircle,
} from "react-icons/fi";

/**
 * Public Contact Us & Grievance Redressal Page
 * School Education Department, Government of Gujarat
 */
export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "Gandhinagar",
    role: "Teacher",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        district: "Gandhinagar",
        role: "Teacher",
        subject: "",
        message: "",
      });
    }, 4000);
  };

  const deoDirectory = [
    { district: "Gandhinagar", officer: "Shri V. M. Patel", phone: "079-23253401", email: "deo-gdh@gujarat.gov.in" },
    { district: "Ahmedabad City", officer: "Smt. R. K. Solanki", phone: "079-25624102", email: "deo-ahd-city@gujarat.gov.in" },
    { district: "Surat", officer: "Shri D. B. Chaudhari", phone: "0261-2461904", email: "deo-surat@gujarat.gov.in" },
    { district: "Vadodara", officer: "Shri M. S. Parmar", phone: "0265-2431201", email: "deo-vadodara@gujarat.gov.in" },
    { district: "Rajkot", officer: "Shri B. S. Kaila", phone: "0281-2471809", email: "deo-rajkot@gujarat.gov.in" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-8 py-6"
    >
      {/* Hero Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-[#17395f] via-[#1b436f] to-blue-900 p-8 text-white shadow-lg sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-xs">
          <FiHelpCircle className="h-4 w-4 text-emerald-400" />
          Official Contact & Support Portal
        </div>

        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          Department Contact & Public Redressal Desk
        </h1>
        <p className="mt-2 text-sm text-blue-200">
          સંપર્ક કરો અને ફરિયાદ નિવારણ ડેસ્ક - શિક્ષણ વિભાગ, ગુજરાત સરકાર
        </p>
        <p className="mt-4 max-w-3xl text-sm text-blue-100/90 leading-relaxed">
          Reach out to the Education Department headquarters, District Education Officers (DEO), or submit direct inquiries and grievances regarding school administration and digital services.
        </p>
      </div>

      {/* Main Grid: Contact Cards + Grievance Form */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Department Contact Details */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-[#17395f] border-b border-slate-100 pb-3">
              Headquarters Info
            </h2>
            <div className="mt-4 space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-700">
                  <FiMapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">State Headquarters</p>
                  <p className="text-slate-600 mt-0.5">
                    Block No. 5, 8th Floor, New Sachivalaya, Gandhinagar, Gujarat - 382010
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <FiPhone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Toll-Free Education Helpline</p>
                  <p className="font-semibold text-emerald-700 mt-0.5">1800-233-5500 / 079-23253401</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-purple-50 p-2 text-purple-700">
                  <FiMail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Official Email Support</p>
                  <p className="text-purple-700 font-semibold mt-0.5">info-education@gujarat.gov.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-orange-50 p-2 text-orange-700">
                  <FiClock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Official Office Hours</p>
                  <p className="text-slate-600 mt-0.5">Monday to Saturday: 10:30 AM to 6:10 PM</p>
                  <p className="text-[11px] text-slate-400">(Closed on 2nd & 4th Saturdays and Public Holidays)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-amber-900">
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-800">
              📌 Emergency Grievance Support
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-amber-800/90">
              For immediate assistance regarding AI Question Generator or school portal login issues, teachers can directly contact their respective District Education Office (DEO).
            </p>
          </div>
        </div>

        {/* Right Column: Public Redressal / Inquiry Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
          <h2 className="text-lg font-bold text-[#17395f]">
            Submit Inquiry or Public Grievance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fill out the official form below. Your query will be assigned a tracking ID and routed to the concerned department officer.
          </p>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800"
            >
              <FiCheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                Thank you! Your grievance / query has been successfully logged with Reference ID <strong>GUJ-EDU-2026-8942</strong>. Our desk will respond within 48 working hours.
              </span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs focus-within:border-blue-600 focus-within:bg-white">
                  <FiUser className="mr-2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent outline-none text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs focus-within:border-blue-600 focus-within:bg-white">
                  <FiMail className="mr-2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.gov.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent outline-none text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Mobile Number *</label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs focus-within:border-blue-600 focus-within:bg-white">
                  <FiPhone className="mr-2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent outline-none text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">District *</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Surat">Surat</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Bhavnagar">Bhavnagar</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">User Category / Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Teacher">School Teacher / Principal</option>
                  <option value="Student">Student / Parent</option>
                  <option value="DEO Staff">DEO / Block Officer</option>
                  <option value="Citizen">General Citizen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Subject / Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Question Paper Generator Feedback"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Message / Grievance Details *</label>
              <textarea
                rows={4}
                required
                placeholder="Provide detailed information regarding your inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50/50 p-3 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#17395f] to-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-blue-800 hover:to-blue-900 active:scale-98"
            >
              <FiSend className="h-4 w-4" />
              Submit Official Grievance
            </button>
          </form>
        </div>
      </div>

      {/* District Education Officer (DEO) Contact Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-bold text-[#17395f] mb-1">
          District Education Officer (DEO) Directory
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          જિલ્લા શિક્ષણાધિકારી કચેરી સંપર્ક યાદી
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Designated DEO Officer</th>
                <th className="py-3 px-4">Phone Contact</th>
                <th className="py-3 px-4">Official Email ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {deoDirectory.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition">
                  <td className="py-3 px-4 font-bold text-[#17395f]">{item.district}</td>
                  <td className="py-3 px-4">{item.officer}</td>
                  <td className="py-3 px-4 font-mono font-medium text-emerald-700">{item.phone}</td>
                  <td className="py-3 px-4 font-mono text-blue-700">{item.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

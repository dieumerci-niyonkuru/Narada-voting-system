import React, { useState } from "react";
import { supabase } from "../../utils/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SocialFooter from "../common/SocialFooter";
import Icon from "../common/Icon";

function MemberRegister({ onBack, onRegisterSuccess }) {
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) return cleaned;
    return cleaned.slice(0, 10);
  };

  const registerMember = async (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      toast.error("Shyiramo numero ya telefoni y'imibare 10");
      return;
    }

    if (!fullName.trim()) {
      toast.error("Shyiramo izina ryawe ryose");
      return;
    }

    setLoading(true);

    try {
      // Check if phone already registered
      const { data: existing } = await supabase
        .from("profiles")
        .select("phone")
        .eq("phone", phone)
        .single();

      if (existing) {
        toast.error("❌ Iyi numero imaze kwandikwa. Kwinjira hanyuma.");
        setLoading(false);
        return;
      }

      // Generate a unique ID for the member (no auth user needed)
      const tempId = crypto.randomUUID();

      // Create profile directly without auth user
      const { error: profileError } = await supabase.from("profiles").insert({
        id: tempId,
        phone: phone,
        full_name: fullName,
        email: email || null,
        role: "member",
        is_approved: false,
        approval_code: null,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Profile error:", profileError);
        toast.error("Error creating profile: " + profileError.message);
        setLoading(false);
        return;
      }

      toast.success(
        "��� Iyandikishwa ryakozwe! Rindira ubuyobozi bukemeze konti yawe.",
      );

      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Error during registration");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600">
      <div className="flex items-center justify-center flex-grow p-4">
        <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
          <div className="mb-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 mx-auto mb-4 text-sm text-gray-400 hover:text-gray-600"
            >
              <Icon name="back" /> Subira ku rubuga rukuru
            </button>
            <Icon name="add" size="text-6xl" className="mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
              Iyandikishe
            </h1>
            <p className="mt-1 text-gray-600">Narada Voting Committee 2026</p>
          </div>

          <form onSubmit={registerMember}>
            <div className="mb-4">
              <label className="flex items-center block gap-2 mb-2 font-medium text-gray-700">
                <Icon name="phone" /> Numero ya Telefoni *
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  placeholder="0788XXXXXX"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength="10"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Shyiramo numero yawe ya telefoni (utagira 0 mbere)
              </p>
            </div>

            <div className="mb-4">
              <label className="flex items-center block gap-2 mb-2 font-medium text-gray-700">
                <Icon name="user" /> Izina Ryose *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Urugero: Jean Paul"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center block gap-2 mb-2 font-medium text-gray-700">
                <Icon name="email" /> Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ntabwo ari ngombwa, ariko uzakira amakuru
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Icon name="loading" spin={true} /> Birandikwa...
                </>
              ) : (
                <>
                  <Icon name="add" /> Iyandikishe
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center w-full gap-1 mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              <Icon name="back" /> Subira inyuma
            </button>
          </form>

          <div className="pt-4 mt-6 text-center border-t">
            <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <Icon name="lock" /> Uzabona kode yo kwinjira nyuma y'ukwemezwa
            </p>
          </div>
        </div>
      </div>
      <SocialFooter />
    </div>
  );
}

export default MemberRegister;

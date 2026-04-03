import React, { useState } from "react";
import { supabase } from "../../utils/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SocialFooter from "../common/SocialFooter";
import Icon from "../common/Icon";

function MemberLogin({ onLogin, onShowRegister }) {
  const [phone, setPhone] = useState("");
  const [approvalCode, setApprovalCode] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) return cleaned;
    return cleaned.slice(0, 10);
  };

  const checkMember = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error("Shyiramo numero ya telefoni imibare 10");
      return;
    }

    setLoading(true);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !profile) {
      toast.error("❌ Iyi numero ntibonetse. Iyandikishe mbere.");
      setLoading(false);
      return;
    }

    if (!profile.is_approved) {
      toast.error(
        "⏳ Konti yawe irategereje kwemezwa. Uzabona kode nyuma y'ukwemezwa.",
      );
      setLoading(false);
      return;
    }

    setStep("code");
    setLoading(false);
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (approvalCode.length < 4) {
      toast.error("Shyiramo kode yawe");
      return;
    }

    setLoading(true);

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("phone", phone)
        .eq("approval_code", approvalCode.toUpperCase())
        .single();

      if (error || !profile) {
        toast.error("❌ Kode itemewe. Jya ubaza ubuyobozi.");
        setLoading(false);
        return;
      }

      // Update last login
      await supabase
        .from("profiles")
        .update({ last_login: new Date().toISOString() })
        .eq("id", profile.id);

      // Create session in localStorage
      const sessionData = {
        user: profile,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem("narada_session", JSON.stringify(sessionData));

      toast.success(
        `��� Murakaza neza, ${profile.full_name || "Munyameremeri"}!`,
      );
      onLogin(profile);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
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
            <Icon name="member" size="text-6xl" className="mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
              Kwinjira nk'Umuryango
            </h1>
            <p className="mt-1 text-gray-600">Narada Voting Committee 2026</p>
          </div>

          {step === "phone" && (
            <>
              <form onSubmit={checkMember}>
                <div className="mb-6">
                  <label className="flex items-center block gap-2 mb-2 font-medium text-gray-700">
                    <Icon name="phone" /> Numero ya Telefoni
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(formatPhoneNumber(e.target.value))
                      }
                      placeholder="0788XXXXXX"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      maxLength="10"
                      autoFocus
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Shyiramo numero yawe ya telefoni (utagira 0 mbere)
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Icon name="loading" spin={true} /> Raragenzura...
                    </>
                  ) : (
                    <>
                      <Icon name="login" /> Komeza
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 mt-6 text-center border-t">
                <button
                  onClick={onShowRegister}
                  className="flex items-center justify-center w-full gap-2 text-lg font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <Icon name="add" /> Ntabwo uri mwemerwa? Iyandikishe
                </button>
              </div>
            </>
          )}

          {step === "code" && (
            <form onSubmit={verifyCode}>
              <div className="mb-4 text-center">
                <div className="flex items-center justify-center gap-2 p-3 mb-4 rounded-lg bg-blue-50">
                  <Icon name="success" />
                  <p className="text-sm text-blue-700">
                    ✓ Iyi numero yanditswe: {phone}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center justify-center block gap-2 mb-2 font-medium text-center text-gray-700">
                  <Icon name="lock" /> Kode yo Kwinjira
                </label>
                <input
                  type="text"
                  value={approvalCode}
                  onChange={(e) =>
                    setApprovalCode(
                      e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "")
                        .slice(0, 8),
                    )
                  }
                  placeholder="Urugero: A7B3K9M2"
                  className="w-full px-4 py-3 font-mono text-xl tracking-widest text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength="8"
                  autoFocus
                  required
                />
                <p className="mt-2 text-xs text-center text-gray-500">
                  Kode utanga ubuyobozi
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Icon name="loading" spin={true} /> Raragenzura...
                  </>
                ) : (
                  <>
                    <Icon name="success" /> Kwinjira
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("phone")}
                className="flex items-center justify-center w-full gap-1 mt-3 text-sm text-indigo-600 hover:text-indigo-800"
              >
                <Icon name="back" /> Subira inyuma
              </button>
            </form>
          )}
        </div>
      </div>
      <SocialFooter />
    </div>
  );
}

export default MemberLogin;

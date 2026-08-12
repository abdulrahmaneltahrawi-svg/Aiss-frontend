import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AuthModals() {
  const [user, setUser] = useState(null);
  const [currentModel, setCurrentModel] = useState(null); // null | "login" | "signup" | "forgot" | "verify" | "reset"

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => checkAuth();
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/check_user_auth.php");
      const data = await res.json();
      if (data.success && data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    }
  }

  async function handleLogout(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/user_logout.php");
      const data = await res.json();
      if (data.success) {
        setUser(null);
        window.dispatchEvent(new Event("auth-change"));
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  function showModel(name) {
    setCurrentModel(name);
  }

  function hideModels() {
    setCurrentModel(null);
  }

  // ===== تسجيل الدخول =====
  const doLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email")?.value;
    const password = document.getElementById("login-password")?.value;
    const messageEl = document.getElementById("auth-message");

    if (!email || !password) {
      if (messageEl) {
        messageEl.textContent = "يرجى ملء جميع الحقول";
        messageEl.style.color = "red";
      }
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("/api/user_login.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        if (messageEl) {
          messageEl.textContent = "تم تسجيل الدخول بنجاح!";
          messageEl.style.color = "green";
        }
        setTimeout(() => {
          setCurrentModel(null);
          checkAuth();
          window.dispatchEvent(new Event("auth-change"));
        }, 1000);
      } else {
        if (messageEl) {
          messageEl.textContent = data.message;
          messageEl.style.color = "red";
        }
      }
    } catch (error) {
      const messageEl = document.getElementById("auth-message");
      if (messageEl) {
        messageEl.textContent = "حدث خطأ في الاتصال بالخادم";
        messageEl.style.color = "red";
      }
    }
  };

  // ===== إنشاء حساب جديد =====
  const doSignup = async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name")?.value;
    const email = document.getElementById("signup-email")?.value;
    const phone = document.getElementById("signup-phone")?.value;
    const password = document.getElementById("signup-password")?.value;
    const messageEl = document.getElementById("signup-auth-message");

    if (!name || !email || !password) {
      if (messageEl) {
        messageEl.textContent = "يرجى ملء جميع الحقول المطلوبة";
        messageEl.style.color = "red";
      }
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);

    try {
      const res = await fetch("/api/user_register.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        if (messageEl) {
          messageEl.textContent = data.message;
          messageEl.style.color = "green";
        }
        setTimeout(() => setCurrentModel("login"), 1500);
      } else {
        if (messageEl) {
          messageEl.textContent = data.message;
          messageEl.style.color = "red";
        }
      }
    } catch (error) {
      const messageEl = document.getElementById("signup-auth-message");
      if (messageEl) {
        messageEl.textContent = "حدث خطأ في الاتصال بالخادم";
        messageEl.style.color = "red";
      }
    }
  };

  // ===== نسيت كلمة المرور =====
  const doForgot = async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgot-email")?.value;
    const messageEl = document.getElementById("forgot-auth-message");

    if (!email) {
      if (messageEl) {
        messageEl.textContent = "يرجى إدخال البريد الإلكتروني";
        messageEl.style.color = "red";
      }
      return;
    }

    const formData = new FormData();
    formData.append("email", email);

    try {
      const res = await fetch("/api/forgot_password.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        if (messageEl) {
          messageEl.textContent = data.message;
          messageEl.style.color = "green";
        }
        setTimeout(() => setCurrentModel("verify"), 1500);
      } else {
        if (messageEl) {
          messageEl.textContent = data.message;
          messageEl.style.color = "red";
        }
      }
    } catch (error) {
      const messageEl = document.getElementById("forgot-auth-message");
      if (messageEl) {
        messageEl.textContent = "حدث خطأ في الاتصال بالخادم";
        messageEl.style.color = "red";
      }
    }
  };

  // ===== التحقق من الرمز =====
  const doVerify = async (e) => {
    e.preventDefault();
    const code = document.getElementById("verify-code")?.value;
    const messageEl = document.getElementById("verify-auth-message");

    if (!code) {
      if (messageEl) {
        messageEl.textContent = "يرجى إدخال رمز التحقق";
        messageEl.style.color = "red";
      }
      return;
    }

    const formData = new FormData();
    formData.append("code", code);

    try {
      const res = await fetch("/api/verify_code.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        if (messageEl) {
          messageEl.textContent = "تم التحقق بنجاح";
          messageEl.style.color = "green";
        }
        setTimeout(() => setCurrentModel("reset"), 1000);
      } else {
        if (messageEl) {
          messageEl.textContent = data.message;
          messageEl.style.color = "red";
        }
      }
    } catch (error) {
      const messageEl = document.getElementById("verify-auth-message");
      if (messageEl) {
        messageEl.textContent = "حدث خطأ في الاتصال بالخادم";
        messageEl.style.color = "red";
      }
    }
  };

  // ===== تعيين كلمة مرور جديدة =====
  const doReset = async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("new-password")?.value;
    const confirmPassword = document.getElementById("confirm-password")?.value;
    const messageEl = document.getElementById("reset-auth-message");

    if (!newPassword || !confirmPassword) {
      if (messageEl) {
        messageEl.textContent = "يرجى ملء جميع الحقول";
        messageEl.style.color = "red";
      }
      return;
    }

    if (newPassword !== confirmPassword) {
      if (messageEl) {
        messageEl.textContent = "كلمة المرور غير متطابقة";
        messageEl.style.color = "red";
      }
      return;
    }

    if (newPassword.length < 6) {
      if (messageEl) {
        messageEl.textContent = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
        messageEl.style.color = "red";
      }
      return;
    }

    const formData = new FormData();
    formData.append("password", newPassword);

    try {
      const res = await fetch("/api/reset_password.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        if (messageEl) {
          messageEl.textContent = "تم تغيير كلمة المرور بنجاح";
          messageEl.style.color = "green";
        }
        setTimeout(() => {
          setCurrentModel(null);
          setCurrentModel("login");
        }, 1500);
      } else {
        if (messageEl) {
          messageEl.textContent = data.message;
          messageEl.style.color = "red";
        }
      }
    } catch (error) {
      const messageEl = document.getElementById("reset-auth-message");
      if (messageEl) {
        messageEl.textContent = "حدث خطأ في الاتصال بالخادم";
        messageEl.style.color = "red";
      }
    }
  };

  // Close modal when clicking overlay background
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("model-overlay")) {
      setCurrentModel(null);
    }
  };

  return (
    <>
      {/* زر تسجيل الدخول / معلومات المستخدم */}
      {user ? (
        <div className="flex items-center gap-2 p-[10px_20px] text-[13px] font-bold border border-[rgba(114,113,113,0.049)] rounded-[5px] bg-[rgb(245,245,245)] text-[#111] cursor-default max-[600px]:w-auto max-[600px]:min-w-25 max-[600px]:text-[11px] max-[600px]:text-black max-[600px]:p-[6px_8px] max-[600px]:m-0 max-[600px]:whitespace-nowrap max-[600px]:mb-2.5 max-[600px]:ml-2.5">
          <img src="/assets/icons/login.webp" alt="user" loading="lazy" className="w-3.75 h-auto opacity-70" />
          <span className="text-[14px] font-bold text-primary">{user.name}</span>
          {user.can_add_article == 1 && (
            <Link
              to="/admin"
              className="bg-primary text-white no-underline rounded-[5px] p-[5px_10px] cursor-pointer text-[12px]"
            >
              لوحة التحكم
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="bg-accent text-white border-none rounded-[5px] p-[5px_10px] cursor-pointer text-[12px]"
          >
            تسجيل الخروج
          </button>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 p-[10px_20px] text-[13px] font-bold border border-[rgba(114,113,113,0.049)] rounded-[5px] bg-[rgb(245,245,245)] text-[#111] cursor-pointer hover:shadow-[0_0_5px] max-[600px]:w-auto max-[600px]:min-w-25 max-[600px]:text-[11px] max-[600px]:text-black max-[600px]:p-[6px_8px] max-[600px]:m-0 max-[600px]:whitespace-nowrap max-[600px]:mb-2.5 max-[600px]:ml-2.5"
          type="button"
          onClick={() => setCurrentModel("login")}
        >
          <img src="/assets/icons/login.webp" alt="btn-logo" loading="lazy" className="w-3.75 h-auto" />
          <span>تسجيل الدخول</span>
        </button>
      )}

      {/* تسجيل الدخول */}
      {currentModel === "login" && (
        <form
          className="model-overlay hidden fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.1)] backdrop-blur-[2px] z-1000 justify-center items-center"
          id="loginModel"
          style={{ display: "flex" }}
          onSubmit={doLogin}
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-7.5 rounded-2xl w-100 max-h-[90vh] overflow-y-auto text-center rtl relative shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
            <span className="absolute top-5 right-5 text-[24px] cursor-pointer text-[#888]" onClick={() => setCurrentModel(null)}>&times;</span>
            <h3 className="mb-2.75">تسجيل الدخول</h3>
            <input type="email" id="login-email" name="email" className="w-full p-3 border border-[#ddd] rounded-lg mb-2 box-border" placeholder="البريد الإلكتروني" autoComplete="email" />
            <input type="password" id="login-password" name="password" className="w-full p-3 border border-[#ddd] rounded-lg mb-2 box-border" placeholder="كلمة المرور" autoComplete="current-password" />
            <button className="w-full p-3 bg-[rgb(241,241,241)] text-accent border-none rounded-lg text-[15px] font-bold cursor-pointer" id="login-submit" type="submit">متابعة</button>
            <p id="auth-message" className="min-h-4 m-[8px_0_4px] text-[12px] font-bold" aria-live="polite"></p>
            <a href="#" className="block text-right text-[12px] font-bold text-[#666] hover:underline" onClick={(e) => { e.preventDefault(); setCurrentModel("forgot"); }}>نسيت كلمة المرور؟</a>
            <div className="m-[6px_0_2px]">
              <span className="text-[12px] font-bold text-[#111]">ليس لديك حساب؟</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentModel("signup"); }} className="mt-0.5 inline-block text-[12px] font-black text-accent no-underline hover:underline" aria-label="أنشئ حسابًا">أنشئ حسابًا</a>
            </div>
            <Link to="/privacy"><p className="text-[11px] text-[#999] mt-3.5">تتم معالجة بياناتك الشخصية وفقاً <strong>سياسة الخصوصية</strong></p></Link>
          </div>
        </form>
      )}

      {/* إنشاء حساب جديد */}
      {currentModel === "signup" && (
        <form
          className="model-overlay hidden fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.1)] backdrop-blur-[2px] z-1000 justify-center items-center"
          id="signupModel"
          style={{ display: "flex" }}
          onSubmit={doSignup}
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-7.5 rounded-2xl w-100 max-h-[90vh] overflow-y-auto text-center rtl relative shadow-[0_10px_25px_rgba(0,0,0,0.1)]" onClick={(e) => e.stopPropagation()}>
            <span className="absolute top-5 right-5 text-[24px] cursor-pointer text-[#888]" onClick={() => setCurrentModel(null)}>&times;</span>
            <h3 className="mb-3.75">إنشاء حساب جديد</h3>
            <input type="text" id="signup-name" className="w-full p-3 border border-[#ddd] rounded-lg mb-2.5 box-border" placeholder="الاسم الكامل" />
            <input type="email" id="signup-email" className="w-full p-3 border border-[#ddd] rounded-lg mb-2.5 box-border" placeholder="البريد الإلكتروني" />
            <input type="tel" id="signup-phone" className="w-full p-3 border border-[#ddd] rounded-lg mb-2.5 box-border" placeholder="رقم الهاتف/الجوال" />
            <input type="password" id="signup-password" className="w-full p-3 border border-[#ddd] rounded-lg mb-2.5 box-border" placeholder="كلمة المرور" />
            <button className="w-full p-3 bg-[rgb(241,241,241)] text-accent border-none rounded-lg text-[15px] font-bold cursor-pointer" id="signup-submit" type="submit">إنشاء حساب</button>
            <p id="signup-auth-message" className="min-h-4 m-[8px_0_4px] text-[12px] font-bold" aria-live="polite"></p>
            <div className="m-[6px_0_2px]">
              <span className="text-[12px] font-bold text-[#111]">لديك حساب بالفعل؟</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentModel("login"); }} className="mt-0.5 inline-block text-[12px] font-black text-accent no-underline hover:underline">سجل الدخول</a>
            </div>
          </div>
        </form>
      )}

      {/* نسيت كلمة المرور */}
      {currentModel === "forgot" && (
        <form
          className="model-overlay hidden fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.1)] backdrop-blur-[2px] z-1000 justify-center items-center"
          id="forgotModel"
          style={{ display: "flex" }}
          onSubmit={doForgot}
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-7.5 rounded-2xl w-100 max-h-[90vh] overflow-y-auto text-center rtl relative shadow-[0_10px_25px_rgba(0,0,0,0.1)]" onClick={(e) => e.stopPropagation()}>
            <span className="absolute top-5 right-5 text-[24px] cursor-pointer text-[#888]" onClick={() => setCurrentModel(null)}>&times;</span>
            <h3 className="mb-3.75">نسيت كلمة المرور؟</h3>
            <label htmlFor="forgot-email" className="block text-right mb-1.25 text-[12px] font-bold">أدخل بريدك الإلكتروني المرتبط بالحساب:</label>
            <input type="email" id="forgot-email" className="w-full p-3 border border-[#ddd] rounded-lg mb-2.5 box-border" placeholder="البريد الإلكتروني" />
            <button className="w-full p-3 bg-[rgb(241,241,241)] text-accent border-none rounded-lg text-[15px] font-bold cursor-pointer" id="forgot-submit" type="submit">إرسال رابط الاستعادة</button>
            <p id="forgot-auth-message" className="min-h-4 m-[8px_0_4px] text-[12px] font-bold" aria-live="polite"></p>
          </div>
        </form>
      )}

      {/* التحقق من الرمز */}
      {currentModel === "verify" && (
        <form
          className="model-overlay hidden fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.1)] backdrop-blur-[2px] z-1000 justify-center items-center"
          id="verifyCodeModel"
          style={{ display: "flex" }}
          onSubmit={doVerify}
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-7.5 rounded-2xl w-100 max-h-[90vh] overflow-y-auto text-center rtl relative shadow-[0_10px_25px_rgba(0,0,0,0.1)]" onClick={(e) => e.stopPropagation()}>
            <span className="absolute top-5 right-5 text-[24px] cursor-pointer text-[#888]" onClick={() => setCurrentModel(null)}>&times;</span>
            <h3 className="mb-3.75">التحقق من الرمز</h3>
            <label htmlFor="verify-code" className="block text-right mb-2 text-[14px] font-bold text-accent">أدخل الرمز المرسل إلى بريدك:</label>
            <input type="text" id="verify-code" className="w-full p-3 border border-[#ddd] rounded-lg mb-2.5 box-border" placeholder="رمز التحقق" />
            <button className="w-full p-3 bg-[rgb(241,241,241)] text-accent border-none rounded-lg text-[15px] font-bold cursor-pointer" id="verify-code-submit" type="submit">تأكيد الرمز</button>
            <p id="verify-auth-message" className="min-h-4 m-[8px_0_4px] text-[12px] font-bold" aria-live="polite"></p>
          </div>
        </form>
      )}

      {/* تعيين كلمة مرور جديدة */}
      {currentModel === "reset" && (
        <form
          className="model-overlay hidden fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.1)] backdrop-blur-[2px] z-1000 justify-center items-center"
          id="resetPasswordModel"
          style={{ display: "flex" }}
          onSubmit={doReset}
          onClick={handleOverlayClick}
        >
          <div className="bg-white p-7.5 rounded-2xl w-100 max-h-[90vh] overflow-y-auto text-center rtl relative shadow-[0_10px_25px_rgba(0,0,0,0.1)]" onClick={(e) => e.stopPropagation()}>
            <span className="absolute top-5 right-5 text-[24px] cursor-pointer text-[#888]" onClick={() => setCurrentModel(null)}>&times;</span>
            <h3 className="mb-3.75">تعيين كلمة مرور جديدة</h3>
            <input type="password" id="new-password" className="w-full p-3 border border-[#ddd] rounded-lg mb-2.5 box-border" placeholder="كلمة المرور الجديدة" />
            <input type="password" id="confirm-password" className="w-full p-3 border border-[#ddd] rounded-lg mb-2.5 box-border" placeholder="تأكيد كلمة المرور" />
            <button className="w-full p-3 bg-[rgb(241,241,241)] text-accent border-none rounded-lg text-[15px] font-bold cursor-pointer" id="reset-password-submit" type="submit">حفظ كلمة المرور</button>
            <p id="reset-auth-message" className="min-h-4 m-[8px_0_4px] text-[12px] font-bold" aria-live="polite"></p>
          </div>
        </form>
      )}
    </>
  );
}

export default AuthModals;
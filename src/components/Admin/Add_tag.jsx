import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Add_tag() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagsList, setTagsList] = useState([]);

  useEffect(() => {
    fetch("/api/check_user_auth.php", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated || !data.user || data.user.can_add_article != 1) {
          window.location.href = "/";
        }
      });
    fetchTagsList();
  }, []);

  async function fetchTagsList() {
    try {
      const response = await fetch("/api/get_tags.php");
      const data = await response.json();
      if (data.success && data.tags) {
        setTagsList(data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }

  async function saveTag() {
    if (!name || !slug) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);

    try {
      const response = await fetch("/api/add_tag.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
      if (data.success) {
        setName("");
        setSlug("");
        fetchTagsList();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    }
  }

  async function deleteTag(tagId) {
    if (!confirm("هل أنت متأكد من حذف هذا الوسم؟ سيتم فك ارتباطه بجميع المقالات أيضاً.")) {
      return;
    }

    const formData = new FormData();
    formData.append("tag_id", tagId);

    try {
      const response = await fetch("/api/delete_tag.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert("تم الحذف بنجاح");
        fetchTagsList();
      } else {
        alert("فشل الحذف: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    }
  }

  return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">
        <aside className="hidden lg:block w-62.5 shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <h3 className="text-primary text-lg font-bold mb-5">القائمة</h3>
          <ul className="flex flex-col gap-2.5 p-0 m-0 list-none">
            <li>
              <Link
                to="/admin"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                الرجوع
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add-tag"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                إضافة الوسوم
              </Link>
            </li>
          </ul>
        </aside>

        <form className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <h2 className="text-primary text-2xl font-bold mb-6.25">اضافة تاجات جديدة</h2>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">اسم التاج:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسم التاج هنا..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
            <label className="block mb-2 font-bold text-primary">اسم التاج بالانجليزي:</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="أدخل اسم التاج بالانجليزي..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          <button
            className="bg-accent text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-accent-dark"
            onClick={saveTag}
          >
            اضافة
          </button>

          <div className="mt-12.5">
            <h3 className="text-primary text-lg font-bold mb-5">الوسوم المضافة حالياً</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">ID</th>
                    <th className="p-3 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">اسم التاج</th>
                    <th className="p-3 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {tagsList.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-3 text-center">
                        جاري تحميل الوسوم...
                      </td>
                    </tr>
                  ) : (
                    tagsList.map((tag) => (
                      <tr key={tag.id}>
                        <td className="p-3 border-b border-gray-100">{tag.id}</td>
                        <td className="p-3 border-b border-gray-100">{tag.name}</td>
                        <td className="p-3 border-b border-gray-100 text-center">
                          <button
                            className="bg-accent text-white border-none py-1.5 px-3 rounded cursor-pointer transition-colors duration-300 hover:bg-accent-dark"
                            onClick={() => deleteTag(tag.id)}
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Link
            to="/"
            className="inline-block mt-6 py-2.5 px-5 bg-primary text-white no-underline rounded-lg font-bold text-center transition-colors duration-300 hover:bg-[#1a3d63] hover:text-white"
          >
            الرجوع للموقع
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Add_tag;
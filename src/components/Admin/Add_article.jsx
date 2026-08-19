import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function Add_article() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("0");
  const [content, setContent] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [innerImage, setInnerImage] = useState(null);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [allTagsMap, setAllTagsMap] = useState({});
  const [tagSuggestions, setTagSuggestions] = useState([]);

  const [saving, setSaving] = useState(false);

  /*
  ==========================================
  Quill
  ==========================================
  */

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: ["right", "center", "left", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["blockquote", "code-block"],
      [{ direction: "rtl" }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "link",
    "image",
    "blockquote",
    "code-block",
    "direction",
  ];

  /*
  ==========================================
  عند تحميل الصفحة
  ==========================================
  */

  useEffect(() => {
  checkAuth();
  fetchTagsSuggestions();
}, []);

async function checkAuth() {
  try {
    const response = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    console.log("AUTH STATUS:", response.status);
    console.log("AUTH RESPONSE:", data);

    if (!response.ok) {
      console.log("المستخدم غير مسجل دخول");
      return;
    }

    console.log("USER:", data);

  } catch (error) {
    console.error("Auth error:", error);
  }
}

  /*
  ==========================================
  جلب التاجات
  ==========================================
  */

async function fetchTagsSuggestions() {
  try {
    const response = await fetch(
      "/api/tags",
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    console.log("TAGS:", data);

    if (response.ok && Array.isArray(data)) {
      setTagSuggestions(data.map((tag) => tag.name));

      const map = {};

      data.forEach((tag) => {
        map[tag.name] = tag.id;
      });

      setAllTagsMap(map);
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
}

  /*
  ==========================================
  إضافة Tag
  ==========================================
  */

  function addTag(name) {
    const trimmed = name.trim();

    if (
      trimmed &&
      !tags.includes(trimmed)
    ) {
      setTags((prev) => [
        ...prev,
        trimmed,
      ]);
    }
  }

  /*
  ==========================================
  حذف Tag
  ==========================================
  */

  function removeTag(name) {
    setTags((prev) =>
      prev.filter(
        (tag) => tag !== name
      )
    );
  }

  /*
  ==========================================
  Enter في حقل Tags
  ==========================================
  */

  function handleTagKeyDown(e) {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    const values = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    values.forEach((tag) => {
      addTag(tag);
    });

    setTagInput("");
  }

  /*
  ==========================================
  الحصول على IDs الخاصة بالتاجات
  ==========================================
  */

  function getTagIds() {
    return tags
      .map(
        (name) => allTagsMap[name]
      )
      .filter(
        (id) => id !== undefined
      );
  }

  /*
  ==========================================
  إضافة المقال
  ==========================================
  */

async function saveArticle(e) {
  e.preventDefault();

  if (saving) return;

  if (!title.trim()) {
    alert("يرجى كتابة عنوان المقال");
    return;
  }

  if (!slug.trim()) {
    alert("يرجى كتابة الاسم الإنجليزي (Slug)");
    return;
  }

  if (!content.trim() || content === "<p><br></p>") {
    alert("يرجى كتابة محتوى المقال");
    return;
  }

  if (!coverImage) {
    alert("يرجى اختيار صورة الغلاف");
    return;
  }

  if (!innerImage) {
    alert("يرجى اختيار الصورة الداخلية");
    return;
  }

  try {
    setSaving(true);

    // ==========================================
    // 1. الحصول على CSRF Cookie
    // ==========================================

    const csrfResponse = await fetch(
      "/sanctum/csrf-cookie",
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log("CSRF STATUS:", csrfResponse.status);
    console.log("COOKIES:", document.cookie);

    // ==========================================
    // 2. قراءة XSRF-TOKEN
    // ==========================================

    const xsrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));

    if (!xsrfCookie) {
      alert("لم يتم الحصول على XSRF-TOKEN");
      return;
    }

    const xsrfToken = decodeURIComponent(
      xsrfCookie.substring("XSRF-TOKEN=".length)
    );

    console.log("XSRF TOKEN:", xsrfToken);

    // ==========================================
    // 3. تجهيز FormData
    // ==========================================

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("slug", slug.trim());
    formData.append("content", content);
    formData.append("type", type);

    formData.append("cover_image", coverImage);
    formData.append("inner_image", innerImage);

    // tags[]
    const tagIds = getTagIds();

    tagIds.forEach((tagId) => {
      formData.append("tags[]", tagId);
    });

    // ==========================================
    // 4. إرسال المقال
    // ==========================================

    const response = await fetch(
      "/api/articles",
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        body: formData,
      }
    );

    console.log("ARTICLE STATUS:", response.status);

    const data = await response.json();

    console.log("ARTICLE RESPONSE:", data);

    if (!response.ok) {
      alert(data.message || "فشل إنشاء المقال");
      return;
    }

    alert("تم إنشاء المقال بنجاح");

    navigate("/admin");

  } catch (error) {
    console.error("ADD ARTICLE ERROR:", error);
    alert("حدث خطأ في الاتصال بالسيرفر");
  } finally {
    setSaving(false);
  }
}
  /*
  ==========================================
  JSX
  ==========================================
  */

  return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">

      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">

        {/* القائمة */}

        <aside className="hidden lg:block w-62.5 shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">

          <h3 className="text-primary text-lg font-bold mb-5">
            القائمة
          </h3>

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
                to="/admin/add-article"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                إضافة مقال
              </Link>
            </li>

          </ul>

        </aside>

        {/* النموذج */}

        <form
          onSubmit={saveArticle}
          className="flex-1 w-full bg-white p-6 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
        >

          {/* النوع */}

          <div className="mb-5">

            <label className="block mb-2 font-bold text-primary">
              نوع المقال (مكان النشر):
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            >

              <option value="0">
                محتويات علمية
              </option>

              <option value="1">
                مقالات الخبراء
              </option>

              <option value="2">
                مقالات المجلة
              </option>

            </select>

          </div>

          <h2 className="text-primary text-2xl font-bold mb-6.25">
            كتابة مقال جديد
          </h2>

          {/* العنوان */}

          <div className="mb-5">

            <label className="block mb-2 font-bold text-primary">
              عنوان المقال:
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="أدخل عنوان المقال هنا..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />

            <label className="block mb-2 font-bold text-primary">
              المقال باللغة الانجليزية:
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value)
              }
              placeholder="أدخل اسم المقال بالانجليزي..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />

          </div>

          {/* الصور */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            <div>

              <label className="block mb-2 font-bold text-primary">
                صورة الواجهة (الغلاف):
              </label>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) =>
                  setCoverImage(
                    e.target.files[0]
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />

            </div>

            <div>

              <label className="block mb-2 font-bold text-primary">
                الصورة الداخلية:
              </label>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) =>
                  setInnerImage(
                    e.target.files[0]
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />

            </div>

          </div>

          {/* Tags */}

          <div className="mb-5">

            <label className="block mb-2 font-bold text-primary">
              الوسوم (Tags):
            </label>

            <input
              type="text"
              value={tagInput}
              onChange={(e) =>
                setTagInput(
                  e.target.value
                )
              }
              onKeyDown={
                handleTagKeyDown
              }
              list="tags-hints"
              placeholder="اكتب التاج واضغط Enter..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />

            <datalist id="tags-hints">

              {tagSuggestions.map(
                (tag) => (
                  <option
                    key={tag}
                    value={tag}
                  />
                )
              )}

            </datalist>

            <div className="flex flex-wrap gap-2 mt-2.5 mb-5">

              {tags.map((tag) => (

                <span
                  key={tag}
                  className="bg-primary text-white py-1 px-3 rounded-full text-[13px] flex items-center gap-2"
                >

                  {tag}

                  <button
                    type="button"
                    className="font-bold text-base leading-none"
                    onClick={() =>
                      removeTag(tag)
                    }
                  >
                    &times;
                  </button>

                </span>

              ))}

            </div>

          </div>

          {/* المحتوى */}

          <div className="mb-5">

            <label className="block mb-2 font-bold text-primary">
              محتوى المقال:
            </label>

            <div
              style={{
                direction: "rtl",
                textAlign: "right",
              }}
            >

              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="اكتب محتوى المقال هنا..."
                style={{
                  height: "400px",
                  marginBottom: "50px",
                }}
              />

            </div>

          </div>

          {/* الأزرار */}

          <div className="flex flex-col sm:flex-row gap-3 items-center">

            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? "جاري الحفظ..."
                : "حفظ ونشر المقال"}
            </button>

            <Link
              to="/"
              className="inline-block py-2.5 px-5 bg-primary text-white no-underline rounded-lg font-bold text-center transition-colors duration-300 hover:bg-[#1a3d63] hover:text-white"
            >
              الرجوع للموقع
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Add_article;
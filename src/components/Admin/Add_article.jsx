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

  // Quill toolbar modules
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
    "bold", "italic", "underline", "strike",
    "color", "background",
    "align",
    "list", "bullet",
    "link", "image",
    "blockquote", "code-block",
    "direction",
  ];

  useEffect(() => {
    // Check auth
    fetch("/api/check_user_auth.php", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated || !data.user || data.user.can_add_article != 1) {
          window.location.href = "/";
        }
      });

    // Fetch tags
    fetchTagsSuggestions();
  }, []);

  async function fetchTagsSuggestions() {
    try {
      const response = await fetch("/api/get_tags.php");
      const data = await response.json();
      if (data.success && Array.isArray(data.tags)) {
        setTagSuggestions(data.tags.map((t) => t.name));
        const map = {};
        data.tags.forEach((t) => (map[t.name] = t.id));
        setAllTagsMap(map);
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  }

  function addTag(name) {
    const trimmed = name.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
  }

  function removeTag(name) {
    setTags(tags.filter((t) => t !== name));
  } 

  function handleTagKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const vals = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");
      vals.forEach((v) => addTag(v));
      setTagInput("");
    }
  }

  function getTagIds() {
    return tags
      .map((name) => allTagsMap[name])
      .filter((id) => id != null);
  }

  async function saveArticle() {
    // Process any remaining tag input
    if (tagInput.trim()) {
      const vals = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");
      vals.forEach((v) => addTag(v));
      setTagInput("");
    }

    let finalContent = content;

    if (!title) {
      alert("يرجى كتابة عنوان المقال");
      return;
    }
    if (!slug) {
      alert("يرجى كتابة الاسم الإنجليزي (Slug)");
      return;
    }

    // Strip HTML tags and check if there's actual text content
    if (!finalContent.trim()) {
      alert("يرجى كتابة محتوى المقال في المحرر");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", finalContent);
    formData.append("type", type);
    formData.append("tags", JSON.stringify(getTagIds()));

    if (coverImage) formData.append("cover_image", coverImage);
    if (innerImage) formData.append("inner_image", innerImage);

    try {
      const res = await fetch("/api/add_article.php", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ: قد يكون حجم الصورة كبيراً جداً أو هناك مشكلة في الاتصال بالسيرفر");
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
                to="/admin/add-article"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                إضافة مقال
              </Link>
            </li>
          </ul>
        </aside>

        <form className="flex-1 w-full bg-white p-6 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">نوع المقال (مكان النشر):</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            >
              <option value="0">محتويات علمية</option>
              <option value="1">مقالات الخبراء</option>
              <option value="2">مقالات المجلة</option>
            </select>
          </div>

          <h2 className="text-primary text-2xl font-bold mb-6.25">كتابة مقال جديد</h2>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">عنوان المقال:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان المقال هنا..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
            <label className="block mb-2 font-bold text-primary">المقال باللغة الانجليزية:</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="أدخل اسم المقال بالانجليزي..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-bold text-primary">صورة الواجهة (الغلاف):</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold text-primary">الصورة الداخلية:</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setInnerImage(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">الوسوم (Tags):</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              list="tags-hints"
              placeholder="اكتب التاج واضغط Enter..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
            <datalist id="tags-hints">
              {tagSuggestions.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-2 mt-2.5 mb-5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary text-white py-1 px-3 rounded-full text-[13px] flex items-center gap-2"
                >
                  {tag}
                  <span
                    className="cursor-pointer font-bold text-base leading-none"
                    onClick={() => removeTag(tag)}
                  >
                    &times;
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">محتوى المقال:</label>
            <div style={{ direction: "rtl", textAlign: "right" }}>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="اكتب محتوى المقال هنا..."
                style={{ height: "400px", marginBottom: "50px" }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              className="bg-accent text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-accent-dark"
              onClick={saveArticle}
            >
              حفظ ونشر المقال
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
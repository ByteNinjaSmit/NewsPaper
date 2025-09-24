import React, { useState } from "react";
import "./AdminPanel.css";
import axios from "axios";
import { useAuth } from "./store/auth";

export default function AdminPanel({ onLogout }) {
    const [activeTab, setActiveTab] = useState("insert");
    const [editions, setEditions] = useState([]);
    const [form, setForm] = useState({
        date: "",
        title: "",
        pages: [],
        pdf: null,
        special: false
    });
    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { API } = useAuth();

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    // -------- INSERT --------
    // -------- INSERT --------
    const handleInsert = async (e) => {
        e.preventDefault();

        if (!form.date) return alert("Please select a date.");
        if (!form.pdf) return alert("A PDF file is required."); // backend requires PDF

        try {
            setIsProcessing(true);

            // Create FormData
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("date", form.date);
            formData.append("isSpecialEdition", form.special);

            // Append PDF
            if (form.pdf) {
                formData.append("files", form.pdf);
            }

            // Append pages (images)
            if (form.pages.length > 0) {
                form.pages.forEach((file) => {
                    formData.append("files", file);
                });
            }

            // Send request to backend
            const res = await axios.post(`${API}/api/upload/new`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Upload Response:", res.data);

            // Update local state with response data
            const savedEdition = res.data.data;

            const newEdition = {
                id: savedEdition._id,
                date: savedEdition.date,
                title: savedEdition.title,
                pages: savedEdition.pages.map(p => `${API}/${p}`), // backend gives file paths
                pdf: `${API}/${savedEdition.pdfFile}`,
                special: savedEdition.isSpecialEdition
            };

            setEditions(prev => [newEdition, ...prev]);

            setForm({ date: "", title: "", pages: [], pdf: null, special: false });
            showMessage("Edition inserted ✅");
            setActiveTab("update");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Upload failed");
        } finally {
            setIsProcessing(false);
        }
    };


    // -------- UPDATE --------
    const handleSelectDateForUpdate = (dateValue) => {
        const existing = editions.find(ed => ed.date === dateValue);
        if (existing) {
            setForm({
                date: dateValue,
                title: existing.title,
                pages: existing.pages.map(url => ({ file: null, url })),
                pdf: existing.pdf ? { file: null, url: existing.pdf } : null,
                special: existing.special
            });
        } else {
            setForm({ date: dateValue, title: "", pages: [], pdf: null, special: false });
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!form.date) return alert("Select date to update.");
        setIsProcessing(true);

        const pagesUrls = form.pages.map(p => p.file ? URL.createObjectURL(p.file) : p.url);
        const pdfUrl = form.pdf ? (form.pdf.file ? URL.createObjectURL(form.pdf.file) : form.pdf.url) : null;

        setEditions(prev =>
            prev.map(ed =>
                ed.date === form.date
                    ? { ...ed, title: form.title, pages: pagesUrls, pdf: pdfUrl, special: form.special }
                    : ed
            )
        );

        setForm({ date: "", title: "", pages: [], pdf: null, special: false });
        showMessage("Edition updated ✏");
        setActiveTab("update");
        setIsProcessing(false);
    };

    // -------- DELETE EDITION --------
    const handleDeleteEdition = (date) => {
        if (!window.confirm("Delete this edition entirely?")) return;
        setEditions(prev => prev.filter(ed => ed.date !== date));
        showMessage("Edition deleted 🗑");
    };

    // -------- PAGE/ PDF REMOVE & REPLACE --------
    const handlePageChange = (index, file) => {
        const updated = [...form.pages];
        updated[index] = { file, url: URL.createObjectURL(file) };
        setForm({ ...form, pages: updated });
    };

    const removePage = (index) => {
        const updated = [...form.pages];
        updated.splice(index, 1);
        setForm({ ...form, pages: updated });
    };

    const handlePdfChange = (file) => {
        setForm({ ...form, pdf: { file, url: URL.createObjectURL(file) } });
    };

    const removePdf = () => {
        setForm({ ...form, pdf: null });
    };

    return (
        <div className="admin-root">
            <aside className="admin-sidebar">
                <div className="admin-brand"><h3>PharmaCare Admin</h3></div>
                {["insert", "update", "delete"].map(tab => (
                    <button
                        key={tab}
                        className={activeTab === tab ? "nav-item active" : "nav-item"}
                        onClick={() => setActiveTab(tab)}
                        disabled={isProcessing}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
                <button
                    className="btn-logout"
                    onClick={() => {
                        onLogout && onLogout(); // optional parent logout logic
                        window.location.href = "/"; // redirect to main website
                    }}
                    disabled={isProcessing}
                >
                    Logout
                </button>
            </aside>

            <main className="admin-main">
                <header>
                    <h1>📰 Admin Panel</h1>
                    <div>{message || "Manage editions"}</div>
                </header>

                <section className="table-section">

                    {/* INSERT */}
                    {activeTab === "insert" && (
                        <form onSubmit={handleInsert} className="form-card">
                            <label>Date</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                            <label>Title</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            <label>Upload Pages</label>
                            <input type="file" multiple accept="image/*"
                                onChange={e => setForm({ ...form, pages: Array.from(e.target.files) })} />
                            <label>Upload PDF</label>
                            <input type="file" accept="application/pdf"
                                onChange={e => setForm({ ...form, pdf: e.target.files[0] })} />                            <label>
                                <input type="checkbox" checked={form.special} onChange={e => setForm({ ...form, special: e.target.checked })} /> Special Edition
                            </label>
                            <button type="submit" className="btn">{isProcessing ? "Processing..." : "Insert Edition"}</button>
                        </form>
                    )}

                    {/* UPDATE */}
                    {activeTab === "update" && (
                        <form onSubmit={handleUpdate} className="form-card">
                            <label>Select Date to Update</label>
                            <input type="date" value={form.date} onChange={e => handleSelectDateForUpdate(e.target.value)} required />
                            {form.date && (
                                <>
                                    <label>Title</label>
                                    <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />

                                    <label>Pages</label>
                                    {form.pages.map((p, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
                                            <img src={p.url} width="80px" height="80px" style={{ objectFit: "cover" }} />
                                            <input type="file" accept="image/*" onChange={e => handlePageChange(i, e.target.files[0])} />
                                            <button type="button" onClick={() => removePage(i)} className="btn small danger">Remove</button>
                                        </div>
                                    ))}

                                    <label>Upload New Pages</label>
                                    <input type="file" multiple accept="image/*" onChange={e => setForm({ ...form, pages: [...form.pages, ...Array.from(e.target.files).map(f => ({ file: f, url: URL.createObjectURL(f) }))] })} />

                                    <label>PDF</label>
                                    {form.pdf && (
                                        <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
                                            <embed src={form.pdf.url} width="100px" height="80px" />
                                            <input type="file" accept="application/pdf" onChange={e => handlePdfChange(e.target.files[0])} />
                                            <button type="button" onClick={removePdf} className="btn small danger">Remove</button>
                                        </div>
                                    )}
                                    {!form.pdf && <input type="file" accept="application/pdf" onChange={e => handlePdfChange(e.target.files[0])} />}

                                    <label>
                                        <input type="checkbox" checked={form.special} onChange={e => setForm({ ...form, special: e.target.checked })} /> Special Edition
                                    </label>
                                    <button type="submit" className="btn">{isProcessing ? "Processing..." : "Update Edition"}</button>
                                </>
                            )}
                        </form>
                    )}

                    {/* DELETE */}
                    {activeTab === "delete" && (
                        <div className="view-section">
                            {editions.length === 0 ? <p>No editions to delete.</p> :
                                editions.map(ed => (
                                    <div key={ed.date} className="edition-card">
                                        <h3>{ed.date} — {ed.title} {ed.special && "⭐"}</h3>
                                        <button className="btn danger" onClick={() => handleDeleteEdition(ed.date)}>Delete Edition</button>
                                    </div>
                                ))}
                        </div>
                    )}

                </section>
            </main>
        </div>
    );
}

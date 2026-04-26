"use client";

import { useState, useEffect } from "react";
import { Save, Lock, Unlock, Mail, Briefcase, Code, User, GraduationCap, Plus, Trash2, Image as ImageIcon, ChevronRight, LayoutDashboard, Settings } from "lucide-react";

export default function AdminCMS() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [portfolioData, setPortfolioData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    // New state for premium sidebar navigation
    const [activeTab, setActiveTab] = useState("hero");

    const CMS_SECRET = "mibinAdmin2026";

    useEffect(() => {
        fetch('/api/cms')
            .then(res => res.json())
            .then(data => {
                setPortfolioData(data);
                setLoading(false);
            });
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CMS_SECRET) {
            setIsAuthenticated(true);
        } else {
            setMessage("Invalid Password");
        }
    };

    const saveChanges = async () => {
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch('/api/cms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CMS_SECRET}`
                },
                body: JSON.stringify(portfolioData)
            });

            const result = await res.json();
            if (result.success) {
                setMessage("Changes Published Live!");
                setTimeout(() => setMessage(""), 4000);
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (err) {
            setMessage("Failed to save. Check connection.");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingImage(true);
        setMessage("Uploading to server...");

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${CMS_SECRET}` },
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                setMessage("Profile Image Overwritten!");
            } else {
                setMessage("Failed to upload image.");
            }
        } catch (error) {
            setMessage("Error uploading image");
        } finally {
            setUploadingImage(false);
            setTimeout(() => setMessage(""), 4000);
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)', color: 'var(--text-primary)', gap: '1rem' }}>
                <div className="spinner" style={{ border: '3px solid var(--glass-border-dark)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <div style={{ fontWeight: 500, letterSpacing: '1px' }}>INITIALIZING ENGINE</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'var(--text-primary)', padding: '1rem' }}>
                <form onSubmit={handleLogin} style={{
                    background: 'var(--glass-bg)', padding: '3.5rem 3rem', borderRadius: '32px', backdropFilter: 'blur(50px)', border: '1px solid var(--glass-border-light)',
                    display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent-primary)', filter: 'blur(80px)', opacity: 0.3, zIndex: 0 }}></div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ background: 'var(--glass-border-dark)', padding: '1.2rem', borderRadius: '50%' }}>
                                <Lock size={32} color="var(--text-primary)" />
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Terminal Access</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Enter root credentials</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="password"
                                placeholder="Password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--glass-border-light)', background: 'transparent', color: 'var(--text-primary)', fontSize: '1.1rem', outline: 'none', transition: 'border-color 0.3s' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border-light)'}
                            />
                            {message && <div style={{ color: '#ff4d4f', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500 }}>{message}</div>}
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', fontSize: '1.1rem' }}>Authenticate</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    const handleUpdate = (section: string, field: string, value: string) => {
        setPortfolioData((prev: any) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    };

    const handleArrayItemUpdate = (section: string, index: number, field: string, value: any) => {
        const updatedArray = [...portfolioData[section]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        setPortfolioData((prev: any) => ({ ...prev, [section]: updatedArray }));
    };

    const addArrayItem = (section: string, defaultObject: any) => {
        setPortfolioData((prev: any) => ({ ...prev, [section]: [...prev[section], { id: Date.now().toString(), ...defaultObject }] }));
    };

    const removeArrayItem = (section: string, index: number) => {
        const updatedArray = [...portfolioData[section]];
        updatedArray.splice(index, 1);
        setPortfolioData((prev: any) => ({ ...prev, [section]: updatedArray }));
    };

    const inputStyle = { width: '100%', padding: '1.1rem', borderRadius: '12px', border: '1px solid var(--glass-border-dark)', background: 'var(--glass-bg)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', transition: 'all 0.3s' };
    const labelStyle = { display: 'block', marginBottom: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' as const };

    const navTabs = [
        { id: 'hero', icon: User, label: 'Hero Overview' },
        { id: 'about', icon: LayoutDashboard, label: 'About Text' },
        { id: 'experience', icon: Briefcase, label: 'Work Experience' },
        { id: 'education', icon: GraduationCap, label: 'Education' },
        { id: 'skills', icon: Code, label: 'Expertise & Skills' },
        { id: 'contact', icon: Mail, label: 'Contact Details' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>

            {/* Top Navigation Bar / Master Controls */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 100, background: 'var(--nav-bg)', backdropFilter: 'blur(40px)',
                borderBottom: '1px solid var(--glass-border-dark)', padding: '1rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px', background: 'var(--text-primary)', color: 'var(--bg-color)', borderRadius: '8px' }}>
                        <Settings size={18} />
                    </div>
                    Engine CMS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 500, color: message.includes('Error') || message.includes('Failed') ? '#ff4d4f' : '#34C759', opacity: message ? 1 : 0, transition: 'opacity 0.3s', transform: message ? 'translateY(0)' : 'translateY(-10px)' }}>
                        {message}
                    </span>
                    <button onClick={saveChanges} disabled={saving} className="btn" style={{
                        padding: '0.7rem 1.5rem', background: saving ? 'var(--glass-border-dark)' : 'var(--text-primary)',
                        color: 'var(--bg-color)', borderRadius: '99px', display: 'flex', gap: '0.5rem', fontWeight: 600, border: 'none'
                    }}>
                        <Save size={18} /> {saving ? "Syncing..." : "Publish Live"}
                    </button>
                </div>
            </div>

            {/* Split View Architecture */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Dedicated Sidebar */}
                <aside style={{
                    width: '280px', borderRight: '1px solid var(--glass-border-dark)', padding: '2rem 1.5rem',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto'
                }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '1rem', paddingLeft: '1rem' }}>MODULES</div>
                    {navTabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '1rem',
                                    borderRadius: '16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                                    background: isActive ? 'var(--glass-border-dark)' : 'transparent',
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: isActive ? 600 : 500, fontSize: '0.95rem' }}>
                                    <Icon size={18} color={isActive ? "var(--text-primary)" : "var(--text-secondary)"} />
                                    {tab.label}
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </button>
                        )
                    })}
                </aside>

                {/* Main Content Viewport */}
                <main style={{ flex: 1, padding: '3rem 5%', overflowY: 'auto', background: 'radial-gradient(circle at top right, var(--glass-border-dark) 0%, transparent 40%)' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '6rem' }}>

                        {/* HERO PANEL */}
                        {activeTab === 'hero' && (
                            <section className="animate-on-scroll visible" style={{ animation: 'fadeUp 0.4s ease-out' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                                    <div>
                                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px', marginBottom: '0.5rem' }}>Hero Overview</h1>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage the first impression block of your portfolio.</p>
                                    </div>
                                    <label className="btn btn-glass" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }}>
                                        <ImageIcon size={18} /> {uploadingImage ? "Uploading..." : "Upload Avatar"}
                                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                                    </label>
                                </div>
                                <div style={{ background: 'var(--glass-bg)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--glass-border-dark)', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr)', gap: '2rem' }}>
                                    <div>
                                        <label style={labelStyle}>Top Badge Status</label>
                                        <input type="text" value={portfolioData.hero.greeting} onChange={(e) => handleUpdate('hero', 'greeting', e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--glass-border-dark)'} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={labelStyle}>Display Title</label>
                                            <input type="text" value={portfolioData.hero.title} onChange={(e) => handleUpdate('hero', 'title', e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--glass-border-dark)'} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Main Subtitle</label>
                                            <input type="text" value={portfolioData.hero.subtitle} onChange={(e) => handleUpdate('hero', 'subtitle', e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--glass-border-dark)'} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Introduction Statement</label>
                                        <textarea rows={4} value={portfolioData.hero.description} onChange={(e) => handleUpdate('hero', 'description', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--glass-border-dark)'} />
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ABOUT PANEL */}
                        {activeTab === 'about' && (
                            <section className="animate-on-scroll visible" style={{ animation: 'fadeUp 0.4s ease-out' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px', marginBottom: '0.5rem' }}>About Structure</h1>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Your detailed professional summary broken into paragraphs.</p>
                                </div>
                                <div style={{ background: 'var(--glass-bg)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--glass-border-dark)', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                                    <div><label style={labelStyle}>Opening Paragraph</label><textarea rows={3} value={portfolioData.about.text1} onChange={(e) => handleUpdate('about', 'text1', e.target.value)} style={inputStyle} /></div>
                                    <div><label style={labelStyle}>Focus Paragraph</label><textarea rows={3} value={portfolioData.about.text2} onChange={(e) => handleUpdate('about', 'text2', e.target.value)} style={inputStyle} /></div>
                                    <div><label style={labelStyle}>Closing Paragraph</label><textarea rows={3} value={portfolioData.about.text3} onChange={(e) => handleUpdate('about', 'text3', e.target.value)} style={inputStyle} /></div>
                                </div>
                            </section>
                        )}

                        {/* EXPERIENCE PANEL */}
                        {activeTab === 'experience' && (
                            <section className="animate-on-scroll visible" style={{ animation: 'fadeUp 0.4s ease-out' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                                    <div>
                                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px', marginBottom: '0.5rem' }}>Work Log</h1>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Curate your career trajectory and achievements.</p>
                                    </div>
                                    <button onClick={() => addArrayItem('experience', { title: "New Job", company: "Meta", date: "Jan 2026 - Present", points: ["I did things"] })} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', borderRadius: '12px', display: 'flex', gap: '0.5rem' }}>
                                        <Plus size={18} /> Append Role
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {portfolioData.experience.map((exp: any, index: number) => (
                                        <div key={exp.id || index} style={{ background: 'var(--glass-bg)', padding: '2.5rem', border: '1px solid var(--glass-border-dark)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--text-primary), transparent)', opacity: 0.5 }}></div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', marginTop: '-1rem', marginRight: '-1rem' }}>
                                                <button onClick={() => removeArrayItem('experience', index)} style={{ background: 'var(--glass-border-dark)', border: 'none', color: '#ff4d4f', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}><Trash2 size={18} /></button>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                                <div><label style={labelStyle}>Role</label><input type="text" value={exp.title} onChange={(e) => handleArrayItemUpdate('experience', index, 'title', e.target.value)} style={inputStyle} /></div>
                                                <div><label style={labelStyle}>Company / Org</label><input type="text" value={exp.company} onChange={(e) => handleArrayItemUpdate('experience', index, 'company', e.target.value)} style={inputStyle} /></div>
                                                <div><label style={labelStyle}>Timeline</label><input type="text" value={exp.date} onChange={(e) => handleArrayItemUpdate('experience', index, 'date', e.target.value)} style={inputStyle} /></div>
                                            </div>
                                            <div>
                                                <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between' }}><span>Key Deliverables</span> <span style={{ textTransform: 'none', color: 'var(--text-muted)' }}>(Comma Separated)</span></label>
                                                <textarea rows={3} value={exp.points.join(', ')} onChange={(e) => handleArrayItemUpdate('experience', index, 'points', e.target.value.split(',').map(s => s.trim()))} style={inputStyle} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EDUCATION PANEL */}
                        {activeTab === 'education' && (
                            <section className="animate-on-scroll visible" style={{ animation: 'fadeUp 0.4s ease-out' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                                    <div>
                                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px', marginBottom: '0.5rem' }}>Education</h1>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Degrees, certifications, and academic background.</p>
                                    </div>
                                    <button onClick={() => addArrayItem('education', { degree: "New Cert", school: "Institute", details: "" })} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', borderRadius: '12px', display: 'flex', gap: '0.5rem' }}>
                                        <Plus size={18} /> New Entry
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {portfolioData.education.map((edu: any, index: number) => (
                                        <div key={edu.id || index} style={{ background: 'var(--glass-bg)', padding: '2rem', border: '1px solid var(--glass-border-dark)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem', marginRight: '-0.5rem' }}>
                                                <button onClick={() => removeArrayItem('education', index)} style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '0.2rem' }}><Trash2 size={16} /></button>
                                            </div>
                                            <div><label style={labelStyle}>Certification Name</label><input type="text" value={edu.degree} onChange={(e) => handleArrayItemUpdate('education', index, 'degree', e.target.value)} style={inputStyle} /></div>
                                            <div><label style={labelStyle}>Institution</label><input type="text" value={edu.school} onChange={(e) => handleArrayItemUpdate('education', index, 'school', e.target.value)} style={inputStyle} /></div>
                                            <div><label style={labelStyle}>Meta info (year, score)</label><input type="text" value={edu.details} onChange={(e) => handleArrayItemUpdate('education', index, 'details', e.target.value)} style={inputStyle} /></div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SKILLS PANEL */}
                        {activeTab === 'skills' && (
                            <section className="animate-on-scroll visible" style={{ animation: 'fadeUp 0.4s ease-out' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                                    <div>
                                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px', marginBottom: '0.5rem' }}>Core Skills</h1>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Your grouped technical and marketing proficiencies.</p>
                                    </div>
                                    <button onClick={() => addArrayItem('skills', { category: "Language", icon: "Code", items: ["English"] })} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', borderRadius: '12px', display: 'flex', gap: '0.5rem' }}>
                                        <Plus size={18} /> New Grid Block
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                                    {portfolioData.skills.map((skill: any, index: number) => (
                                        <div key={skill.id || index} style={{ background: 'var(--glass-bg)', padding: '2rem', border: '1px solid var(--glass-border-dark)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                                <div style={{ flex: 1 }}><label style={labelStyle}>Classification Group</label><input type="text" value={skill.category} onChange={(e) => handleArrayItemUpdate('skills', index, 'category', e.target.value)} style={{ ...inputStyle, fontWeight: 600 }} /></div>
                                                <button onClick={() => removeArrayItem('skills', index)} style={{ background: 'var(--glass-border-dark)', padding: '0.9rem', borderRadius: '12px', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}><Trash2 size={20} /></button>
                                            </div>
                                            <div>
                                                <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between' }}><span>Tech Stack Targets</span> <span style={{ textTransform: 'none', color: 'var(--text-muted)' }}>(Comma Separated)</span></label>
                                                <textarea rows={3} value={skill.items.join(', ')} onChange={(e) => handleArrayItemUpdate('skills', index, 'items', e.target.value.split(',').map(s => s.trim()))} style={inputStyle} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CONTACT PANEL */}
                        {activeTab === 'contact' && (
                            <section className="animate-on-scroll visible" style={{ animation: 'fadeUp 0.4s ease-out' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px', marginBottom: '0.5rem' }}>Contact Gateways</h1>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>How potential connections can reach you globally.</p>
                                </div>
                                <div style={{ background: 'var(--glass-bg)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--glass-border-dark)', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr)', gap: '2rem' }}>
                                    <div><label style={labelStyle}>Pitch Description</label><textarea value={portfolioData.contact.description} onChange={(e) => handleUpdate('contact', 'description', e.target.value)} rows={3} style={inputStyle} /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div><label style={labelStyle}>Primary Email</label><input type="email" value={portfolioData.contact.email} onChange={(e) => handleUpdate('contact', 'email', e.target.value)} style={inputStyle} /></div>
                                        <div><label style={labelStyle}>LinkedIn URI</label><input type="text" value={portfolioData.contact.linkedin} onChange={(e) => handleUpdate('contact', 'linkedin', e.target.value)} style={inputStyle} /></div>
                                    </div>
                                    <div><label style={labelStyle}>Github / Code URI</label><input type="text" value={portfolioData.contact.github} onChange={(e) => handleUpdate('contact', 'github', e.target.value)} style={inputStyle} /></div>
                                </div>
                            </section>
                        )}

                    </div>
                </main>
            </div>
            {/* Global Keyframes for rendering animations */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @media (max-width: 900px) {
                    aside { display: none !important; }
                    main { padding: 2rem 5% !important; background: var(--bg-color) !important; }
                }
            `}</style>

            {/* Mobile Tab Scroller (Only shows on mobile) */}
            <div className="mobile-tabs" style={{
                display: 'none', position: 'fixed', bottom: 0, left: 0, width: '100%',
                background: 'var(--nav-bg)', backdropFilter: 'blur(30px)', borderTop: '1px solid var(--glass-border-dark)',
                padding: '0.5rem', zIndex: 900, overflowX: 'auto', WebkitOverflowScrolling: 'touch'
            }}>
                <div style={{ display: 'flex', gap: '0.5rem', minWidth: 'min-content', padding: '0 0.5rem' }}>
                    {navTabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem',
                                borderRadius: '99px', border: 'none', background: isActive ? 'var(--text-primary)' : 'transparent',
                                color: isActive ? 'var(--bg-color)' : 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap'
                            }}>
                                <Icon size={16} /> {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .mobile-tabs { display: block !important; }
                }
            `}</style>
        </div>
    );
}

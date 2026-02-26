"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { Github, Linkedin, Mail, ArrowRight, TrendingUp, Activity, Code, GraduationCap, Award, Menu, X, Sun, Moon, Monitor } from "lucide-react";
import Image from "next/image";

// Map string icons from JSON to Lucide components
const IconMap: Record<string, any> = {
    Monitor: Monitor,
    Code: Code,
    TrendingUp: TrendingUp,
    Activity: Activity,
    GraduationCap: GraduationCap,
    Award: Award,
};

// 3D Tilt Hook for Apple Glass Cards
function useTilt(ref: React.RefObject<HTMLDivElement | null>) {
    useEffect(() => {
        if (!ref.current) return;
        const card = ref.current;

        const handleMouseMove = (e: globalThis.MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

            const innerCard = card.querySelector('.glass-card') as HTMLElement;
            if (innerCard) {
                innerCard.style.setProperty('--x', `${x}px`);
                innerCard.style.setProperty('--y', `${y}px`);
            }
        };

        const handleMouseLeave = () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
            card.style.transition = `transform 0.5s ease-out`;

            setTimeout(() => {
                card.style.transition = `transform 0.1s ease-out`;
            }, 500);
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [ref]);
}

function GlassTiltCard({ children, className = "", delay = "" }: { children: React.ReactNode, className?: string, delay?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    useTilt(ref);

    return (
        <div className={`glass-card-perspective animate-on-scroll ${delay}`} ref={ref}>
            <div className={`glass-card ${className}`}>
                {children}
                <div className="glass-shine"></div>
            </div>
        </div>
    );
}

export default function PortfolioClient({ data }: { data: any }) {
    const [activeSection, setActiveSection] = useState("home");
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved) {
            setTheme(saved);
            document.documentElement.setAttribute('data-theme', saved);
        } else {
            setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section");
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - 300 && window.scrollY < sectionTop + sectionHeight - 300) {
                    setActiveSection(section.getAttribute("id") || "home");
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        document.querySelectorAll(".animate-on-scroll").forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [data]);

    const scrollTo = (id: string) => {
        setMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: "smooth",
            });
        }
    };

    const navItems = ["home", "about", "experience", "skills"];

    return (
        <>
            <div className="ambient-bg">
                <div className="ambient-blob blob-1"></div>
                <div className="ambient-blob blob-2"></div>
                <div className="ambient-blob blob-3"></div>
            </div>

            <nav className="navbar">
                <div className="container">
                    <div className="logo cursor-pointer" onClick={() => scrollTo("home")}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-color)', fontSize: '1.2rem', fontWeight: 600 }}>
                            M
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border-light)',
                                color: 'var(--text-primary)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                        {navItems.map((item) => (
                            <li key={item}>
                                <a
                                    href={`#${item}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollTo(item);
                                    }}
                                    className={`nav-link ${activeSection === item ? "active" : ""}`}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                        <li>
                            <button
                                className="btn btn-primary"
                                style={{ padding: "0.5rem 1.2rem", fontSize: "0.9rem" }}
                                onClick={() => scrollTo("contact")}
                            >
                                Contact
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            <main>
                {/* Intro / Hero Section */}
                <section id="home" className="hero">
                    <div className="container">
                        <div className="hero-content animate-on-scroll">
                            <span className="greeting">{data.hero.greeting}</span>
                            <h1 className="hero-title">{data.hero.title}</h1>
                            <h2 className="hero-subtitle">{data.hero.subtitle}</h2>
                            <p className="hero-desc">{data.hero.description}</p>
                            <div className="btn-group">
                                <button className="btn btn-primary" onClick={() => scrollTo("experience")}>
                                    View Experience <ArrowRight size={18} />
                                </button>
                                <div className="social-links" style={{ marginLeft: '0.5rem' }}>
                                    <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="social-icon">
                                        <Linkedin size={20} />
                                    </a>
                                    <a href={`mailto:${data.contact.email}`} className="social-icon">
                                        <Mail size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about">
                    <div className="container">
                        <h2 className="section-title animate-on-scroll">About Me</h2>
                        <div className="about-grid">
                            <div className="about-text animate-on-scroll">
                                <p dangerouslySetInnerHTML={{ __html: data.about.text1 }}></p>
                                <p dangerouslySetInnerHTML={{ __html: data.about.text2 }}></p>
                                <p dangerouslySetInnerHTML={{ __html: data.about.text3 }}></p>

                                <div className="about-stats">
                                    {data.about.stats.map((stat: any, idx: number) => (
                                        <GlassTiltCard key={idx} className="stat-item" delay={`delay-${(idx + 1) * 100}`}>
                                            <div className="stat-number">{stat.number}</div>
                                            <div className="stat-text">{stat.text}</div>
                                        </GlassTiltCard>
                                    ))}
                                </div>
                            </div>

                            <div className="animate-on-scroll delay-100">
                                <GlassTiltCard className="p-0 border-0" delay="">
                                    <div className="profile-photo-container">
                                        <Image
                                            src={`/img/PROFILE.jpeg?v=${new Date().getTime()}`}
                                            alt={data.hero.title}
                                            fill
                                            className="profile-photo"
                                            unoptimized={true}
                                        />
                                    </div>
                                </GlassTiltCard>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                <section id="experience">
                    <div className="container">
                        <h2 className="section-title animate-on-scroll">Experience & Education</h2>

                        <div className="about-grid" style={{ alignItems: 'start' }}>
                            <div className="experience-grid">
                                {data.experience.map((exp: any, idx: number) => (
                                    <GlassTiltCard key={exp.id} delay={`delay-${(idx + 1) * 100}`}>
                                        <div className="card-header">
                                            <div>
                                                <h3 className="card-title">{exp.title}</h3>
                                                <div className="card-company">{exp.company}</div>
                                            </div>
                                            <div className="card-date">{exp.date}</div>
                                        </div>
                                        <div className="card-body">
                                            <ul>
                                                {exp.points.map((point: string, pIdx: number) => (
                                                    <li key={pIdx}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </GlassTiltCard>
                                ))}
                            </div>

                            <div className="experience-grid">
                                <GlassTiltCard delay="delay-100">
                                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                        <GraduationCap size={24} color="var(--accent-primary)" /> Academics
                                    </h3>
                                    <div style={{ paddingLeft: '0.5rem' }}>
                                        {data.education.map((edu: any) => (
                                            <div key={edu.id} style={{ marginBottom: '1.5rem' }}>
                                                <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem' }}>{edu.degree}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{edu.school}</div>
                                                {edu.details && <span className="card-date" style={{ fontSize: '0.75rem' }}>{edu.details}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </GlassTiltCard>

                                <GlassTiltCard delay="delay-200" className="h-full">
                                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                        <Award size={24} color="var(--accent-primary)" /> Google Digital Academy
                                    </h3>
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '0.5rem' }}>
                                        {data.certifications.map((cert: any) => (
                                            <li key={cert.id}>
                                                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cert.title}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{cert.desc}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </GlassTiltCard>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                <section id="skills">
                    <div className="container">
                        <h2 className="section-title animate-on-scroll">Core Expertise</h2>

                        <div className="skills-grid">
                            {data.skills.map((skillGroup: any, idx: number) => {
                                const IconComponent = IconMap[skillGroup.icon] || Code;
                                return (
                                    <GlassTiltCard key={skillGroup.id} className="skill-category" delay={`delay-${(idx % 2 === 0 ? 1 : 2) * 100}`}>
                                        <h3 className="skill-title"><IconComponent size={24} /> {skillGroup.category}</h3>
                                        <div className="skill-list">
                                            {skillGroup.items.map((item: string, iIdx: number) => (
                                                <span key={iIdx} className="skill-tag">{item}</span>
                                            ))}
                                        </div>
                                    </GlassTiltCard>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" style={{ paddingBottom: '6rem' }}>
                    <div className="container">
                        <GlassTiltCard delay="delay-100" className="contact-container">
                            <h2 className="contact-title">{data.contact.title}</h2>
                            <p className="contact-desc">{data.contact.description}</p>
                            <a href={`mailto:${data.contact.email}`} className="btn btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                                Say Hello
                            </a>

                            <div className="social-links" style={{ marginTop: '2.5rem' }}>
                                <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="social-icon">
                                    <Linkedin size={22} />
                                </a>
                                <a href={data.contact.github} target="_blank" rel="noreferrer" className="social-icon">
                                    <Github size={22} />
                                </a>
                            </div>
                        </GlassTiltCard>
                    </div>
                </section>
            </main>

            <footer>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '1rem', opacity: 0.8, fontSize: '1.2rem', fontWeight: 600 }}>
                        {data.hero.title.split(' ').map((n: string) => n[0]).join('.')}
                    </div>
                    <p>Designed in VisionOS Aesthetic</p>
                </div>
            </footer>
        </>
    );
}

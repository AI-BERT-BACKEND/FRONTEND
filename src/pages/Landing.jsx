import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Star, Check,
  Calendar, Zap, BarChart3, Bell, BookOpen, Clock,
  AlertCircle, Brain, ListOrdered, LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { createStyles } from '../theme/createStyles';
import GridBackground from '../components/GridBackground';
import LogoImg from '../assets/LOGO.png';
import LogoDegradeImg from '../assets/logodegrade.png';
import LandingBg from '../assets/Landing.png';
import AibertGif from '../assets/aibert-logo-sin-negro-corregido.gif';
import LauraImg from '../../doc/imagenes/laura.jpeg';
import NataliaImg from '../../doc/imagenes/Natalia.jpeg';
import MarianaImg from '../../doc/imagenes/Mariana.jpeg';
import IssacImg from '../../doc/imagenes/Issac.png';
import JuanesImg from '../../doc/imagenes/juanes.png';
import CopilotoImg from '../../doc/imagenes/copiloto.png';

const useScrollAnimation = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
};

const AnimatedSection = ({ children, animation = 'fade-up', delay = 0, className = '', style = {} }) => {
  const { ref, isVisible } = useScrollAnimation();
  
  const baseStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0) translateX(0) scale(1)' : 
               animation === 'fade-left' ? 'translateX(-30px)' :
               animation === 'fade-right' ? 'translateX(30px)' :
               animation === 'scale' ? 'scale(0.9)' :
               'translateY(30px)',
    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
    ...style,
  };

  return (
    <div ref={ref} style={baseStyle} className={className}>
      {children}
    </div>
  );
};

/* ── datos ── */
const PROBLEMAS = [
  { id: 1, icon: AlertCircle,     color: '#FF5B2E', titulo: 'Olvidar entregas',    desc: 'Pierdes puntos por olvidar fechas importantes de entrega.' },
  { id: 2, icon: Clock,           color: '#F7306D', titulo: 'Sin tiempo personal', desc: 'El estudio consume todo tu tiempo sin dejar espacio para ti.' },
  { id: 3, icon: LayoutDashboard, color: '#A855F7', titulo: 'Mala gestión',        desc: 'Sin un sistema claro, todo parece urgente al mismo tiempo.', destacada: true },
  { id: 4, icon: Brain,           color: '#FF5B2E', titulo: 'Estrés constante',    desc: 'La presión académica afecta tu bienestar y concentración.' },
  { id: 5, icon: ListOrdered,     color: '#F7306D', titulo: 'Priorización',        desc: 'No sabes qué estudiar primero ni cómo distribuir tu tiempo.' },
];

const BENEFICIOS = [
  { id: 1, icon: Calendar,  color: '#FF5B2E', titulo: 'ORGANIZADOR INTELIGENTE', desc: 'Gestiona tareas, materias y fechas en un solo lugar con recordatorios automáticos.' },
  { id: 2, icon: Zap,       color: '#F7306D', titulo: 'PRIORIZACIÓN CON IA',     desc: 'Algoritmos inteligentes determinan qué debes estudiar primero según tu rendimiento.' },
  { id: 3, icon: BarChart3, color: '#A855F7', titulo: 'SIMULADOR DE NOTAS',      desc: 'Calcula qué nota necesitas en los próximos exámenes para llegar a tu objetivo.' },
  { id: 4, icon: Bell,      color: '#FF5B2E', titulo: 'ALERTAS TEMPRANAS',       desc: 'Detecta riesgos académicos antes de que se conviertan en problemas graves.' },
  { id: 5, icon: BookOpen,  color: '#F7306D', titulo: 'SESIÓN DE ESTUDIO',       desc: 'Sesiones temporizadas con seguimiento de avance y estadísticas de productividad.' },
  { id: 6, icon: Clock,     color: '#A855F7', titulo: 'HORARIO INTELIGENTE',     desc: 'Genera horarios adaptados a tus materias, metas y disponibilidad real.' },
];

const PASOS = [
  { num: '01', titulo: 'Perfil',          desc: 'Crea tu perfil académico con tus materias, horarios y metas personales.' },
  { num: '02', titulo: 'Conoce a ALBERT', desc: 'Conecta con tu asistente inteligente y configura tus preferencias de estudio.' },
  { num: '03', titulo: 'Recomendaciones', desc: 'Recibe sugerencias personalizadas basadas en tu rendimiento y objetivos.' },
  { num: '04', titulo: 'Optimización',    desc: 'Mejora continuamente con análisis detallados de tu progreso académico.' },
];

const TESTIMONIOS = [
  {
    id: 1, nombre: 'Laura Santiago', carrera: 'Ingeniería de Sistemas', semestre: '5to semestre', estrellas: 5,
    cita: '"AI.BERT me ayudó a organizarme antes de los parciales. Subí mi promedio casi un punto en un semestre."',
    foto: LauraImg,
  },
  {
    id: 2, nombre: 'Natalia Mahecha', carrera: 'Ingeniería Estadística', semestre: '3er semestre', estrellas: 5,
    cita: '"Nunca pensé que una app pudiera cambiar tanto mi forma de estudiar. Las alertas tempranas me salvaron en Cálculo."',
    foto: NataliaImg, destacado: true,
  },
  {
    id: 3, nombre: 'Mariana Parra', carrera: 'Ingeniería Electrónica', semestre: '6to semestre', estrellas: 5,
    cita: '"El simulador de notas es increíble. Sé exactamente cuánto necesito para pasar cada corte."',
    foto: MarianaImg,
  },
  {
    id: 4, nombre: 'Isaac Burgos', carrera: 'Ingeniería Civil', semestre: '4to semestre', estrellas: 5,
    cita: '"Antes perdía horas organizando mis tiempos. Con AI.BERT todo fluye: sé qué hacer, cuándo y por qué."',
    foto: IssacImg,
  },
  {
    id: 5, nombre: 'Juanes García', carrera: 'Ciberseguridad', semestre: '5to semestre', estrellas: 5,
    cita: '"La función de priorización con IA es brutal. Me ayuda a detectar qué materia necesita más atención esta semana."',
    foto: JuanesImg,
  },
];

const ITEMS_PER_PAGE = 3;

/* ── componente ── */
const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { isDark } = useTheme();
  const t = createStyles(isDark);
  const [carouselPage, setCarouselPage] = useState(0);
  const [testimonioIdx, setTestimonioIdx] = useState(0);
  const s = st(isDark, t);

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const totalPages = Math.ceil(BENEFICIOS.length / ITEMS_PER_PAGE);
  const visibleBeneficios = BENEFICIOS.slice(
    carouselPage * ITEMS_PER_PAGE,
    (carouselPage + 1) * ITEMS_PER_PAGE,
  );

  const prevPage = () => setCarouselPage((p) => (p - 1 + totalPages) % totalPages);
  const nextPage = () => setCarouselPage((p) => (p + 1) % totalPages);

  const prevTestimonio = () => setTestimonioIdx((p) => (p - 1 + TESTIMONIOS.length) % TESTIMONIOS.length);
  const nextTestimonio = () => setTestimonioIdx((p) => (p + 1) % TESTIMONIOS.length);
  const tActual = TESTIMONIOS[testimonioIdx];

  return (
    <div style={s.root}>
      <GridBackground isDark={isDark} />

      {/* ── NAVBAR ── */}
      <nav style={s.navbar}>
        <div style={s.navInner} className="landing-nav-inner">
          <div style={s.navBrand}>
            <img src={LogoImg} alt="AI.BERT" style={s.navLogo} />
            <span style={s.navBrandText}>AI.BERT</span>
          </div>
          <div style={s.navLinks} className="landing-nav-links">
            <a href="#inicio"         style={s.navLink}>INICIO</a>
            <a href="#sobre-nosotros" style={s.navLink}>SOBRE NOSOTROS</a>
            <a href="#beneficios"     style={s.navLink}>BENEFICIOS</a>
            <a href="#opiniones"      style={s.navLink}>OPINIONES</a>
          </div>
          <button
            style={s.navBtn}
            onClick={() => navigate('/login')}
            className="btn-lift"
          >
            INICIAR SESIÓN
          </button>
        </div>
      </nav>

      {/* ── S1: HERO ── */}
      <section id="inicio" style={s.hero}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <AnimatedSection animation="fade-up" delay={0.1}>
            <p style={s.heroEyebrow}>PLATAFORMA ACADÉMICA INTELIGENTE</p>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={0.2}>
            <h1 style={s.heroTitle}>
              TU ASISTENTE ACADÉMICO<br />
              <span style={s.heroTitleGrad} className="animate-gradient">INTELIGENTE</span>
            </h1>
          </AnimatedSection>
           <AnimatedSection animation="fade-up" delay={0.3}>
             <p style={s.heroSub}>
               Planifica tareas, administra horarios y recibe asistencia inteligente en una sola plataforma.
             </p>
           </AnimatedSection>
           <AnimatedSection animation="fade-up" delay={0.4}>
             <div style={s.heroBtns}>
               <button 
                 style={s.heroBtn} 
                 onClick={() => navigate('/register')}
                 className="btn-lift"
               >
                 CREAR CUENTA
               </button>
               <a href="#beneficios" style={s.heroOutlineBtn} className="btn-lift">
                 Más Información
               </a>
             </div>
           </AnimatedSection>
        </div>
      </section>

      {/* ── S2: PROBLEMAS ── */}
      <section id="beneficios" style={s.section}>
        <div style={s.sectionInner}>
          <AnimatedSection animation="fade-up">
            <h2 style={s.sectionTitle}>¿La universidad se siente caótica?</h2>
          </AnimatedSection>
          <div style={s.problemasGrid}>
            {PROBLEMAS.map((p, index) => {
              const Icon = p.icon;
              return (
                <AnimatedSection key={p.id} animation="fade-up" delay={index * 0.1}>
                  <div 
                    style={s.problemaCard(p.destacada)} 
                    className="card-hover"
                  >
                    {p.destacada && <span style={s.problemaHighlight}>PROBLEMA PRINCIPAL</span>}
                    <div style={s.problemaIconWrap(p.color, p.destacada)}>
                      <Icon size={20} color={p.destacada ? '#fff' : p.color} />
                    </div>
                    <h3 style={s.problemaTitulo(p.destacada)}>{p.titulo}</h3>
                    <p style={s.problemaDesc(p.destacada)}>{p.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── S3: BENEFICIOS con carrusel ── */}
      <section style={{ ...s.section, background: isDark ? 'rgba(15,10,20,0.55)' : 'rgba(210,140,80,0.07)' }}>
        <div style={s.sectionInner}>
          <AnimatedSection animation="fade-up">
            <h2 style={s.sectionTitle}>AI.BERT pone orden al caos</h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={0.1}>
            <p style={s.sectionDesc}>Herramientas pensadas para el estudiante universitario moderno.</p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <div style={s.carouselWrap}>
              <button style={s.carouselArrow} onClick={prevPage} aria-label="Anterior" className="btn-lift">
                <ChevronLeft size={20} color="#fff" />
              </button>

              <div style={s.carouselTrack}>
                {visibleBeneficios.map((b, index) => {
                  const Icon = b.icon;
                  return (
                    <div 
                      key={b.id} 
                      style={s.beneficioCard} 
                      className="card-hover"
                    >
                      <div style={s.beneficioIconWrap(b.color)}>
                        <Icon size={22} color={b.color} />
                      </div>
                      <h3 style={s.beneficioTitulo}>{b.titulo}</h3>
                      <p style={s.beneficioDesc}>{b.desc}</p>
                    </div>
                  );
                })}
              </div>

              <button style={s.carouselArrow} onClick={nextPage} aria-label="Siguiente" className="btn-lift">
                <ChevronRight size={20} color="#fff" />
              </button>
            </div>

            <div style={s.carouselDots}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  style={s.dot(i === carouselPage)}
                  onClick={() => setCarouselPage(i)}
                  aria-label={`Página ${i + 1}`}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── S4: CONOCE A AI.BERT ── */}
      <section id="sobre-nosotros" style={s.section}>
        <div style={s.sectionInner}>

           <div style={s.conoceRow}>
             {/* Izquierda */}
             <AnimatedSection animation="fade-left" style={s.conoceLeft}>
               <h2 style={s.conoceTitulo}>
                 Conoce a ALBERT,<br />tu nuevo{' '}
                 <span style={s.conoceGrad}>copiloto</span>
               </h2>
               <p style={s.conoceDesc}>
                 AI.BERT es más que una agenda. Es un asistente que aprende de tus hábitos
                 académicos y te guía para tomar mejores decisiones cada día.
               </p>
               <ul style={s.conoceList}>
                 {[
                   'Analiza tu rendimiento en tiempo real',
                   'Sugiere prioridades según tus metas',
                   'Te alerta antes de que algo salga mal',
                 ].map((item, i) => (
                   <li key={i} style={s.conoceItem}>
                     <div style={s.conoceCheck} className="check-animate">
                       <Check size={12} color="#fff" strokeWidth={3} />
                     </div>
                     <span style={s.conoceItemText}>{item}</span>
                   </li>
                 ))}
               </ul>
             </AnimatedSection>

             {/* Derecha: GIF + mockup */}
             <AnimatedSection animation="fade-right" delay={0.2} style={{ flexShrink: 0 }}>
               <div style={s.conoceRight}>
                 <div 
                   style={s.conoceGifWrap} 
                   className="animate-float"
                 >
                   <img src={AibertGif} alt="AI.BERT" style={s.conoceGif} />
                 </div>
                 <div style={s.copilotoImgWrap} className="card-hover">
                   <img src={CopilotoImg} alt="AI.BERT plataforma" style={s.copilotoImg} />
                 </div>
               </div>
             </AnimatedSection>
           </div>

          {/* Pasos: ¿Cómo funciona? */}
          <div style={s.pasosWrap}>
            <AnimatedSection animation="fade-up">
              <h3 style={s.pasosTitulo}>¿Cómo funciona?</h3>
            </AnimatedSection>
            <div style={s.pasosGrid}>
              {PASOS.map((p, i) => (
                <AnimatedSection key={p.num} animation="fade-up" delay={i * 0.15}>
                  <div style={s.pasoCard(i)} className="card-hover">
                    <span style={s.pasoNum}>{p.num}</span>
                    <h4 style={s.pasoTitulo}>{p.titulo}</h4>
                    <p style={s.pasoDesc}>{p.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── S5: TESTIMONIOS ── */}
      <section id="opiniones" style={{ ...s.section, background: isDark ? 'rgba(15,10,20,0.55)' : 'rgba(210,140,80,0.07)' }}>
        <div style={s.sectionInner}>
          <AnimatedSection animation="fade-up">
            <h2 style={s.sectionTitle}>Lo que dicen los estudiantes</h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={0.1}>
            <span style={s.sectionSubGrad}>OPINIONES REALES, RESULTADOS REALES</span>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <div style={s.testiCarouselWrap}>
              <button style={s.carouselArrow} onClick={prevTestimonio} aria-label="Anterior testimonio" className="btn-lift">
                <ChevronLeft size={20} color="#fff" />
              </button>

              <div style={s.testiCard(tActual.destacado)} className="card-hover">
                {tActual.destacado && <span style={s.destacadoBadge}>DESTACADO</span>}
                <div style={s.estrellas}>
                  {Array.from({ length: tActual.estrellas }).map((_, i) => (
                    <Star key={i} size={16} fill="#FF5B2E" color="#FF5B2E" />
                  ))}
                </div>
                <p style={s.testimonioCita(tActual.destacado)}>{tActual.cita}</p>
                <div style={s.testimonioAutor}>
                  <img src={tActual.foto} alt={tActual.nombre} style={s.testimonioFoto} />
                  <div>
                    <div style={s.testimonioNombre(tActual.destacado)}>{tActual.nombre}</div>
                    <div style={s.testimonioMeta}>{tActual.carrera} · {tActual.semestre}</div>
                  </div>
                </div>
              </div>

              <button style={s.carouselArrow} onClick={nextTestimonio} aria-label="Siguiente testimonio" className="btn-lift">
                <ChevronRight size={20} color="#fff" />
              </button>
            </div>

            <div style={s.carouselDots}>
              {TESTIMONIOS.map((_, i) => (
                <button
                  key={i}
                  style={s.dot(i === testimonioIdx)}
                  onClick={() => setTestimonioIdx(i)}
                  aria-label={`Testimonio ${i + 1}`}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── S6: FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerLogo}>
            <img src={LogoDegradeImg} alt="AI.BERT logo" style={s.footerLogoImg} />
            <span style={s.footerLogoText}>AI.BERT</span>
          </div>
          <div style={s.footerDivider} />
          <div style={s.footerBottom}>
            <span style={s.footerCopy}>© All rights reserved 2026 AI.BERT</span>
            <span style={s.footerSep}>·</span>
            <span style={s.footerCopy}>Grupo 01</span>
            <span style={s.footerSep}>·</span>
            <span style={s.footerCopy}>DOSW (Desarrollo y ciclos de vida del software)</span>
            <span style={s.footerSep}>·</span>
            <span style={s.footerCopy}>ECI.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

/* ── estilos ── */
const st = (isDark, t) => ({

  root: {
    position: 'relative',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
    color: t.textPrimary,
    overflowX: 'hidden',
  },

  /* NAVBAR */
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: isDark ? 'rgba(5,2,8,0.88)' : 'rgba(253,242,235,0.92)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(220,193,181,0.30)'}`,
  },
  navInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 32px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 32,
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    flexShrink: 0,
  },
  navLogo: {
    width: 48,
    height: 48,
    objectFit: 'contain',
    borderRadius: 10,
  },
  navBrandText: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 18,
    fontWeight: 800,
    color: t.textPrimary,
    letterSpacing: '0.02em',
  },
  navLinks: {
    display: 'flex',
    gap: 28,
    flex: 1,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  navLink: {
    color: t.textSecondary,
    textDecoration: 'none',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    fontFamily: "'Poppins', sans-serif",
  },
  navBtn: {
    background: 'linear-gradient(90deg,#FF5B2E,#C4107A)',
    border: 'none',
    borderRadius: 8,
    padding: '9px 20px',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  /* HERO */
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${LandingBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg,rgba(10,10,10,0.55) 0%,rgba(10,10,10,0.82) 100%)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    maxWidth: 760,
    padding: '0 24px',
    paddingTop: 64,
  },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: '0.16em',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.50)',
    fontFamily: "'Poppins', sans-serif",
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(38px,7vw,72px)',
    fontWeight: 900,
    color: '#FFFFFF',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    margin: '0 0 20px',
  },
   heroTitleGrad: {
     background: 'linear-gradient(90deg,#FF5B2E,#C4107A,#A855F7,#FF5B2E)',
     backgroundSize: '300% 100%',
     WebkitBackgroundClip: 'text',
     WebkitTextFillColor: 'transparent',
     backgroundClip: 'text',
   },
  heroSub: {
    fontSize: 'clamp(14px,1.8vw,18px)',
    color: 'rgba(255,255,255,0.68)',
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.65,
    margin: '0 auto 36px',
    maxWidth: 560,
  },
  heroBtns: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  heroBtn: {
    background: 'linear-gradient(90deg,#FF5B2E,#C4107A)',
    border: 'none',
    borderRadius: 12,
    padding: '14px 32px',
    color: '#fff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    letterSpacing: '0.06em',
    boxShadow: '0 4px 24px rgba(196,16,122,0.45)',
  },
  heroOutlineBtn: {
    background: 'transparent',
    border: '2px solid #A855F7',
    borderRadius: 12,
    padding: '12px 30px',
    color: '#A855F7',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.04em',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },

  /* SECCIONES BASE */
  section: {
    background: 'transparent',
    position: 'relative',
    zIndex: 1,
    padding: 'clamp(64px,8vw,100px) 24px',
  },
  sectionInner: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  sectionTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(28px,4vw,44px)',
    fontWeight: 800,
    color: t.textPrimary,
    textAlign: 'center',
    margin: '0 0 12px',
    letterSpacing: '-0.02em',
  },
  sectionDesc: {
    fontSize: 15,
    color: t.textSecondary,
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center',
    margin: '0 0 48px',
  },
  sectionSubGrad: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.14em',
    background: 'linear-gradient(90deg,#FF5B2E,#C4107A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
    display: 'block',
    marginBottom: 40,
  },

  /* PROBLEMAS */
  problemasGrid: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 48,
  },
   problemaCard: (destacada) => ({
     background: destacada
       ? (isDark ? 'linear-gradient(135deg,rgba(168,85,247,0.14),rgba(196,16,122,0.10))' : 'linear-gradient(135deg,rgba(168,85,247,0.10),rgba(196,16,122,0.06))')
       : t.cardBg,
     border: `1px solid ${destacada ? 'rgba(168,85,247,0.42)' : t.cardBorder}`,
     borderRadius: 16,
     padding: '22px 20px',
     width: 196,
     display: 'flex',
     flexDirection: 'column',
     gap: 10,
     position: 'relative',
     boxShadow: destacada ? '0 0 32px rgba(168,85,247,0.18)' : t.cardShadow,
     flexShrink: 0,
     transition: 'transform 0.3s ease, boxShadow 0.3s ease, borderColor 0.3s ease',
   }),
  problemaHighlight: {
    fontSize: 8,
    fontWeight: 800,
    letterSpacing: '0.10em',
    color: '#A855F7',
    fontFamily: "'Poppins', sans-serif",
    textTransform: 'uppercase',
  },
  problemaIconWrap: (color, destacada) => ({
    width: 40,
    height: 40,
    borderRadius: 10,
    background: destacada ? 'rgba(168,85,247,0.22)' : color + '18',
    border: `1px solid ${destacada ? 'rgba(168,85,247,0.35)' : color + '30'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  problemaTitulo: () => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: t.textPrimary,
  }),
  problemaDesc: (destacada) => ({
    fontSize: 11,
    color: destacada ? t.textSecondary : t.textMuted,
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.55,
    margin: 0,
  }),

  /* CARRUSEL */
  carouselWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  carouselArrow: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  carouselTrack: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 14,
    flex: 1,
  },
   beneficioCard: {
     background: t.cardBg,
     border: '1px solid #C4107A',
     boxShadow: '0 0 12px rgba(196,16,122,0.5)',
     borderRadius: 16,
     padding: '24px 20px',
     display: 'flex',
     flexDirection: 'column',
     gap: 12,
     transition: 'transform 0.3s ease, boxShadow 0.3s ease, borderColor 0.3s ease',
   },
  beneficioIconWrap: (color) => ({
    width: 44,
    height: 44,
    borderRadius: 12,
    background: color + '18',
    border: `1px solid ${color}30`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  beneficioTitulo: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontWeight: 800,
    color: t.textPrimary,
    letterSpacing: '0.04em',
  },
  beneficioDesc: {
    fontSize: 12,
    color: t.textSecondary,
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.6,
    flex: 1,
    margin: 0,
  },
  beneficioLink: {
    fontSize: 12,
    fontWeight: 700,
    color: '#FF5B2E',
    fontFamily: "'Poppins', sans-serif",
    textDecoration: 'none',
    letterSpacing: '0.02em',
  },
  carouselDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
  },
  dot: (active) => ({
    width: active ? 24 : 8,
    height: 8,
    borderRadius: 99,
    background: active
      ? 'linear-gradient(90deg,#FF5B2E,#C4107A)'
      : (isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.18)'),
    border: 'none',
    cursor: 'pointer',
    transition: 'width 0.25s',
    padding: 0,
  }),

  /* CONOCE A AI.BERT */
  conoceRow: {
    display: 'flex',
    gap: 60,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 72,
  },
  conoceLeft: {
    flex: '1 1 320px',
    minWidth: 0,
  },
  conoceTitulo: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(28px,3.5vw,44px)',
    fontWeight: 800,
    color: t.textPrimary,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    margin: '0 0 20px',
  },
  conoceGrad: {
    background: 'linear-gradient(90deg,#FF5B2E,#C4107A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  conoceDesc: {
    fontSize: 15,
    color: t.textSecondary,
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.72,
    margin: '0 0 28px',
  },
  conoceList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  conoceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  conoceCheck: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#FF5B2E,#C4107A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  conoceItemText: {
    fontSize: 14,
    color: t.textSecondary,
    fontFamily: "'Poppins', sans-serif",
  },
  conoceRight: {
    flex: '0 1 560px',
    display: 'flex',
    gap: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
    conoceGifWrap: {
      width: 200,
      height: 200,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   conoceGif: {
     width: '100%',
     height: '100%',
     objectFit: 'contain',
     objectPosition: 'center center',
     display: 'block',
   },
   copilotoImgWrap: {
     flex: 1,
     borderRadius: 14,
     overflow: 'hidden',
     boxShadow: `0 0 0 1px rgba(196,16,122,0.20),0 20px 60px rgba(0,0,0,${isDark ? '0.65' : '0.20'})`,
     minWidth: 220,
     maxWidth: 460,
     height: 'auto',
     aspectRatio: '16/10',
   },
   copilotoImg: {
     width: '100%',
     height: '100%',
     objectFit: 'cover',
     objectPosition: 'center',
     display: 'block',
   },
  mockupBar: {
    background: '#222222',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '10px 14px',
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  mockupDot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  mockupTitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.30)',
    fontFamily: "'Poppins', sans-serif",
    marginLeft: 6,
  },
  mockupBody: {
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  mockupLine: (w) => ({
    height: 9,
    width: `${w}%`,
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 99,
  }),
  mockupCard: (color) => ({
    flex: 1,
    height: 44,
    background: color + '12',
    border: `1px solid ${color}22`,
    borderRadius: 8,
  }),

  /* PASOS */
  pasosWrap: {
    borderTop: `1px solid ${t.cardBorder}`,
    paddingTop: 60,
  },
  pasosTitulo: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(22px,3vw,32px)',
    fontWeight: 800,
    color: t.textPrimary,
    textAlign: 'center',
    margin: '0 0 40px',
    letterSpacing: '-0.01em',
  },
  pasosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
  },
   pasoCard: (i) => ({
     background: t.cardBg,
     border: `1px solid ${t.cardBorder}`,
     borderRadius: 14,
     padding: '22px 18px',
     borderTop: `3px solid ${['#FF5B2E','#C4107A','#A855F7','#FF5B2E'][i]}`,
     transition: 'transform 0.3s ease, boxShadow 0.3s ease, borderColor 0.3s ease',
   }),
  pasoNum: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 28,
    fontWeight: 900,
    background: 'linear-gradient(90deg,#FF5B2E,#C4107A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'block',
    marginBottom: 10,
    lineHeight: 1,
  },
  pasoTitulo: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: t.textPrimary,
    marginBottom: 8,
  },
  pasoDesc: {
    fontSize: 12,
    color: t.textMuted,
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.6,
    margin: 0,
  },

  /* TESTIMONIOS */
  testiCarouselWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
   testiCard: (destacado) => ({
     flex: 1,
     maxWidth: 680,
     margin: '0 auto',
     background: destacado
       ? (isDark ? 'linear-gradient(135deg,rgba(255,91,46,0.08),rgba(196,16,122,0.08))' : 'linear-gradient(135deg,rgba(255,91,46,0.05),rgba(196,16,122,0.05))')
       : t.cardBg,
     border: '1px solid #C4107A',
     boxShadow: '0 0 12px rgba(196,16,122,0.5)',
     borderRadius: 20,
     padding: '36px 32px',
     display: 'flex',
     flexDirection: 'column',
     gap: 20,
     position: 'relative',
     transition: 'transform 0.3s ease, boxShadow 0.3s ease, borderColor 0.3s ease',
   }),
  destacadoBadge: {
    position: 'absolute',
    top: -13,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(90deg,#FF5B2E,#C4107A)',
    color: '#fff',
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: '0.10em',
    padding: '4px 16px',
    borderRadius: 99,
    fontFamily: "'Poppins', sans-serif",
    whiteSpace: 'nowrap',
  },
  estrellas: {
    display: 'flex',
    gap: 3,
  },
  testimonioCita: (destacado) => ({
    fontSize: 13,
    color: destacado ? t.textPrimary : t.textSecondary,
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.72,
    fontStyle: 'italic',
    flex: 1,
    margin: 0,
  }),
  testimonioAutor: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  testimonioFoto: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  testimonioNombre: () => ({
    fontSize: 13,
    fontWeight: 700,
    color: t.textPrimary,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  }),
  testimonioMeta: {
    fontSize: 11,
    color: t.textMuted,
    fontFamily: "'Poppins', sans-serif",
    marginTop: 2,
  },

  /* FOOTER */
  footer: {
    position: 'relative',
    zIndex: 1,
    background: isDark ? 'rgba(5,2,8,0.95)' : 'rgba(253,242,235,0.95)',
    borderTop: `1px solid ${t.cardBorder}`,
    padding: '48px 24px 32px',
  },
  footerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  footerLogoImg: {
    width: 36,
    height: 36,
    objectFit: 'contain',
  },
  footerLogoText: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 22,
    fontWeight: 900,
    background: 'linear-gradient(90deg,#FF5B2E,#C4107A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  footerDivider: {
    width: '100%',
    height: 1,
    background: t.cardBorder,
  },
  footerBottom: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerCopy: {
    fontSize: 11,
    color: t.textMuted,
    fontFamily: "'Poppins', sans-serif",
  },
  footerSep: {
    fontSize: 11,
    color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)',
    fontFamily: "'Poppins', sans-serif",
  },
});

export default Landing;

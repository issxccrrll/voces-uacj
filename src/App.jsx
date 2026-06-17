import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONEXIÓN A LA BASE DE DATOS ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ICONOS INLINE SVG ---
const IconLightbulb = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);
const IconCheck = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconShield = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconChart = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
  </svg>
);
const IconPlus = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconLock = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconExclamation = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const IconInfo = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconTrash = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PALABRAS_PROHIBIDAS = ["pendejo", "estupido", "mierda", "cabron", "huevon", "corrupto", "ratero", "inepto"];

export default function App() {
  // --- ESTADOS GLOBALES (Separados correctamente) ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('uacj_civic_user');
    return saved ? JSON.parse(saved) : null;
  }); 

  // Estados de Autenticación
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState(''); 
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Estados de Interfaz
  const [showNotification, setShowNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('proposals');
  const [selectedCampus, setSelectedCampus] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Estados del Formulario
  const [formTitle, setFormTitle] = useState('');
  const [formProblem, setFormProblem] = useState('');
  const [formSolution, setFormSolution] = useState('');
  const [formBeneficiaries, setFormBeneficiaries] = useState('');
  const [formCampus, setFormCampus] = useState('IIT');
  const [formCategory, setFormCategory] = useState('Baños');
  const [formError, setFormError] = useState('');

  // Propuestas
  const [proposals, setProposals] = useState(() => {
    const saved = localStorage.getItem('uacj_civic_proposals');
    if (saved) return JSON.parse(saved);
    return []; // Reemplazar con datos iniciales si lo deseas
  });

  // Persistencia local temporal (Caché)
  useEffect(() => {
    localStorage.setItem('uacj_civic_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('uacj_civic_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('uacj_civic_user');
    }
  }, [user]);

  // --- SISTEMA DE ALERTA RÁPIDA (Optimizado) ---
  const triggerNotification = useCallback((message, type = 'success') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 4000);
  }, []);

  // --- MOTOR OTP DE AUTENTICACIÓN REAL ---
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    
    const allowedDomains = ['@alumnos.uacj.mx', '@uacj.mx'];
    if (!allowedDomains.some(domain => cleanEmail.endsWith(domain))) {
      setEmailError('Usa estrictamente tu correo institucional (@alumnos.uacj.mx).');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ email: cleanEmail });
      if (error) throw error;

      setEmailError('');
      triggerNotification('¡Código enviado! Revisa tu correo institucional.', 'info');
      setShowOtpInput(true);
    } catch (error) {
      console.error("Error SMTP/Auth:", error.message);
      setEmailError('Error al conectar con el servidor de correo. Revisa límite.');
    }
  }, [emailInput, triggerNotification]);

  const handleVerifyCode = useCallback(async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailInput.trim().toLowerCase(),
        token: otpCode,
        type: 'email',
      });

      if (error) throw error;

      const matricula = emailInput.split('@')[0];
      const mockUser = {
        email: emailInput.toLowerCase(),
        alias: `Estudiante_${matricula.toUpperCase()}`,
        joinedAt: new Date().toISOString(),
        id: data.user.id
      };

      setUser(mockUser);
      setShowOtpInput(false);
      triggerNotification(`¡Bienvenido, ${mockUser.alias}!`, 'success');
    } catch (error) {
      console.error("Error al verificar:", error.message);
      setEmailError('El código es incorrecto o ya expiró.');
    }
  }, [emailInput, otpCode, triggerNotification]);

  const handleLogout = useCallback(() => {
    supabase.auth.signOut(); // Desconecta la sesión real en Supabase
    setUser(null);
    setEmailInput('');
    setShowOtpInput(false);
    setOtpCode('');
    triggerNotification('Sesión cerrada correctamente.', 'info');
  }, [triggerNotification]);

  // --- LÓGICA DE VOTACIÓN (Concurrencia optimizada) ---
  const handleVote = useCallback((proposalId) => {
    if (!user) {
      triggerNotification('Debes registrar tu matrícula UACJ para poder votar.', 'error');
      return;
    }

    setProposals(prev => prev.map(prop => {
      if (prop.id === proposalId) {
        const userHasVoted = prop.voters?.includes(user.email);
        let newVoters = [...(prop.voters || [])];
        let newVotes = prop.votes;

        if (userHasVoted) {
          newVoters = newVoters.filter(email => email !== user.email);
          newVotes -= 1;
          triggerNotification('Retiraste tu apoyo a esta propuesta.', 'info');
        } else {
          newVoters.push(user.email);
          newVotes += 1;
          triggerNotification('¡Apoyo registrado con éxito!', 'success');
        }

        return {
          ...prop,
          votes: newVotes,
          voters: newVoters,
          status: newVotes >= prop.target ? 'Enviado a Revisión' : 'Buscando Firmas'
        };
      }
      return prop;
    }));
  }, [user, triggerNotification]);

  // --- MOTOR CRUD: ELIMINAR PROPUESTA (Evaluación Matemática Δt) ---
  const handleDeleteProposal = useCallback(async (id, createdAt) => {
    // Cálculo matemático: ¿Han pasado menos de 24 horas?
    const tiempoCreacion = new Date(createdAt).getTime();
    const tiempoActual = Date.now();
    const diferenciaMs = tiempoActual - tiempoCreacion;
    const limiteMs = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

    if (diferenciaMs > limiteMs) {
      triggerNotification('Error: El periodo de gracia (24h) para eliminar esta propuesta ha caducado.', 'error');
      return;
    }

    // Confirmación de seguridad
    if (!window.confirm("¿Estás seguro de que deseas eliminar tu propuesta permanentemente?")) return;

    try {
      // Intento de borrado en Supabase
      const { error } = await supabase.from('proposals').delete().eq('id', id);
      if (error) throw error;

      // Eliminación exitosa: limpiamos la memoria de React
      setProposals(prev => prev.filter(p => p.id !== id));
      triggerNotification('Propuesta eliminada exitosamente.', 'success');
    } catch (error) {
      console.error("Error al borrar:", error);
      triggerNotification('Hubo un error de conexión al intentar borrar.', 'error');
    }
  }, [triggerNotification]);

  // --- CREACIÓN DE PROPUESTA ---
  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle || !formProblem || !formSolution || !formBeneficiaries) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    if (formTitle.length < 15) {
      setFormError('El título debe ser más claro (mínimo 15 caracteres).');
      return;
    }

    try {
      const nuevaPropuestaDB = {
        title: formTitle,
        problem: formProblem,
        solution: formSolution,
        beneficiaries: formBeneficiaries,
        campus: formCampus,
        category: formCategory,
        status: 'Buscando Firmas',
        target: 500,
        // IMPORTANTE: Asegúrate de tener la columna 'author' creada en Supabase
        author: user ? user.email : 'anonimo@uacj.mx',
        createdAt: new Date().toISOString() // Agregamos Timestamp para el cálculo matemático
      };

      const { data, error } = await supabase.from('proposals').insert([nuevaPropuestaDB]).select();
      if (error) throw error;

      setProposals(prev => [{ ...data[0], voters: [], votes: 0 }, ...prev]);
      setShowCreateModal(false);
      triggerNotification('¡Propuesta inyectada en la base de datos oficial!', 'success');

      setFormTitle(''); setFormProblem(''); setFormSolution(''); setFormBeneficiaries('');
    } catch (error) {
      console.error("Error al guardar:", error);
      setFormError('Hubo un error de conexión con la base de datos.');
    }
  };

  // --- MEMOIZACIÓN DE VISTAS (Rendimiento O(1) para re-renders) ---
  const filteredProposals = useMemo(() => {
    return proposals.filter(prop => {
      const matchCampus = selectedCampus === 'Todos' || prop.campus === selectedCampus;
      const matchCategory = selectedCategory === 'Todas' || prop.category === selectedCategory;
      return matchCampus && matchCategory;
    });
  }, [proposals, selectedCampus, selectedCategory]);

  const metrics = useMemo(() => {
    const total = proposals.length;
    const totalVotes = proposals.reduce((acc, p) => acc + (p.votes || 0), 0);
    const resolved = proposals.filter(p => p.status === 'Logrado').length;
    const inReview = proposals.filter(p => p.status === 'Enviado a Revisión').length;
    const categoryCounts = {};
    proposals.forEach(p => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + (p.votes || 0); });
    return { total, totalVotes, resolved, inReview, categoryCounts };
  }, [proposals]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* --- NOTIFICACIÓN TEMPORAL --- */}
      {showNotification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 p-4 rounded-xl shadow-2xl border transition-all duration-300 animate-bounce ${
          showNotification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          showNotification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className={`w-3 h-3 rounded-full ${showNotification.type === 'success' ? 'bg-emerald-500' : showNotification.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'}`} />
          <span className="font-semibold text-sm">{showNotification.message}</span>
        </div>
      )}

      {/* --- CABECERA PRINCIPAL UACJ --- */}
      <header className="bg-[#003B91] border-b-4 border-[#FFD100] text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFD100] flex items-center justify-center shadow-inner text-[#003B91] font-black text-xl">U</div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-1 sm:gap-2">Voces<span className="text-[#FFD100]">UACJ</span></h1>
              <p className="text-xs text-blue-200 font-medium hidden sm:block">Una plataforma Independiente de la institución</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-blue-200">Matrícula Activa</p>
                  <p className="text-sm font-bold text-white">{user.alias}</p>
                </div>
                <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg border border-blue-400 text-xs font-semibold hover:bg-white hover:text-[#003B91] transition-all cursor-pointer">Salir</button>
              </div>
            ) : (
              <span className="text-xs sm:text-sm text-blue-100 font-semibold bg-blue-900/50 px-3 py-1.5 rounded-lg border border-blue-700">Acceso Estudiantil Verificado</span>
            )}
          </div>
        </div>
      </header>

      {/* --- VISTA: LANDING PAGE DE BIENVENIDA --- */}
      {!user && (
        <section className="bg-gradient-to-b from-[#003B91] to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD100]/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFD100] text-[#003B91] uppercase tracking-wider mb-6 shadow-sm">
              <IconLightbulb className="w-3.5 h-3.5" /> De la queja individual a la propuesta comunitaria
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
              ¿Quieres mejorar tu <span className="text-[#FFD100] underline decoration-[#FFD100] underline-offset-8">Campus UACJ</span>?
            </h2>
            <p className="text-base sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Propón soluciones formales para baños, áreas verdes, bebederos o laboratorios. Consigue firmas de tus compañeros de forma transparente y hagamos que nuestra voz sea imposible de ignorar.
            </p>

            <div className="max-w-md mx-auto bg-white text-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-blue-700/30 transform hover:scale-[1.01] transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-[#003B91]"><IconLock className="w-5 h-5" /></div>
                <div className="text-left">
                  <h3 className="font-bold text-base text-[#003B91]">Registro Seguro y Exclusivo</h3>
                  <p className="text-xs text-slate-500">Solo para alumnos con correo activo de la UACJ</p>
                </div>
              </div>

              {/* FORMULARIO OTP DINÁMICO */}
              {!showOtpInput ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 text-left mb-1.5 uppercase">Correo Institucional</label>
                    <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="ejemplo@alumnos.uacj.mx" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003B91] focus:border-transparent text-sm transition-all" />
                    {emailError && <p className="text-rose-600 text-xs text-left mt-1.5 font-semibold flex items-center gap-1"><IconExclamation className="w-3.5 h-3.5 inline" /> {emailError}</p>}
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#003B91] hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                    Recibir Código de Acceso
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-2 text-left">
                    <p className="text-xs text-[#003B91] font-semibold">Enviamos un código a <strong className="text-blue-800">{emailInput}</strong></p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 text-left mb-1.5 uppercase">Código de 8 dígitos</label>
                    <input type="text" maxLength={8} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Ej: 123456" className="w-full px-4 py-3 text-center tracking-[0.5em] text-xl font-black rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003B91] focus:border-transparent transition-all" />
                    {emailError && <p className="text-rose-600 text-xs text-left mt-1.5 font-semibold flex items-center gap-1"><IconExclamation className="w-3.5 h-3.5 inline" /> {emailError}</p>}
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button type="button" onClick={() => setShowOtpInput(false)} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all cursor-pointer text-sm">Volver</button>
                    <button type="submit" disabled={otpCode.length < 6} className="flex-1 py-3 bg-[#FFD100] hover:bg-yellow-400 text-[#003B91] disabled:opacity-50 disabled:cursor-not-allowed font-black rounded-xl shadow-md transition-all cursor-pointer text-sm">Verificar y Entrar</button>
                  </div>
                </form>
              )}

              <p className="text-[10px] text-slate-400 mt-4 text-center">*Tus datos están protegidos. El sistema genera un alias con tu matrícula para resguardar tu identidad pública y evitar represalias.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
              <div className="bg-blue-800/30 border border-blue-700/50 p-5 rounded-xl text-left">
                <div className="w-10 h-10 rounded-lg bg-[#FFD100]/20 text-[#FFD100] flex items-center justify-center mb-3"><IconShield className="w-5 h-5" /></div>
                <h4 className="font-bold text-sm mb-1 text-white">100% Formal y Respetuoso</h4>
                <p className="text-xs text-blue-200">Sin ataques personales. Diseñado exclusivamente para proponer mejoras físicas.</p>
              </div>
              <div className="bg-blue-800/30 border border-blue-700/50 p-5 rounded-xl text-left">
                <div className="w-10 h-10 rounded-lg bg-[#FFD100]/20 text-[#FFD100] flex items-center justify-center mb-3"><IconChart className="w-5 h-5" /></div>
                <h4 className="font-bold text-sm mb-1 text-white">Fuerza de Datos</h4>
                <p className="text-xs text-blue-200">Convertimos opiniones en reportes estructurados que demuestran qué campus necesita más atención.</p>
              </div>
              <div className="bg-blue-800/30 border border-blue-700/50 p-5 rounded-xl text-left">
                <div className="w-10 h-10 rounded-lg bg-[#FFD100]/20 text-[#FFD100] flex items-center justify-center mb-3"><IconLightbulb className="w-5 h-5" /></div>
                <h4 className="font-bold text-sm mb-1 text-white">Logros Estudiantiles</h4>
                <p className="text-xs text-blue-200">El historial registrará cada mejora ejecutada para mantener viva la participación.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- SECCIÓN PRINCIPAL DE CONTROL / FEED --- */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab('proposals')} className={`py-4 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'proposals' ? 'border-[#003B91] text-[#003B91]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>📋 Propuestas de Infraestructura</button>
          <button onClick={() => setActiveTab('about')} className={`py-4 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === 'about' ? 'border-[#003B91] text-[#003B91]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>💡 Acerca del Proyecto</button>
        </div>

        {activeTab === 'proposals' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              
              {user ? (
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#003B91] text-[#FFD100] flex items-center justify-center font-bold text-xs">{user.alias[11] || 'U'}</div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Sesión Iniciada</h4>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Ya puedes votar para dar peso formal a las iniciativas o publicar tu propia propuesta estructurada.</p>
                  <button onClick={() => setShowCreateModal(true)} className="w-full mt-4 py-2.5 bg-[#003B91] hover:bg-blue-800 text-[#FFD100] hover:text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
                    <IconPlus className="w-4 h-4" /> Crear Nueva Propuesta
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl text-left">
                  <h4 className="font-bold text-[#003B91] text-sm flex items-center gap-1.5 mb-2"><IconInfo className="w-4 h-4 text-amber-600" /> ¿Quieres participar?</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">Estás visualizando el prototipo en modo de lectura. Registra tu correo institucional arriba para poder votar por las mejoras que creas más urgentes.</p>
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left">
                <h3 className="font-bold text-slate-800 text-sm mb-4 border-b pb-2 flex items-center gap-2"><span>🔍</span> Filtrar Propuestas</h3>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Por Campus / Instituto</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Todos', 'IIT', 'ICSA', 'ICB', 'IADA'].map((campus) => (
                      <button key={campus} onClick={() => setSelectedCampus(campus)} className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${selectedCampus === campus ? 'bg-[#003B91] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>{campus}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Por Necesidad</label>
                  <div className="space-y-1.5">
                    {['Todas', 'Baños', 'Agua Potable', 'Áreas Verdes', 'Iluminación', 'Estudio / Biblioteca'].map((category) => (
                      <button key={category} onClick={() => setSelectedCategory(category)} className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-all text-left flex items-center justify-between cursor-pointer ${selectedCategory === category ? 'bg-blue-100 text-[#003B91]' : 'bg-transparent hover:bg-slate-100 text-slate-600'}`}>
                        <span>{category}</span>
                        {selectedCategory === category && <IconCheck className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left">
                <h3 className="font-bold text-slate-800 text-sm mb-4 border-b pb-2 flex items-center gap-2"><span>📊</span> Módulo de Datos</h3>
                <div className="space-y-4">
                  <div><span className="text-xs text-slate-500 block">Total de apoyos registrados</span><span className="text-2xl font-black text-[#003B91]">{metrics.totalVotes}</span></div>
                  <div><span className="text-xs text-slate-500 block">Propuestas en revisión</span><span className="text-2xl font-black text-amber-500">{metrics.inReview}</span></div>
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-600 block mb-2">Pareto de Necesidades (Votos)</span>
                    <div className="space-y-2">
                      {Object.entries(metrics.categoryCounts).map(([cat, val]) => (
                        <div key={cat}>
                          <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-0.5"><span>{cat}</span><span>{val} votos</span></div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-[#003B91] h-full" style={{ width: `${(val / (metrics.totalVotes || 1)) * 100}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2"><span>📌</span> {selectedCampus === 'Todos' ? 'Todas las propuestas' : `Propuestas de ${selectedCampus}`} <span className="text-xs bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-bold">{filteredProposals.length} activas</span></h3>
              </div>

              {filteredProposals.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 p-12 rounded-2xl text-center">
                  <span className="text-4xl block mb-3">🍃</span><h4 className="font-bold text-slate-700 mb-1">Sin propuestas activas</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">No encontramos ninguna iniciativa para este campus o categoría. ¡Anímate e inicia la primera propuesta para mejorar el campus!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProposals.map((prop) => {
                    const hasVoted = user ? (prop.voters?.includes(user.email) ?? false) : false;
                    const progressPercentage = Math.min(100, Math.round(((prop.votes || 0) / prop.target) * 100));

                    return (
                      <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all text-left relative overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-blue-50 text-[#003B91] text-[10px] font-black rounded-md uppercase border border-blue-100">{prop.campus}</span>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">{prop.category}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${prop.status === 'Logrado' ? 'bg-emerald-100 text-emerald-800' : prop.status === 'Enviado a Revisión' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-blue-100 text-[#003B91]'}`}>{prop.status}</span>
                            
                            {/* BOTÓN DE ELIMINAR (Solo dueño) */}
                            {user && user.email === prop.author && (
                              <button 
                                onClick={() => handleDeleteProposal(prop.id, prop.createdAt)}
                                className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-all cursor-pointer"
                                title="Eliminar propuesta (Límite 24h)"
                              >
                                <IconTrash className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 mb-4">{prop.title}</h4>

                        <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600">
                          <div><span className="font-bold text-[#003B91] block mb-1">🚨 Situación o Problema:</span><p className="leading-relaxed">{prop.problem}</p></div>
                          <div className="pt-2 border-t border-slate-200"><span className="font-bold text-emerald-600 block mb-1">💡 Propuesta de Solución:</span><p className="leading-relaxed">{prop.solution}</p></div>
                          <div className="pt-2 border-t border-slate-200"><span className="font-bold text-amber-600 block mb-1">👥 Beneficiarios directos:</span><p className="leading-relaxed">{prop.beneficiaries}</p></div>
                        </div>

                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                              <span>Progreso para envío de propuesta</span><span className="font-bold text-[#003B91]">{prop.votes} / {prop.target} apoyos</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-500 ${prop.status === 'Enviado a Revisión' ? 'bg-amber-400' : 'bg-[#003B91]'}`} style={{ width: `${progressPercentage}%` }} />
                            </div>
                          </div>
                          <button onClick={() => handleVote(prop.id)} className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${hasVoted ? 'bg-[#FFD100] text-[#003B91] ring-2 ring-[#FFD100]/50 font-black' : 'bg-[#003B91] hover:bg-blue-800 text-white'}`}>
                            <span>👍</span>{hasVoted ? 'Apoyado' : 'Apoyar'}
                          </button>
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center justify-between border-t pt-3">
                          <span>Propuesto por: <strong className="text-slate-500">Estudiante_{(prop.author || 'anonimo@uacj.mx').split('@')[0].toUpperCase()}</strong></span>
                          <span>Publicado el: {new Date(prop.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- CONTENIDO 3: ACERCA DEL PROYECTO (Sin cambios) --- */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm text-left max-w-2xl mx-auto space-y-6">
            <h3 className="font-extrabold text-xl text-slate-900">Sobre la Plataforma VocesUACJ</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Esta iniciativa nace del espíritu de innovación del Hackathon y el firme deseo de un estudiante de Ingeniería Industrial de contribuir de forma práctica y transparente a la mejora del entorno escolar de la <strong>Universidad Autónoma de Ciudad Juárez (UACJ)</strong>.</p>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm">Preguntas Frecuentes:</h4>
              <div className="border-l-4 border-[#003B91] pl-3"><h5 className="font-bold text-xs text-[#003B91]">¿La UACJ avala o administra esta página?</h5><p className="text-xs text-slate-600 mt-1">No, es un proyecto académico de desarrollo independiente...</p></div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs">CIVICTECH UACJ es un proyecto estudiantil académico independiente y libre de fines de lucro.</p>
          <p className="text-[10px] text-slate-500 mt-2">Desarrollado con compromiso cívico en Ciudad Juárez, Chihuahua. © {new Date().getFullYear()}</p>
        </div>
      </footer>

      {/* --- MODAL DE CREACIÓN --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-left relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <div className="flex items-center gap-2"><span className="text-xl">✍️</span><h3 className="font-black text-lg text-[#003B91]">Redactar Propuesta de Mejora</h3></div>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer">✕</button>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-4 flex items-start gap-2 text-xs text-[#003B91] font-semibold"><IconInfo className="w-5 h-5 shrink-0 text-blue-600" /><span>Para garantizar el nivel del debate, la plataforma estructurará tu propuesta con el estándar de ingeniería para la priorización de presupuestos.</span></div>
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Título de la propuesta <span className="text-xs text-slate-400 font-normal">({formTitle.length}/50 carac.)</span></label>
                <input type="text" maxLength={50} value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Ej: Instalar filtros purificadores..." className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003B91]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Campus / Instituto</label>
                  <select value={formCampus} onChange={(e) => setFormCampus(e.target.value)} className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003B91]">
                    <option value="IIT">IIT</option><option value="ICSA">ICSA</option><option value="ICB">ICB</option><option value="IADA">IADA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Categoría</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003B91]">
                    <option value="Baños">Baños</option><option value="Agua Potable">Agua Potable</option><option value="Áreas Verdes">Áreas Verdes</option><option value="Iluminación">Iluminación</option><option value="Estudio / Biblioteca">Estudio / Biblioteca</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">🚨 ¿Cuál es la situación actual o el problema?</label>
                <textarea rows={2} value={formProblem} onChange={(e) => setFormProblem(e.target.value)} placeholder="Describe de forma objetiva qué hace falta..." className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003B91]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">💡 ¿Cuál es tu propuesta de solución?</label>
                <textarea rows={2} value={formSolution} onChange={(e) => setFormSolution(e.target.value)} placeholder="Describe detalladamente qué cambios concretos propones..." className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003B91]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">👥 ¿A quiénes beneficia tu idea?</label>
                <input type="text" value={formBeneficiaries} onChange={(e) => setFormBeneficiaries(e.target.value)} placeholder="Ej: A los alumnos del turno nocturno..." className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003B91]" />
              </div>
              {formError && <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-rose-700 text-xs font-semibold flex items-start gap-2"><IconExclamation className="w-5 h-5 shrink-0 text-rose-500" /><span>{formError}</span></div>}
              <div className="pt-3 flex gap-3 justify-end border-t">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 transition-all text-slate-600 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#003B91] hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer">Publicar Propuesta Formal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
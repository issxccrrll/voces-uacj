import React from 'react';

export default function AvisoPrivacidad() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
        
        {/* Encabezado del Documento */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#003B91] mb-2">
            Aviso de Privacidad y Políticas de Moderación
          </h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Plataforma de Inteligencia Cívica - VocesUACJ
          </p>
        </div>
        
        {/* Contenido Legal */}
        <div className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
          
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">
              1. Identidad y Propósito
            </h3>
            <p>
              VocesUACJ recopila, analiza y gestiona propuestas de mejora para la infraestructura universitaria mediante un sistema de validación basada en datos y normatividad.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">
              2. Datos Personales Recabados
            </h3>
            <p className="mb-4">
              Utilizamos un modelo de autenticación segura (Passwordless). Solo recopilamos:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-[#003B91]">
              <li><strong className="text-slate-700">Correo Electrónico Institucional</strong> (para validar identidad).</li>
              <li><strong className="text-slate-700">Contenido de las propuestas</strong> y metadatos del sistema.</li>
            </ul>
            
            {/* Alerta de Seguridad Visual */}
            <div className="bg-blue-50 border-l-4 border-[#003B91] p-4 rounded-r-lg">
              <p className="text-sm text-[#003B91] m-0">
                <span className="font-bold">Seguridad Garantizada:</span> VocesUACJ no solicita ni almacena contraseñas bajo ninguna circunstancia.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">
              3. Política de Moderación y Reglas
            </h3>
            <p className="mb-4">
              Toda propuesta está sujeta a moderación. El usuario acepta que su propuesta será rechazada o su cuenta suspendida si incurre en:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <div>
                  <strong className="text-slate-800 block">Lenguaje Inapropiado:</strong>
                  <span>Groserías, insultos o discriminación.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <div>
                  <strong className="text-slate-800 block">Propuestas Falsas:</strong>
                  <span>Spam o proyectos absurdos.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-1">✗</span>
                <div>
                  <strong className="text-slate-800 block">Inviabilidad Normativa:</strong>
                  <span>Peticiones contrarias a la Ley Orgánica de la UACJ.</span>
                </div>
              </li>
            </ul>
          </section>
          
        </div>
      </div>
    </div>
  );
}
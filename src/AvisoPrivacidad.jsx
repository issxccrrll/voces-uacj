import React from 'react';

export default function AvisoPrivacidad() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <h2>Aviso de Privacidad y Políticas de Moderación</h2>
      <p><strong>Plataforma de Inteligencia Cívica - VocesUACJ</strong></p>
      
      <h3>1. Identidad y Propósito</h3>
      <p>VocesUACJ recopila, analiza y gestiona propuestas de mejora para la infraestructura universitaria mediante un sistema de validación basada en datos y normatividad.</p>

      <h3>2. Datos Personales Recabados</h3>
      <p>Utilizamos un modelo de autenticación segura (Passwordless). Solo recopilamos:</p>
      <ul>
        <li>Correo Electrónico Institucional (para validar identidad).</li>
        <li>Contenido de las propuestas y metadatos del sistema.</li>
      </ul>
      <p><em>VocesUACJ no solicita ni almacena contraseñas.</em></p>

      <h3>3. Política de Moderación y Reglas</h3>
      <p>Toda propuesta está sujeta a moderación. El usuario acepta que su propuesta será rechazada o su cuenta suspendida si incurre en:</p>
      <ul>
        <li><strong>Lenguaje Inapropiado:</strong> Groserías, insultos o discriminación.</li>
        <li><strong>Propuestas Falsas:</strong> Spam o proyectos absurdos.</li>
        <li><strong>Inviabilidad Normativa:</strong> Peticiones contrarias a la Ley Orgánica de la UACJ.</li>
      </ul>
    </div>
  );
}
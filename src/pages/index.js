'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-main">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">🏰 Bienvenido a Ahorros Kingdom</h1>
          <p className="text-xl text-blue-100 mb-8">
            Tu plataforma de ahorro comunitario. ¡Juntos alcanzaremos nuestras metas!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="btn-primary bg-white text-primary hover:bg-blue-50">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-16">
          ¿Cómo Funciona?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card text-center">
            <div className="text-5xl mb-4">👑</div>
            <h3 className="text-2xl font-bold text-primary mb-2">Comunidad</h3>
            <p className="text-text-secondary">
              Únete a nuestra exclusiva red de ahorradores gestionada por el Administrador.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-primary mb-2">Deposita</h3>
            <p className="text-text-secondary">
              Realiza depósitos presenciales. El administrador los registrará en el sistema.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-primary mb-2">Visualiza</h3>
            <p className="text-text-secondary">
              Monitorea tu progreso con gráficos interactivos y mensajes motivacionales.
            </p>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary mb-16">
            Planes Disponibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plan 1 */}
            <div className="card border-l-4 border-secondary">
              <h3 className="text-2xl font-bold text-secondary mb-2">🏕️ Campamento 2027</h3>
              <p className="text-text-secondary mb-4">
                Ahorra para disfrutar del campamento comunitario del año 2027.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>✓ Meta: Bs. 500</li>
                <li>✓ Depósitos mensuales</li>
                <li>✓ Eventos especiales</li>
                <li>✓ Recompensas finales</li>
              </ul>
            </div>

            {/* Plan 2 */}
            <div className="card border-l-4 border-accent">
              <h3 className="text-2xl font-bold text-accent mb-2">🎉 Otras Actividades</h3>
              <p className="text-text-secondary mb-4">
                Ahorra para participar en actividades y eventos de la comunidad.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>✓ Meta: Bs. 500</li>
                <li>✓ Flexibilidad de depósitos</li>
                <li>✓ Múltiples eventos</li>
                <li>✓ Mayor participación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-16">
          📋 Reglas del Programa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-bold text-primary mb-4">✅ Permitido</h3>
            <ul className="space-y-2 text-text-secondary">
              <li>✓ Depósitos en reuniones oficiales</li>
              <li>✓ Monitoreo de tu progreso</li>
              <li>✓ Cambiar el plan (con registro)</li>
              <li>✓ Visualizar historial completo</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-primary mb-4">❌ No Permitido</h3>
            <ul className="space-y-2 text-text-secondary">
              <li>✗ Editar depósitos personalmente</li>
              <li>✗ Retiros sin autorización</li>
              <li>✗ Depósitos fuera de reuniones</li>
              <li>✗ Depósitos menores a Bs. 5</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a nuestra comunidad de ahorro y alcanza tus metas.
          </p>
          <Link href="/register" className="btn-primary bg-white text-primary hover:bg-blue-50">
            Crear Cuenta Ahora
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Ahorros Kingdom. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

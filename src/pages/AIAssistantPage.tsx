/**
 * AI Assistant Page
 * Combined AI Chat and Document Analysis features
 * Migrated from medinsight-chatbot-medical with improved structure
 */
import { AIChatBox, DocumentAnalyzer } from '../components/ai';

export const AIAssistantPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <a href="/dashboard" className="hover:text-blue-600 transition-colors">Tableau de bord</a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Assistant IA Médical</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assistant IA Médical</h1>
          <p className="text-gray-600">
            Consultez notre IA médicale pour obtenir des informations et analysez vos documents
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: AI Chat */}
          <div className="lg:col-span-1">
            <AIChatBox />
          </div>

          {/* Right Column: Document Analyzer */}
          <div className="lg:col-span-1">
            <DocumentAnalyzer />
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">À propos de l'Assistant IA</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>Chat IA Médical :</strong> Posez des questions sur les symptômes, diagnostics, traitements et recommandations médicales. 
                  L'IA utilise des directives médicales à jour et une technologie RAG avancée.
                </p>
                <p>
                  <strong>Analyse de Documents :</strong> Téléchargez des documents PDF (ordonnances, bilans, rapports) pour une extraction automatique 
                  des informations via OCR et analyse par IA. L'IA identifie les entités médicales et fournit des recommandations.
                </p>
                <p className="text-xs text-blue-700 mt-3">
                  ⚠️ <strong>Avertissement :</strong> Cet assistant est un outil d'aide à la décision. Les informations fournies ne remplacent pas 
                  un avis médical professionnel. Toujours consulter un médecin qualifié pour les questions de santé.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Réponses Instantanées</h4>
            <p className="text-sm text-gray-600">
              Obtenez des réponses médicales en quelques secondes basées sur des sources fiables
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">OCR Avancé</h4>
            <p className="text-sm text-gray-600">
              Extraction automatique de texte depuis des documents scannés ou PDF
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Analyse Intelligente</h4>
            <p className="text-sm text-gray-600">
              Identification automatique des entités médicales et recommandations personnalisées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

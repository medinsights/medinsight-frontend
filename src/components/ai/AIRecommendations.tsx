/**
 * AI Recommendations Component
 * Display AI-powered medical recommendations for a patient
 */
import { useState, useEffect } from 'react';
import { getPatientRecommendations, type Patient } from '../../services/patient';

interface AIRecommendation {
  type: string;
  recommendation: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
  urgence?: string;
}

interface RecommendationsData {
  patient_id: string;
  score_risque?: number;
  alertes_critiques?: string[];
  alertes_surveillance?: string[];
  recommandations_traitements?: AIRecommendation[];
  recommandations_examens?: AIRecommendation[];
  recommandations_consultations?: AIRecommendation[];
  recommandations?: AIRecommendation[];
  generated_at: string;
  based_on?: string[];
}

interface AIRecommendationsProps {
  patient: Patient;
  patientId: string;
}

export const AIRecommendations = ({ patient, patientId }: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      fetchRecommendations();
    }
  }, [patientId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Loading recommendations for patient:', patientId);
      
      const data = await getPatientRecommendations(patientId);
      setRecommendations(data);
      
      console.log('✅ Recommendations loaded:', data);
    } catch (err) {
      console.error('❌ Error loading recommendations:', err);
      setError('Impossible de charger les recommandations');
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🔵';
      default: return '⚪';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 5) return 'bg-red-600';
    if (score >= 3) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Analyse du dossier en cours...</p>
          <p className="text-sm text-gray-500 mt-2">Génération des recommandations IA</p>
        </div>
      </div>
    );
  }

  if (error || !recommendations) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommandations indisponibles</h3>
          <p className="text-gray-600 mb-4">{error || 'Impossible de générer les recommandations'}</p>
          <button
            onClick={fetchRecommendations}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const allRecommendations = [
    ...(recommendations.recommandations_traitements || []),
    ...(recommendations.recommandations_examens || []),
    ...(recommendations.recommandations_consultations || []),
    ...(recommendations.recommandations || [])
  ];

  return (
    <div className="space-y-6">
      {/* Header with Risk Score */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🤖 Recommandations IA Personnalisées
            </h2>
            <p className="text-gray-600">
              Analyse basée sur les recommandations HAS/ANSM pour {patient.prenom} {patient.nom}
            </p>
            {recommendations.based_on && recommendations.based_on.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                📊 Sources: {recommendations.based_on.join(', ')}
              </p>
            )}
          </div>
          {recommendations.score_risque !== undefined && (
            <div className="text-center">
              <div className={`w-24 h-24 ${getRiskScoreColor(recommendations.score_risque)} rounded-full flex items-center justify-center`}>
                <span className="text-3xl font-bold text-white">{recommendations.score_risque}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2">Score de risque</p>
            </div>
          )}
        </div>
      </div>

      {/* Critical Alerts */}
      {recommendations.alertes_critiques && recommendations.alertes_critiques.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Alertes Critiques
          </h3>
          <ul className="space-y-3">
            {recommendations.alertes_critiques.map((alert, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-300">
                <span className="text-2xl">⚠️</span>
                <span className="text-red-900 flex-1">{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Surveillance Alerts */}
      {recommendations.alertes_surveillance && recommendations.alertes_surveillance.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Points de Surveillance
          </h3>
          <ul className="space-y-2">
            {recommendations.alertes_surveillance.map((alert, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-300">
                <span className="text-xl">👁️</span>
                <span className="text-yellow-900 flex-1">{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {allRecommendations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recommandations Médicales
          </h3>
          <div className="space-y-4">
            {allRecommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getPriorityIcon(rec.priority)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase px-2 py-1 bg-white rounded">
                        {rec.type}
                      </span>
                      <span className="text-xs font-semibold uppercase px-2 py-1 bg-white rounded">
                        {rec.priority}
                      </span>
                      {rec.urgence && (
                        <span className="text-xs font-semibold uppercase px-2 py-1 bg-white rounded">
                          {rec.urgence}
                        </span>
                      )}
                    </div>
                    <p className="font-medium mb-2">{rec.recommendation}</p>
                    {rec.reasoning && (
                      <p className="text-sm opacity-90">💡 {rec.reasoning}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Note importante :</strong> Ces recommandations sont générées par IA et doivent être validées par un professionnel de santé. 
            Elles ne remplacent pas le jugement clinique du médecin traitant.
          </span>
        </p>
        <p className="text-xs text-blue-700 mt-2">
          Dernière mise à jour: {new Date(recommendations.generated_at).toLocaleString('fr-FR')}
        </p>
      </div>
    </div>
  );
};

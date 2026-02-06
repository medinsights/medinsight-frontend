/**
 * Analysis History Component
 * Display patient's document analysis history with OCR results and AI insights
 */
import { useState, useEffect } from 'react';
import { getMedicalAnalysesByPatient, type MedicalAnalysis } from '../../services/medicalAnalyses';

interface AnalysisHistoryProps {
  patientId: string;
}

export const AnalysisHistory = ({ patientId }: AnalysisHistoryProps) => {
  const [analyses, setAnalyses] = useState<MedicalAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<MedicalAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      fetchAnalyses();
    }
  }, [patientId]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔍 Loading analyses for patient ${patientId}...`);
      
      const data = await getMedicalAnalysesByPatient(patientId);
      
      console.log('📦 Analyses received:', data);
      console.log('📏 Number:', data?.length || 0);
      
      setAnalyses(data || []);
    } catch (err: any) {
      console.error('❌ Error loading analyses:', err);
      setError(err.response?.data?.message || 'Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async (_analysisId: string) => {
    // TODO: Implement PDF export functionality
    // Could use jsPDF or backend endpoint
    alert('PDF export feature coming soon!');
  };

  if (!patientId) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">📋 Please select a patient</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading analysis history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load analyses</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalyses}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          📊 Analysis History - Patient #{patientId.slice(0, 8)}
        </h2>
        <button
          onClick={fetchAnalyses}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {analyses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses recorded</h3>
          <p className="text-gray-500 mb-4">
            Upload a PDF document in the "Analyse Documents" tab to start analyzing medical documents
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            📊 {analyses.length} analysis(es) found
          </p>

          {analyses.map((analysis) => (
            <div key={analysis.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Analysis Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    📄 {analysis.analysisType || 'Medical Document'}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      📅 {analysis.testDate ? new Date(analysis.testDate).toLocaleDateString('en-US') : 'Date not specified'}
                    </span>
                    <span className="flex items-center gap-1">
                      🕒 Created {analysis.createdAt ? new Date(analysis.createdAt).toLocaleString('en-US') : 'N/A'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      analysis.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      analysis.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {analysis.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => analysis.id && handleExportPDF(analysis.id)}
                  disabled={!analysis.id}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  title="Download PDF report"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
              </div>

              {/* Notes/Results Section */}
              {analysis.notes && (
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Clinical Notes:</h4>
                  <p className="text-sm text-gray-700">{analysis.notes}</p>
                </div>
              )}

              {/* Toggle Details Button */}
              <div className="px-6 py-3">
                <button
                  onClick={() => setSelectedAnalysis(
                    selectedAnalysis?.id === analysis.id ? null : analysis
                  )}
                  className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {selectedAnalysis?.id === analysis.id ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Hide details
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      View details
                    </>
                  )}
                </button>
              </div>

              {/* Expanded Details */}
              {selectedAnalysis?.id === analysis.id && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 space-y-4">
                  {/* Results */}
                  {analysis.results && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">📊 Analysis Results</h4>
                      <pre className="p-4 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {typeof analysis.results === 'string' 
                          ? analysis.results 
                          : JSON.stringify(analysis.results, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Notes */}
                  {analysis.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">📝 Clinical Notes</h4>
                      <p className="p-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                        {analysis.notes}
                      </p>
                    </div>
                  )}

                  {/* Status Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">📋 Analysis Type</h4>
                      <p className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                        {analysis.analysisType}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">🔄 Status</h4>
                      <p className="p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                        {analysis.status}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

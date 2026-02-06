/**
 * Patient Profile Page - Real Health Dashboard
 * Shows the authenticated user's own health data
 */
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getVitalSignsByPatient,
  getConsultationsByPatient,
  getTreatmentsByPatient,
  getMedicalAnalysesByPatient,
  type VitalSigns,
  type Consultation,
  type Treatment,
  type MedicalAnalysis,
} from '../services/patient';

const PatientProfilePageNew = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [analyses, setAnalyses] = useState<MedicalAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'treatments' | 'tests'>('overview');

  // Get user's patient ID from their user ID
  const patientId = user?.id || '';

  useEffect(() => {
    const loadData = async () => {
      if (!patientId) return;
      
      try {
        setLoading(true);
        const [vitalsData, consults, treats, analysesData] = await Promise.all([
          getVitalSignsByPatient(patientId).catch(() => []),
          getConsultationsByPatient(patientId).catch(() => []),
          getTreatmentsByPatient(patientId).catch(() => []),
          getMedicalAnalysesByPatient(patientId).catch(() => []),
        ]);
        
        setVitalSigns(vitalsData);
        setConsultations(consults);
        setTreatments(treats);
        setAnalyses(analysesData);
      } catch (error) {
        console.error('Error loading patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId]);

  const latestVitals = vitalSigns[0];
  const activeTreatments = treatments.filter(t => t.status === 'ACTIVE');
  const recentConsultations = consultations.slice(0, 3);
  const abnormalTests = analyses.filter(a => a.isAbnormal);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">MedInsights</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/ai-assistant')}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              🤖 AI Assistant
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.username}!</h2>
          <p className="text-gray-600">Here's your health overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Blood Pressure</span>
              <span className="text-2xl">🩺</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {latestVitals ? `${latestVitals.bloodPressureSystolic}/${latestVitals.bloodPressureDiastolic}` : '--/--'}
            </p>
            <p className="text-xs text-gray-500 mt-1">mmHg</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Heart Rate</span>
              <span className="text-2xl">❤️</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {latestVitals?.heartRate || '--'}
            </p>
            <p className="text-xs text-gray-500 mt-1">bpm</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Active Treatments</span>
              <span className="text-2xl">💊</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activeTreatments.length}</p>
            <p className="text-xs text-gray-500 mt-1">medications</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Consultations</span>
              <span className="text-2xl">🏥</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{consultations.length}</p>
            <p className="text-xs text-gray-500 mt-1">total</p>
          </div>
        </div>

        {/* Alerts */}
        {abnormalTests.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Abnormal Test Results</h3>
                <p className="text-sm text-red-700">
                  You have {abnormalTests.length} test result(s) that require attention. Please consult with your doctor.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'consultations', label: 'Consultations', icon: '🏥' },
                { id: 'treatments', label: 'Medications', icon: '💊' },
                { id: 'tests', label: 'Lab Tests', icon: '🧪' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Consultations</h3>
                  {recentConsultations.length === 0 ? (
                    <p className="text-gray-500">No consultations yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentConsultations.map(consult => (
                        <div key={consult.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{consult.reasonForVisit}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(consult.consultationDate).toLocaleDateString()}
                            </span>
                          </div>
                          {consult.diagnosis && (
                            <p className="text-sm text-gray-600"><strong>Diagnosis:</strong> {consult.diagnosis}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Active Medications</h3>
                  {activeTreatments.length === 0 ? (
                    <p className="text-gray-500">No active medications</p>
                  ) : (
                    <div className="space-y-3">
                      {activeTreatments.map(treatment => (
                        <div key={treatment.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900">{treatment.medicationName}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Dosage:</strong> {treatment.dosage} • <strong>Frequency:</strong> {treatment.frequency}
                          </p>
                          {treatment.startDate && (
                            <p className="text-xs text-gray-500 mt-2">
                              Started: {new Date(treatment.startDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'consultations' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">All Consultations</h3>
                {consultations.length === 0 ? (
                  <p className="text-gray-500">No consultations yet</p>
                ) : (
                  <div className="space-y-4">
                    {consultations.map(consult => (
                      <div key={consult.id} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-900 text-lg">{consult.reasonForVisit}</h4>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {new Date(consult.consultationDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {consult.symptoms && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                            <p className="text-sm text-gray-600">{consult.symptoms}</p>
                          </div>
                        )}

                        {consult.diagnosis && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Diagnosis:</p>
                            <p className="text-sm text-gray-600">{consult.diagnosis}</p>
                          </div>
                        )}

                        {consult.treatment && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Treatment:</p>
                            <p className="text-sm text-gray-600">{consult.treatment}</p>
                          </div>
                        )}

                        {consult.notes && (
                          <div className="bg-gray-50 rounded p-3 mt-3">
                            <p className="text-xs text-gray-700">{consult.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'treatments' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">All Medications & Treatments</h3>
                {treatments.length === 0 ? (
                  <p className="text-gray-500">No treatments prescribed yet</p>
                ) : (
                  <div className="space-y-4">
                    {treatments.map(treatment => (
                      <div key={treatment.id} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{treatment.medicationName}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {treatment.dosage} • {treatment.frequency}
                            </p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            treatment.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            treatment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {treatment.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Start Date:</p>
                            <p className="font-medium">{treatment.startDate ? new Date(treatment.startDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          {treatment.endDate && (
                            <div>
                              <p className="text-gray-600">End Date:</p>
                              <p className="font-medium">{new Date(treatment.endDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>

                        {treatment.indication && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">Indication:</p>
                            <p className="text-sm text-gray-600">{treatment.indication}</p>
                          </div>
                        )}

                        {treatment.sideEffects && (
                          <div className="mt-3 bg-yellow-50 rounded p-3">
                            <p className="text-sm font-medium text-yellow-900">Possible Side Effects:</p>
                            <p className="text-sm text-yellow-800">{treatment.sideEffects}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tests' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Laboratory Test Results</h3>
                {analyses.length === 0 ? (
                  <p className="text-gray-500">No test results available</p>
                ) : (
                  <div className="space-y-4">
                    {analyses.map(analysis => (
                      <div key={analysis.id} className={`border rounded-lg p-5 ${
                        analysis.isAbnormal ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{analysis.testName}</h4>
                            <p className="text-sm text-gray-600">{analysis.analysisType}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              analysis.isAbnormal ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {analysis.isAbnormal ? '⚠️ Abnormal' : '✓ Normal'}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(analysis.testDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {analysis.results && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700">Results:</p>
                            <p className="text-sm text-gray-900 font-mono bg-white rounded p-2 mt-1">
                              {typeof analysis.results === 'object' ? JSON.stringify(analysis.results, null, 2) : analysis.results}
                            </p>
                          </div>
                        )}

                        {analysis.interpretation && (
                          <div className="bg-white rounded p-3">
                            <p className="text-sm text-gray-700">{analysis.interpretation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientProfilePageNew;

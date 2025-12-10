/**
 * Patient Profile Page - Accessible to all authenticated users
 */
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const PatientProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Mock patient data
  const patientInfo = {
    bloodType: 'A+',
    allergies: ['Penicillin', 'Peanuts'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    height: '5\'10"',
    weight: '180 lbs',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4567',
    },
  };

  const appointments = [
    { date: '2025-12-15', time: '10:00 AM', doctor: 'Dr. Smith', type: 'Annual Checkup', status: 'Upcoming' },
    { date: '2025-11-20', time: '02:30 PM', doctor: 'Dr. Johnson', type: 'Follow-up', status: 'Completed' },
    { date: '2025-10-05', time: '09:15 AM', doctor: 'Dr. Williams', type: 'Consultation', status: 'Completed' },
  ];

  const medicalRecords = [
    { date: '2025-11-20', type: 'Lab Results', description: 'Blood work - Complete Metabolic Panel', provider: 'Dr. Johnson' },
    { date: '2025-10-05', type: 'Diagnosis', description: 'Type 2 Diabetes - Managed', provider: 'Dr. Williams' },
    { date: '2025-08-12', type: 'Prescription', description: 'Metformin 500mg - Twice daily', provider: 'Dr. Williams' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">HealthCare</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Admin Dashboard
              </button>
            )}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">{user?.username}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <div className="flex gap-4">
                <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-gray-600">Patient ID</p>
                  <p className="text-sm font-semibold text-gray-900">PAT-{user?.id?.toString().slice(0, 8)}</p>
                </div>
                <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-xs text-gray-600">Member Since</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-md">
                  <p className="text-xs text-gray-600">Blood Type</p>
                  <p className="text-sm font-semibold text-gray-900">{patientInfo.bloodType}</p>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-6">
              {['overview', 'appointments', 'records', 'medications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Height</span>
                      <span className="font-medium text-gray-900">{patientInfo.height}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium text-gray-900">{patientInfo.weight}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Blood Type</span>
                      <span className="font-medium text-gray-900">{patientInfo.bloodType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Name</span>
                      <span className="font-medium text-gray-900">{patientInfo.emergencyContact.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Relationship</span>
                      <span className="font-medium text-gray-900">{patientInfo.emergencyContact.relationship}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-medium text-gray-900">{patientInfo.emergencyContact.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {patientInfo.allergies.map((allergy, index) => (
                      <span key={index} className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full text-sm font-medium">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Book Appointment
                  </button>
                </div>
                <div className="space-y-4">
                  {appointments.map((apt, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">{apt.type}</p>
                          <p className="text-sm text-gray-600 mb-2">{apt.doctor}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {apt.time}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'Upcoming' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medical Records Tab */}
            {activeTab === 'records' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Medical Records</h3>
                <div className="space-y-4">
                  {medicalRecords.map((record, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{record.type}</p>
                            <p className="text-sm text-gray-600">{record.description}</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span>{record.date}</span>
                        <span>•</span>
                        <span>{record.provider}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medications Tab */}
            {activeTab === 'medications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Request Refill
                  </button>
                </div>
                <div className="space-y-3">
                  {patientInfo.medications.map((medication, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{medication}</p>
                          <p className="text-sm text-gray-500">Take with food</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientProfilePage;

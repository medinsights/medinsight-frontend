// frontend/src/components/patient/PatientChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import './PatientChat.css';

const PatientChat = ({ patient, patientId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [patientContext, setPatientContext] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, [patientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    // Charger le contexte patient
    await loadPatientContext();

    // Message de bienvenue
    const welcomeMessage = {
      role: 'assistant',
      content: `👋 Bonjour Docteur,

Je suis l'assistant IA spécialisé pour le suivi de **${patient.nom} ${patient.prenom}**.

J'ai accès à son dossier complet :
• Pathologies et antécédents
• Traitements en cours
• Analyses biologiques récentes
• Historique des consultations

Posez-moi vos questions sur ce patient, je vous fournirai des recommandations basées sur les guidelines HAS/ANSM et son dossier médical.`,
      timestamp: new Date().toISOString(),
      isContext: true
    };

    setMessages([welcomeMessage]);
  };

  const loadPatientContext = async () => {
    try {
      // Charger analyses
      const analysesRes = await fetch(`http://localhost:8000/api/patients/${patientId}/analyses`);
      const analyses = await analysesRes.json();

      // Charger traitements
      const traitementsRes = await fetch(`http://localhost:8000/api/patients/${patientId}/traitements`);
      const traitements = await traitementsRes.json();

      setPatientContext({
        patient: patient,
        analyses: analyses || [],
        traitements: traitements || []
      });
    } catch (error) {
      console.error('Erreur chargement contexte:', error);
    }
  };

  const buildContextPrompt = () => {
    if (!patientContext) return '';

    let context = `CONTEXTE PATIENT - ${patient.nom} ${patient.prenom}\n\n`;

    // Informations générales
    context += `📋 INFORMATIONS GÉNÉRALES:\n`;
    context += `- Âge: ${calculateAge(patient.date_naissance)} ans\n`;
    context += `- Sexe: ${patient.sexe === 'M' ? 'Masculin' : 'Féminin'}\n`;
    if (patient.pathologies_principales) {
      context += `- Pathologies: ${patient.pathologies_principales}\n`;
    }
    if (patient.allergies && patient.allergies !== 'Aucune allergie connue') {
      context += `- ⚠️ ALLERGIES: ${patient.allergies}\n`;
    }
    context += '\n';

    // Traitements actifs
    const traitementsActifs = patientContext.traitements.filter(t => t.statut === 'Actif');
    if (traitementsActifs.length > 0) {
      context += `💊 TRAITEMENTS EN COURS:\n`;
      traitementsActifs.forEach(t => {
        context += `- ${t.medicament} ${t.dosage}`;
        if (t.frequence) context += ` (${t.frequence})`;
        if (t.indication) context += ` - Indication: ${t.indication}`;
        context += '\n';
      });
      context += '\n';
    }

    // Dernières analyses
    if (patientContext.analyses.length > 0) {
      const lastAnalysis = patientContext.analyses[0];
      context += `🔬 DERNIÈRE ANALYSE (${lastAnalysis.date_analyse}):\n`;
      
      if (lastAnalysis.alertes && lastAnalysis.alertes.length > 0) {
        context += `⚠️ ALERTES:\n`;
        lastAnalysis.alertes.forEach(alerte => {
          context += `- ${alerte.parametre}: ${alerte.valeur} (Norme: ${alerte.norme})`;
          if (alerte.gravite) context += ` [${alerte.gravite}]`;
          context += '\n';
        });
      }
      context += '\n';
    }

    return context;
  };

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return '?';
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage = {
    role: 'user',
    content: input,
    timestamp: new Date().toISOString()
  };

  setMessages(prev => [...prev, userMessage]);
  const currentInput = input;
  setInput('');
  setIsLoading(true);

  try {
    console.log('📤 Envoi vers /api/chat/send avec patient_id:', patientId);
    
    // ✅ APPEL CORRIGÉ - Route /api/chat/send
    const response = await fetch('http://localhost:8000/api/chat/send', {  // ✅
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: currentInput,           // ✅ Message simple
        patient_id: parseInt(patientId)  // ✅ ID en nombre
      })
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Données reçues:', data);

    const assistantMessage = {
      role: 'assistant',
      content: data.response || "Pas de réponse",
      timestamp: new Date().toISOString(),
      patientContext: data.patient_context
    };

    setMessages(prev => [...prev, assistantMessage]);
    
  } catch (error) {
    console.error('❌ Erreur complète:', error);
    const errorMessage = {
      role: 'assistant',
      content: `❌ Erreur de connexion au serveur: ${error.message}`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    `Analyse du dernier bilan biologique et recommandations`,
    `Ajustement posologique des traitements en cours`,
    `Examens complémentaires à prescrire`,
    `Évaluation du risque cardiovasculaire`,
    `Orientation vers un spécialiste nécessaire ?`,
    `Interactions médicamenteuses à surveiller`
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="patient-chat">
      {/* Header avec contexte patient */}
      <div className="chat-header">
        <div className="patient-info-banner">
          <div className="patient-avatar-small">
            {patient.sexe === 'M' ? '👨' : '👩'}
          </div>
          <div className="patient-details-small">
            <h4>{patient.nom} {patient.prenom}</h4>
            <div className="quick-info">
              {patient.pathologies_principales && (
                <span className="info-tag">🏥 {patient.pathologies_principales}</span>
              )}
              {patient.allergies && patient.allergies !== 'Aucune allergie connue' && (
                <span className="info-tag alert">⚠️ {patient.allergies}</span>
              )}
            </div>
          </div>
        </div>
        <div className="context-indicator">
          <span className="indicator-dot"></span>
          <span>Contexte patient activé</span>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'assistant' ? '🤖' : '👨‍⚕️'}
            </div>
            <div className="message-bubble">
              <div className="message-content">
                {message.content}
              </div>
              {message.sources && message.sources.length > 0 && (
                <div className="message-sources">
                  <strong>📚 Sources :</strong>
                  <ul>
                    {message.sources.map((source, idx) => (
                      <li key={idx}>{source.source}</li>
                    ))}
                  </ul>
                </div>
              )}
              <span className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !isLoading && (
        <div className="chat-suggestions">
          <h5>💡 Questions suggérées :</h5>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Posez votre question sur ${patient.nom} ${patient.prenom}...`}
            rows="1"
            disabled={isLoading}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
        <div className="input-hint">
          <kbd>Entrée</kbd> pour envoyer • <kbd>Shift + Entrée</kbd> pour nouvelle ligne
        </div>
      </div>
    </div>
  );
};

export default PatientChat;
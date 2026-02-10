import React, { useState, useEffect, useRef } from 'react';
import { ChatbotService } from '../../services/chatbot.service';
import type { Patient } from '../../services/patient.service';
import type { ChatMessage } from '../../services/chatbot.service';

interface PatientChatProps {
  patient: Patient;
  patientId: string;
  onUpdate: () => void;
}

const PatientChat: React.FC<PatientChatProps> = ({ patient, patientId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: `👋 Bonjour Docteur,

Je suis l'assistant IA spécialisé pour le suivi de **${patient.nom} ${patient.prenom}**.

J'ai accès à son dossier complet :
• Pathologies et antécédents
• Traitements en cours
• Analyses biologiques récentes
• Historique des consultations

Posez-moi vos questions sur ce patient, je vous fournirai des recommandations basées sur les guidelines HAS/ANSM et son dossier médical.`,
      timestamp: new Date().toISOString()
    };

    setMessages([welcomeMessage]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const id = typeof patientId === 'string' ? parseInt(patientId) : patientId;
      
      const data = await ChatbotService.chat({
        message: currentInput,
        patient_id: id,
        use_rag: true
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || "Pas de réponse",
        timestamp: new Date().toISOString(),
        sources: data.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ Erreur de connexion au serveur: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    `Analyse du dernier bilan biologique et recommandations`,
    `Ajustement posologique des traitements en cours`,
    `Examens complémentaires à prescrire`,
    `Évaluation du risque cardiovasculaire`
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', background: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', padding: '20px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <div style={{ fontSize: '32px' }}>
            {patient.sexe === 'M' ? '👨' : '👩'}
          </div>
          <div>
            <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '18px' }}>{patient.nom} {patient.prenom}</h4>
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
              {patient.pathologies_principales && (
                <span style={{ background: '#3b82f6', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  🏥 {patient.pathologies_principales}
                </span>
              )}
              {patient.allergies && (typeof patient.allergies === 'string' ? patient.allergies !== 'Aucune allergie connue' : patient.allergies.length > 0) && (
                <span style={{ background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  ⚠️ {patient.allergies}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '14px' }}>
          <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
          <span>Contexte patient activé</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '32px', flexShrink: 0 }}>{message.role === 'assistant' ? '🤖' : '👨‍⚕️'}</div>
            <div style={{ 
              background: message.role === 'assistant' ? '#1e293b' : '#3b82f6',
              color: '#f1f5f9', padding: '15px', borderRadius: '12px', maxWidth: '80%',
              border: '1px solid ' + (message.role === 'assistant' ? '#334155' : '#2563eb')
            }}>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{message.content}</div>
              {message.sources && message.sources.length > 0 && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #334155' }}>
                  <strong style={{ color: '#94a3b8', fontSize: '14px' }}>📚 Sources :</strong>
                  <ul style={{ margin: '8px 0 0 20px', color: '#cbd5e1', fontSize: '14px' }}>
                    {message.sources.map((source, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{source}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
                {new Date(message.timestamp || new Date()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ fontSize: '32px' }}>🤖</div>
            <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8' }}>...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{ padding: '0 20px 10px 20px' }}>
          <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '10px' }}>💡 Suggestions :</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {suggestions.map((suggestion, idx) => (
              <button key={idx} onClick={() => setInput(suggestion)} style={{ 
                background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '8px',
                padding: '10px', fontSize: '13px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
              }}>{suggestion}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ background: '#1e293b', padding: '20px', borderTop: '1px solid #334155' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress} placeholder="Poser une question sur ce patient..."
            disabled={isLoading} style={{
              flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px',
              padding: '12px 16px', color: '#f1f5f9', fontSize: '15px', outline: 'none'
            }}
          />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} style={{
            background: input.trim() && !isLoading ? '#3b82f6' : '#334155',
            color: input.trim() && !isLoading ? 'white' : '#64748b', border: 'none', borderRadius: '8px',
            padding: '0 24px', fontSize: '15px', fontWeight: '600',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
          }}>
            {isLoading ? '...' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientChat;

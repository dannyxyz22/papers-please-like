import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { FaUser, FaGlobe, FaIdCard, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';

function App() {
  const [documentData, setDocumentData] = useState(null);
  const [rules, setRules] = useState(null);
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

  const fieldTranslations = {
    name: 'Nome',
    nationality: 'Nacionalidade',
    id: 'ID',
    expiration: 'Expiração',
    imageUrl: 'Imagem', // Although not a required field, good to have for consistency
  };

  const fetchNewDocument = useCallback(() => {
    setMessage(''); // Clear previous messages
    setMessageType('');
    fetch(`/api/document`)
      .then(response => response.json())
      .then(data => setDocumentData(data))
      .catch(error => console.error('Error fetching document:', error));
  }, []);

  const fetchRules = useCallback(() => {
    fetch(`/api/rules`)
      .then(response => response.json())
      .then(data => setRules(data))
      .catch(error => console.error('Error fetching rules:', error));
  }, []);

  useEffect(() => {
    fetchRules();
    fetchNewDocument();
  }, [fetchRules, fetchNewDocument]);

  

  const handleDecision = async (action) => {
    if (!documentData) return;

    try {
      const response = await fetch(`/api/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ document: documentData }),
      });
      const result = await response.json();

      
      if (action === 'approve' && result.isValid) {
        setMessage('Aprovado corretamente!');
        setMessageType('success');
      } else if (action === 'deny' && !result.isValid) {
        setMessage(`Negado corretamente! Razões: ${result.reasons.join(', ')}`);
        setMessageType('success');
      } else if (action === 'approve' && !result.isValid) {
        setMessage(`Erro: Aprovou um documento inválido! Razões: ${result.reasons.join(', ')}`);
        setMessageType('error');
      } else if (action === 'deny' && result.isValid) {
        setMessage('Erro: Negou um documento válido!');
        setMessageType('error');
      }

      setTimeout(() => {
        fetchNewDocument();
      }, 2000); // Give time to read the message

    } catch (error) {
      console.error('Error verifying document:', error);
      setMessage('Erro ao verificar documento.');
      setMessageType('error');
    }
  };

  if (!documentData || !rules) {
    return <div className="App">Carregando jogo...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Papers, Please - StefanoZ15</h1>
      </header>
      <main className="game-container">
        <div className="rules-book">
          <h2>Regras Atuais</h2>
          <p><strong>Nacionalidades Permitidas:</strong> {rules.validNationalities.join(', ')}</p>
          <p><strong>Expiração Mínima:</strong> {rules.expirationDate}</p>
          <p><strong>Campos Obrigatórios:</strong> {rules.requiredFields.map(field => fieldTranslations[field] || field).join(', ')}</p>
        </div>
        <div className="document-viewer">
          <h2>Documento do Cidadão</h2>
          {documentData.imageUrl && (
            <div className="citizen-image-container">
              <img src={documentData.imageUrl} alt="Citizen" className="citizen-image" />
            </div>
          )}
          <p><FaUser /> <strong>Nome:</strong> {documentData.name}</p>
          <p><FaGlobe /> <strong>Nacionalidade:</strong> {documentData.nationality}</p>
          <p><FaIdCard /> <strong>ID:</strong> {documentData.id}</p>
          <p><FaCalendarAlt /> <strong>Expiração:</strong> {documentData.expiration}</p>
        </div>
        {!message && (
          <div className="controls">
            <button className="approve-button" onClick={() => handleDecision('approve')}><FaCheck /> Aprovar</button>
            <button className="deny-button" onClick={() => handleDecision('deny')}><FaTimes /> Negar</button>
          </div>
        )}
        {message && <div className={`game-message ${messageType}`}>{message}</div>}
      </main>
    </div>
  );
}

export default App;
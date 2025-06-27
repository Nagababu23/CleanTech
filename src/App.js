import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPrediction('');
    setError('');

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      setError('');
      setPrediction('');

      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPrediction(response.data.prediction);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>♻️</div>
          <h1 style={styles.title}>CleanTech Waste Classifier</h1>
        </div>
        <p style={styles.subtitle}>AI-Powered Waste Classification for a Sustainable Future</p>
      </header>

      <main style={styles.mainContent}>
        <section style={styles.uploadSection}>
          <div style={styles.uploadBox}>
            <div style={styles.fileInputContainer}>
              <label style={styles.fileInputLabel}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={styles.fileInput}
                />
                {preview ? 'Change Image' : 'Select Waste Image'}
              </label>
              {selectedFile && (
                <p style={styles.fileName}>{selectedFile.name}</p>
              )}
            </div>

            {preview && (
              <div style={styles.previewContainer}>
                <img src={preview} alt="Preview" style={styles.preview} />
              </div>
            )}

            <button 
              onClick={handleUpload} 
              style={loading ? styles.buttonDisabled : styles.button}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.buttonContent}>
                  <span style={styles.spinner}></span> Analyzing...
                </span>
              ) : (
                'Classify Waste'
              )}
            </button>

            {error && (
              <div style={styles.errorContainer}>
                <p style={styles.errorText}>⚠️ {error}</p>
              </div>
            )}
          </div>
        </section>

        {prediction && (
          <section style={styles.resultSection}>
            <h2 style={styles.resultTitle}>Classification Result</h2>
            <div style={styles.resultCard}>
              <div style={styles.resultIcon}>🔬</div>
              <div>
                <p style={styles.resultLabel}>Detected Waste Type:</p>
                <p style={styles.predictionText}>{prediction}</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} CleanTech AI. All rights reserved.</p>
        <p style={styles.footerLinks}>
          <a href="#privacy" style={styles.footerLink}>Privacy Policy</a> | 
          <a href="#terms" style={styles.footerLink}>Terms of Service</a> | 
          <a href="#contact" style={styles.footerLink}>Contact Us</a>
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#333',
    lineHeight: 1.6,
  },
  header: {
    backgroundColor: '#2e7d32',
    color: 'white',
    padding: '2rem 1rem',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
  },
  logo: {
    fontSize: '2.5rem',
    marginRight: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    margin: 0,
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    margin: 0,
    fontWeight: '300',
  },
  mainContent: {
    flex: 1,
    padding: '2rem 1rem',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  },
  uploadSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    marginBottom: '2rem',
  },
  uploadBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  fileInputContainer: {
    marginBottom: '1.5rem',
    width: '100%',
    textAlign: 'center',
  },
  fileInputLabel: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    border: '1px dashed #ccc',
    ':hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  fileInput: {
    display: 'none',
  },
  fileName: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#666',
  },
  previewContainer: {
    margin: '1.5rem 0',
    width: '100%',
    maxWidth: '300px',
  },
  preview: {
    width: '100%',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  button: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    width: '100%',
    maxWidth: '200px',
    ':hover': {
      backgroundColor: '#1b5e20',
      transform: 'translateY(-1px)',
    },
  },
  buttonDisabled: {
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#cccccc',
    color: '#666666',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
    marginTop: '1rem',
    fontWeight: '500',
    width: '100%',
    maxWidth: '200px',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 1s ease-in-out infinite',
    marginRight: '8px',
  },
  errorContainer: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#ffebee',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  errorText: {
    color: '#c62828',
    margin: 0,
  },
  resultSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  resultTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginTop: 0,
    marginBottom: '1.5rem',
    color: '#2e7d32',
  },
  resultCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  resultIcon: {
    fontSize: '2rem',
    marginRight: '1.5rem',
  },
  resultLabel: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem',
  },
  predictionText: {
    margin: '0.25rem 0 0 0',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2e7d32',
    textTransform: 'capitalize',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '1.5rem',
    fontSize: '0.9rem',
  },
  footerLinks: {
    margin: '0.5rem 0 0 0',
  },
  footerLink: {
    color: 'white',
    textDecoration: 'none',
    margin: '0 0.5rem',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

export default App;
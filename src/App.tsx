import { useState, useEffect } from 'react';
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { 
  Terminal, 
  Bot, 
  ShoppingBag, 
  PlusCircle, 
  User, 
  Zap, 
  UploadCloud, 
  FileCode, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useMarketplaceContract } from './hooks/useMarketplaceContract';
import { Address } from '@ton/core';
import { Buffer } from 'buffer';

interface Skill {
  id: number;
  name: string;
  price: string;
  category: 'Termux' | 'AI' | 'General';
  icon: React.ReactNode;
  nftAddress: string;
  description: string;
  isUserListed?: boolean;
}

// Helper to generate a valid TON Address
const generateMockAddress = (): string => {
  const hash = Buffer.alloc(32);
  for (let i = 0; i < 32; i++) {
    hash[i] = Math.floor(Math.random() * 256);
  }
  const addr = new Address(0, hash);
  return addr.toString({ bounceable: true, urlSafe: true });
};

// --- CONFIGURACIÓN DE PRODUCTOS INICIALES ---
const INITIAL_SKILLS: Skill[] = [
  { 
    id: 1, 
    name: 'Termux Web Server', 
    price: '0.01', 
    category: 'Termux', 
    icon: <Terminal size={20} />, 
    nftAddress: 'EQCOsAsYMFi52GBzNbkUIwJwaW5DBL489oh5DOUJ1H75PCjw',
    description: 'Servidor web ultra ligero optimizado para correr directamente en Termux con NodeJS y soporte HTTPS local.'
  },
  { 
    id: 2, 
    name: 'Auto GPT Prompt', 
    price: '0.05', 
    category: 'AI', 
    icon: <Bot size={20} />, 
    nftAddress: 'EQDcEIR9aeOF1Op4Mi6EhNIkq1rDrkCOXdGPh-6YnTO2ClV3',
    description: 'Sistema de prompts avanzados para bots autónomos con memoria a largo plazo y ejecución recursiva.'
  },
  { 
    id: 3, 
    name: 'Termux SSH Setup', 
    price: '0.1', 
    category: 'Termux', 
    icon: <Terminal size={20} />, 
    nftAddress: 'EQAJGZ-Ar-cPGpYZ6jG79uca2CjpmaUEMkCRSJpvhq5uRc03',
    description: 'Script automatizado de configuración SSH segura con autenticación por par de claves y protección contra fuerza bruta.'
  },
  { 
    id: 4, 
    name: 'AI Image Generator', 
    price: '0.2', 
    category: 'AI', 
    icon: <Zap size={20} />, 
    nftAddress: 'EQBqK8J0ITWsckDoRAUYTKibso52dWox_mieQL4m3EO8iu68',
    description: 'Interfaz para generación de imágenes por IA en segundo plano conectada a modelos Stable Diffusion de baja latencia.'
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<'shop' | 'upload' | 'profile'>('shop');
  
  // Load skills from localStorage key stablecoincity_skills, or fallback to INITIAL_SKILLS
  const [skills, setSkills] = useState<Skill[]>(() => {
    try {
      const stored = localStorage.getItem('stablecoincity_skills');
      if (stored) {
        const parsed = JSON.parse(stored) as Skill[];
        return parsed.map(s => ({
          ...s,
          icon: s.category === 'Termux' ? <Terminal size={20} /> : s.category === 'AI' ? <Bot size={20} /> : <Zap size={20} />
        }));
      }
    } catch (e) {
      console.error("Error loading skills from localStorage", e);
    }
    return INITIAL_SKILLS;
  });

  const [activeCategory, setActiveCategory] = useState<'All' | 'Termux' | 'AI' | 'General'>('All');
  
  // Purchased skills state loaded from localStorage key stablecoincity_purchased
  const [purchasedAddresses, setPurchasedAddresses] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('stablecoincity_purchased');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Profile sub-tab selection: Mis Compras / Mis Ventas
  const [profileSubTab, setProfileSubTab] = useState<'purchases' | 'sales'>('purchases');

  // Custom listing/buying contracts hook
  const { buySkill, listSkill } = useMarketplaceContract();
  const [tonConnectUI] = useTonConnectUI();
  const walletAddress = useTonAddress();

  // Upload Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'Termux' | 'AI' | 'General'>('Termux');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'ipfs' | 'minting' | 'listing' | 'success'>('idle');

  // Diagnostics panel state
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Mount logic: initialize stablecoincity_files if not present
  useEffect(() => {
    const existingFiles = localStorage.getItem('stablecoincity_files');
    if (!existingFiles) {
      const mockFiles = {
        'EQCOsAsYMFi52GBzNbkUIwJwaW5DBL489oh5DOUJ1H75PCjw': {
          name: 'termux-web-server.sh',
          content: `#!/bin/bash\necho "Starting Termux Web Server..."\npkg install nodejs -y\nnpm install -g http-server\nhttp-server -p 8080 -S -C cert.pem -K key.pem\n`,
          size: 134
        },
        'EQDcEIR9aeOF1Op4Mi6EhNIkq1rDrkCOXdGPh-6YnTO2ClV3': {
          name: 'autogpt-prompt.txt',
          content: `[System Prompt]\nYou are Auto-GPT, an autonomous AI agent.\nYour goals are to browse the web, execute terminal commands, and save results.\nAlways analyze command output recursively before determining the next action.\n`,
          size: 202
        },
        'EQAJGZ-Ar-cPGpYZ6jG79uca2CjpmaUEMkCRSJpvhq5uRc03': {
          name: 'setup-ssh.sh',
          content: `#!/bin/bash\necho "Setting up SSH in Termux..."\npkg install openssh -y\nsshd\necho "SSH Server started on port 8022. Run 'whoami' to get your user."\n`,
          size: 147
        },
        'EQBqK8J0ITWsckDoRAUYTKibso52dWox_mieQL4m3EO8iu68': {
          name: 'ai-gen.py',
          content: `import requests\nimport json\nprint("Generating image with Stable Diffusion API...")\nresponse = requests.post("https://api.stablediffusion.local/v1/txt2img", json={"prompt": "beautiful futuristic cybercity, cyberpunk, 8k resolution"})\nwith open("output.png", "wb") as f:\n    f.write(response.content)\nprint("Image saved to output.png")\n`,
          size: 304
        }
      };
      localStorage.setItem('stablecoincity_files', JSON.stringify(mockFiles));
    }
  }, []);

  const filteredSkills = skills.filter(
    skill => activeCategory === 'All' || skill.category === activeCategory
  );

  const testSimpleTransfer = async () => {
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
            amount: '1000000',
          },
        ],
      };
      await tonConnectUI.sendTransaction(transaction);
      alert('✅ ¡Petición de prueba enviada!');
    } catch (e: any) {
      alert(`❌ Error: ${e.message}`);
    }
  };

  const checkManifest = async () => {
    try {
      const response = await fetch('/tonconnect-manifest.json');
      const manifest = await response.json();
      setDebugInfo(JSON.stringify(manifest, null, 2));
    } catch (e: any) {
      setDebugInfo(`Error: ${e.message}`);
    }
  };

  const handleDownloadScript = (skill: Skill) => {
    try {
      const existingFiles = localStorage.getItem('stablecoincity_files');
      const filesObj = existingFiles ? JSON.parse(existingFiles) : {};
      const fileData = filesObj[skill.nftAddress];
      
      if (!fileData) {
        alert('❌ Archivo de script no encontrado en el almacenamiento local.');
        return;
      }

      const blob = new Blob([fileData.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileData.name || 'script.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`❌ Error al descargar el script: ${err.message}`);
    }
  };

  const handleBuy = async (skill: Skill) => {
    if (!tonConnectUI.connected) {
      alert('❌ Wallet no conectada.');
      tonConnectUI.openModal();
      return;
    }

    if (purchasedAddresses.includes(skill.nftAddress)) {
      alert('❌ Este script ya ha sido comprado.');
      return;
    }
    
    try {
      await buySkill(skill.nftAddress, skill.price);
      
      const newPurchased = [...purchasedAddresses, skill.nftAddress];
      setPurchasedAddresses(newPurchased);
      localStorage.setItem('stablecoincity_purchased', JSON.stringify(newPurchased));

      alert('✅ Transacción enviada correctamente!');
    } catch (e: any) {
      alert(`❌ Error: ${e?.message || 'Error desconocido'}`);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tonConnectUI.connected) {
      alert('❌ Wallet no conectada.');
      tonConnectUI.openModal();
      return;
    }
    if (!name || !description || !price || !file) {
      alert('❌ Completa todos los campos.');
      return;
    }

    try {
      // Read the file as text first
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string || '');
        reader.onerror = () => reject(new Error('Error al leer el archivo.'));
        reader.readAsText(file);
      });

      setUploadState('ipfs');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadState('minting');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newNftAddress = generateMockAddress();
      setUploadState('listing');
      await listSkill(newNftAddress, price);

      // Save file data to stablecoincity_files in localStorage
      try {
        const existingFiles = localStorage.getItem('stablecoincity_files');
        const filesObj = existingFiles ? JSON.parse(existingFiles) : {};
        filesObj[newNftAddress] = {
          name: file.name,
          content: fileContent,
          size: file.size
        };
        localStorage.setItem('stablecoincity_files', JSON.stringify(filesObj));
      } catch (err) {
        console.error("Error saving file to localStorage stablecoincity_files:", err);
      }

      const newSkill: Skill = {
        id: Date.now(),
        name,
        price,
        category,
        icon: category === 'Termux' ? <Terminal size={20} /> : category === 'AI' ? <Bot size={20} /> : <Zap size={20} />,
        nftAddress: newNftAddress,
        description,
        isUserListed: true
      };

      setSkills(prev => {
        const next = [...prev, newSkill];
        // Strip icons before saving to localStorage to prevent circular refs/failures
        const forStorage = next.map(({ icon, ...rest }) => rest);
        localStorage.setItem('stablecoincity_skills', JSON.stringify(forStorage));
        return next;
      });

      setUploadState('success');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setName('');
      setDescription('');
      setPrice('');
      setCategory('Termux');
      setFile(null);
      setActiveTab('shop');
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setUploadState('idle');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      alert('📋 ¡Copiado!');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">StablecoinCity<span className="logo-dot">.</span></div>
        <TonConnectButton />
      </header>

      {activeTab === 'shop' && (
        <>
          <section className="hero">
            <h1>Skills de IA a &lt; $10</h1>
            <p>Marketplace descentralizado para Termux y Web 3.0</p>
          </section>

          <div className="category-tabs">
            {['All', 'Termux', 'AI', 'General'].map(cat => (
              <button 
                key={cat}
                className={`tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat as any)}
              >
                {cat === 'All' ? 'Todos' : cat === 'AI' ? 'IA Skills' : cat}
              </button>
            ))}
          </div>

          <main className="skills-grid">
            {filteredSkills.map(skill => (
              <div key={skill.id} className="skill-card">
                <div className="skill-card-header">
                  <div className="skill-icon">{skill.icon}</div>
                  <span className={`category-badge ${skill.category.toLowerCase()}`}>{skill.category}</span>
                </div>
                <div className="skill-name">{skill.name}</div>
                <p className="skill-desc">{skill.description}</p>
                <div className="skill-card-footer">
                  <div className="skill-price">{skill.price} TON</div>
                  <button className="buy-button" onClick={() => handleBuy(skill)}>Comprar</button>
                </div>
              </div>
            ))}
          </main>
        </>
      )}

      {activeTab === 'upload' && (
        <div className="upload-container">
          <div className="section-header">
            <Sparkles size={20} className="glow-icon" />
            <h2>Publicar Nueva Habilidad</h2>
          </div>
          
          <div className="economy-card">
            <h3 className="economy-title">Economía del Marketplace</h3>
            <div className="economy-list">
              <div className="economy-item">
                <div className="economy-item-main">
                  <span className="economy-label">Fee de listado</span>
                  <span className="economy-value">0.01 TON</span>
                </div>
                <p className="economy-desc">Se cobra de tu wallet al momento de listar el skill.</p>
              </div>
              <div className="economy-item">
                <div className="economy-item-main">
                  <span className="economy-label">Comisión de venta</span>
                  <span className="economy-value">5%</span>
                </div>
                <p className="economy-desc">Deducido automáticamente de cada venta y enviado a la wallet del administrador.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUploadSubmit} className="upload-form">
            <div className="form-group">
              <label className="form-label">Nombre del Script / Skill</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
            </div>
            <div className="form-row">
              <div className="form-group half">
                <label className="form-label">Precio en TON</label>
                <input type="number" step="0.0001" className="form-input" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              <div className="form-group half">
                <label className="form-label">Categoría</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value as any)} required>
                  <option value="Termux">Termux</option>
                  <option value="AI">AI</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subir Archivo de Script / Código (.sh, .py, .js, .json)</label>
              <div 
                className={`file-dropzone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input 
                  id="file-input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".sh,.py,.js,.json,.txt,.ts"
                />
                {file ? (
                  <div className="file-info-preview">
                    <FileCode size={36} className="file-icon" />
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="file-status">Listo para acuñar</div>
                  </div>
                ) : (
                  <div className="dropzone-placeholder">
                    <UploadCloud size={36} className="upload-icon" />
                    <p className="dropzone-text">Arrastra tu script aquí o <span>haz clic para examinar</span></p>
                    <span className="dropzone-subtext">Soporta scripts Bash, Python, JavaScript o JSON</span>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="submit-button">Crear y Listar NFT</button>
          </form>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="profile-container">
          <div className="profile-header">
            <div className="avatar-placeholder"><User size={32} /></div>
            <div className="profile-title-area">
              <h2>Mi Perfil</h2>
              <span className="network-badge">TON Blockchain</span>
            </div>
          </div>

          <div className="wallet-card-container">
            <h3>Billetera TON</h3>
            {walletAddress ? (
              <div className="wallet-connected-box">
                <div className="wallet-addr-display">
                  <span className="wallet-addr-label">Tu Dirección</span>
                  <span className="wallet-addr-value">{walletAddress}</span>
                </div>
                <div className="wallet-actions">
                  <button onClick={handleCopyAddress} className="wallet-action-btn">
                    <Copy size={14} /> Copiar
                  </button>
                  <a 
                    href={`https://tonviewer.org/${walletAddress}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="wallet-action-btn link"
                  >
                    <ExternalLink size={14} /> Explorador
                  </a>
                </div>
              </div>
            ) : (
              <div className="wallet-disconnected-box">
                <p>Conecta tu wallet para ver tu dirección y gestionar tus habilidades publicadas.</p>
                <button onClick={() => tonConnectUI.openModal()} className="wallet-connect-trigger-btn">
                  Conectar Wallet
                </button>
              </div>
            )}
          </div>

          <div className="user-skills-section">
            <div className="profile-sub-tabs">
              <button 
                type="button"
                className={`profile-sub-tab ${profileSubTab === 'purchases' ? 'active' : ''}`}
                onClick={() => setProfileSubTab('purchases')}
              >
                Mis Compras
              </button>
              <button 
                type="button"
                className={`profile-sub-tab ${profileSubTab === 'sales' ? 'active' : ''}`}
                onClick={() => setProfileSubTab('sales')}
              >
                Mis Ventas
              </button>
            </div>

            {profileSubTab === 'purchases' ? (
              <div className="profile-tab-content">
                {skills.filter(s => purchasedAddresses.includes(s.nftAddress)).length > 0 ? (
                  <div className="user-skills-list">
                    {skills.filter(s => purchasedAddresses.includes(s.nftAddress)).map(skill => (
                      <div key={skill.id} className="user-skill-item purchase-item">
                        <div className="user-skill-icon">{skill.icon}</div>
                        <div className="user-skill-info">
                          <div className="user-skill-name">{skill.name}</div>
                          <div className="user-skill-addr">{skill.nftAddress.slice(0, 10)}...{skill.nftAddress.slice(-8)}</div>
                        </div>
                        <button 
                          className="download-script-btn" 
                          onClick={() => handleDownloadScript(skill)}
                        >
                          Descargar Script
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-skills-box">
                    <p>Aún no has comprado ninguna habilidad.</p>
                    <button onClick={() => setActiveTab('shop')} className="go-to-upload-btn">
                      Ir a la Tienda <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="profile-tab-content">
                {skills.filter(s => s.isUserListed).length > 0 ? (
                  <div className="user-skills-list">
                    {skills.filter(s => s.isUserListed).map(skill => (
                      <div key={skill.id} className="user-skill-item">
                        <div className="user-skill-icon">{skill.icon}</div>
                        <div className="user-skill-info">
                          <div className="user-skill-name">{skill.name}</div>
                          <div className="user-skill-addr">{skill.nftAddress.slice(0, 10)}...{skill.nftAddress.slice(-8)}</div>
                        </div>
                        <div className="user-skill-price">{skill.price} TON</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-skills-box">
                    <p>No tienes habilidades publicadas en este momento.</p>
                    <button onClick={() => setActiveTab('upload')} className="go-to-upload-btn">
                      Publicar Habilidad <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="diagnostics-accordion">
            <button 
              type="button" 
              className="diagnostics-accordion-header"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
            >
              <Info size={16} /> <span>Panel de Diagnóstico</span> <ChevronRight size={16} className={`chevron ${showDiagnostics ? 'rotate' : ''}`} />
            </button>
            {showDiagnostics && (
              <div className="diagnostics-content">
                <div className="diagnostics-buttons">
                  <button onClick={checkManifest} className="diagnostic-btn">Verificar Manifest</button>
                  <button onClick={testSimpleTransfer} className="diagnostic-btn">Prueba Transferencia</button>
                </div>
                {debugInfo && <pre className="diagnostic-pre">{debugInfo}</pre>}
              </div>
            )}
          </div>
        </div>
      )}

      {uploadState !== 'idle' && (
        <div className="progress-overlay">
          <div className="progress-card">
            <h3>Preparando Habilidad</h3>
            <div className="progress-steps-list">
              <div className={`progress-step-item ${uploadState === 'ipfs' ? 'active' : ''} ${['minting', 'listing', 'success'].includes(uploadState) ? 'completed' : ''}`}>
                <div className="step-indicator">
                  {['minting', 'listing', 'success'].includes(uploadState) ? (
                    <CheckCircle2 size={18} className="icon-success" />
                  ) : uploadState === 'ipfs' ? (
                    <Loader2 size={18} className="animate-spin text-accent" />
                  ) : (
                    <span>1</span>
                  )}
                </div>
                <div className="step-content">
                  <span className="step-title">IPFS Upload</span>
                  <span className="step-desc">Subiendo código de agente a IPFS...</span>
                </div>
              </div>

              <div className={`progress-step-item ${uploadState === 'minting' ? 'active' : ''} ${['listing', 'success'].includes(uploadState) ? 'completed' : ''}`}>
                <div className="step-indicator">
                  {['listing', 'success'].includes(uploadState) ? (
                    <CheckCircle2 size={18} className="icon-success" />
                  ) : uploadState === 'minting' ? (
                    <Loader2 size={18} className="animate-spin text-accent" />
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <div className="step-content">
                  <span className="step-title">Blockchain Minting</span>
                  <span className="step-desc">Mintando NFT en TON Blockchain...</span>
                </div>
              </div>

              <div className={`progress-step-item ${uploadState === 'listing' ? 'active' : ''} ${uploadState === 'success' ? 'completed' : ''}`}>
                <div className="step-indicator">
                  {uploadState === 'success' ? (
                    <CheckCircle2 size={18} className="icon-success" />
                  ) : uploadState === 'listing' ? (
                    <Loader2 size={18} className="animate-spin text-accent" />
                  ) : (
                    <span>3</span>
                  )}
                </div>
                <div className="step-content">
                  <span className="step-title">Listing Smart Contract</span>
                  <span className="step-desc">Confirmando en tu Wallet...</span>
                </div>
              </div>
            </div>

            {uploadState === 'listing' && (
              <div className="wallet-prompt-hint animate-pulse">
                Por favor, abre tu billetera TON y confirma la transacción de listado.
              </div>
            )}

            {uploadState === 'success' && (
              <div className="success-banner">
                <CheckCircle2 size={42} className="success-large-icon" />
                <h4>¡Publicado con éxito!</h4>
                <p>El skill ya se encuentra visible en la tienda.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <div className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}><ShoppingBag size={20} /><span>Tienda</span></div>
        <div className={`nav-item ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}><PlusCircle size={20} /><span>Subir</span></div>
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={20} /><span>Perfil</span></div>
      </nav>
    </div>
  );
}

export default App;

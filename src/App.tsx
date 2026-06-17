import { useState } from 'react';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { Terminal, Bot, ShoppingBag, PlusCircle, User, Zap } from 'lucide-react';
import { useMarketplaceContract } from './hooks/useMarketplaceContract';

interface Skill {
  id: number;
  name: string;
  price: string;
  category: 'Termux' | 'AI' | 'General';
  icon: React.ReactNode;
  nftAddress: string;
}

// --- CONFIGURACIÓN DE PRODUCTOS ---
const MOCK_SKILLS: Skill[] = [
  { id: 1, name: 'Termux Web Server', price: '0.01', category: 'Termux', icon: <Terminal size={20} />, nftAddress: 'EQBvW8ZxyDxSnnSreDrAtBy_v6RAl8T9o659pWf0D9V9-6Zf' },
  { id: 2, name: 'Auto GPT Prompt', price: '0.05', category: 'AI', icon: <Bot size={20} />, nftAddress: 'EQC3_a7x-X8Y7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f' },
  { id: 3, name: 'Termux SSH Setup', price: '0.1', category: 'Termux', icon: <Terminal size={20} />, nftAddress: 'EQD9-i8h7g6f5e4d3c2b1a0Z9Y8X7W6V5U4T3S2R1Q0P9O8N' },
  { id: 4, name: 'AI Image Generator', price: '0.2', category: 'AI', icon: <Zap size={20} />, nftAddress: 'EQB4_v3u2t1s0r9q8p7o6n5m4l3k2j1i0h9g8f7e6d5c4b3a' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Termux' | 'AI'>('All');
  const { buySkill } = useMarketplaceContract();
  const [tonConnectUI] = useTonConnectUI();

  const filteredSkills = MOCK_SKILLS.filter(
    skill => activeCategory === 'All' || skill.category === activeCategory
  );

  const [debugInfo, setDebugInfo] = useState<string>('');

  const testSimpleTransfer = async () => {
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c', // Address 0
            amount: '1000000', // 0.001 TON
          },
        ],
      };
      alert('Enviando transferencia de prueba (0.001 TON a address 0)...');
      await tonConnectUI.sendTransaction(transaction);
      alert('✅ ¡Petición de prueba enviada con éxito!');
    } catch (e: any) {
      alert(`❌ Error en prueba: ${e.message}`);
    }
  };

  const checkManifest = async () => {
    try {
      const response = await fetch('/tonconnect-manifest.json');
      const manifest = await response.json();
      const currentOrigin = window.location.origin;
      
      let info = `🔍 --- DIAGNÓSTICO DE MANIFIESTO ---\n`;
      info += `• Origen del Navegador: ${currentOrigin}\n`;
      info += `• URL del Manifiesto: ${currentOrigin}/tonconnect-manifest.json\n\n`;
      info += `📄 Contenido del Manifiesto devuelto por el servidor:\n`;
      info += JSON.stringify(manifest, null, 2) + `\n\n`;
      
      const isHttps = currentOrigin.startsWith('https://');
      const isLocalhost = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');
      
      if (manifest.url !== currentOrigin) {
        info += `❌ DESAJUSTE DETECTADO:\nEl manifest.url ("${manifest.url}") no coincide con el origen del navegador ("${currentOrigin}").\n`;
        info += `Las wallets de TON rechazarán la conexión debido a esto.\n`;
      } else {
        info += `✅ El manifest.url coincide con el origen del navegador.\n`;
      }
      
      if (!isHttps && !isLocalhost) {
        info += `\n⚠️ ADVERTENCIA DE SEGURIDAD:\nEstás usando una conexión HTTP sin estar en localhost ("${currentOrigin}").\nLas wallets de TON (como Tonkeeper) exigen HTTPS para cargar manifiestos de dominios externos o IPs locales. Por favor, usa un túnel seguro (ej. ngrok con HTTPS) para probar en tu móvil.\n`;
      }
      
      setDebugInfo(info);
    } catch (e: any) {
      setDebugInfo(`❌ Error al leer el manifiesto: ${e.message}\nVerifica que el servidor esté corriendo y que el archivo esté accesible.`);
    }
  };

  const handleBuy = async (skill: Skill) => {
    if (!tonConnectUI.connected) {
      alert('❌ Wallet no conectada. Por favor, usa el botón de arriba para conectar.');
      tonConnectUI.openModal();
      return;
    }
    
    try {
      console.log('Iniciando compra de:', skill.name);
      const result = await buySkill(skill.nftAddress, skill.price);
      console.log('Resultado de compra:', result);
      alert('✅ Transacción enviada correctamente!');
    } catch (e: any) {
      console.error('Error en handleBuy:', e);
      // Mostrar un mensaje más descriptivo si es posible
      const errorMsg = e?.message || 'Error desconocido';
      alert(`❌ Error al realizar la compra: ${errorMsg}`);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">StablecoinCity</div>
        <TonConnectButton />
      </header>

      <section className="hero">
        <h1>Skills de IA a &lt; $10</h1>
        <p>Marketplace descentralizado para Termux y Web 3.0</p>
      </section>

      <div className="category-tabs">
        <button 
          className={`tab ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          Todos
        </button>
        <button 
          className={`tab ${activeCategory === 'Termux' ? 'active' : ''}`}
          onClick={() => setActiveCategory('Termux')}
        >
          Termux
        </button>
        <button 
          className={`tab ${activeCategory === 'AI' ? 'active' : ''}`}
          onClick={() => setActiveCategory('AI')}
        >
          IA Skills
        </button>
      </div>

      <main className="skills-grid">
        {filteredSkills.map(skill => (
          <div key={skill.id} className="skill-card">
            <div className="skill-icon">
              {skill.icon}
            </div>
            <div className="skill-name">{skill.name}</div>
            <div className="skill-price">{skill.price} TON</div>
            <button 
              className="buy-button"
              onClick={() => handleBuy(skill)}
            >
              Comprar
            </button>
          </div>
        ))}
      </main>

      <div style={{ padding: '20px', background: '#1a1a1a', margin: '10px', borderRadius: '10px', fontSize: '12px' }}>
        <h3>🛠 Diagnóstico</h3>
        <button onClick={checkManifest} style={{ padding: '5px 10px', marginRight: '10px' }}>Verificar Manifest</button>
        <button onClick={testSimpleTransfer} style={{ padding: '5px 10px' }}>Prueba Transferencia</button>
        {debugInfo && <pre style={{ marginTop: '10px', whiteSpace: 'pre-wrap', color: '#ffcc00' }}>{debugInfo}</pre>}
      </div>

      <div style={{ height: '70px' }}></div>

      <nav className="bottom-nav">
        <div className="nav-item active">
          <ShoppingBag size={20} />
          <span>Tienda</span>
        </div>
        <div className="nav-item">
          <PlusCircle size={20} />
          <span>Subir</span>
        </div>
        <div className="nav-item">
          <User size={20} />
          <span>Perfil</span>
        </div>
      </nav>
    </div>
  );
}

export default App;

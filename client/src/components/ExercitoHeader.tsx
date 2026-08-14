import { useLocation } from "wouter";
import { useState, useEffect, useRef } from 'react'
import logoHeader from "@assets/logoheader_1772976087386.webp";

export function ExercitoHeader({block_name = false, customTitle = null, customSubtitle = null}:any) {
  const [location, navigate] = useLocation();
  const [firstName, setFirstName] = useState<string>("Entrar")
  const [fullName, setFullName] = useState<string>("Entrar")
  const [hasUserData, setHasUserData] = useState<boolean>(false)
  
  useEffect(() => {
    if (!block_name) {
      const storedData = localStorage.getItem(`userData`);
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          const nomeCompleto = data.nomeCompleto || data.name || data.autoFilledData?.nome || '';
          if (nomeCompleto) {
            const nameParts = nomeCompleto.split(" ");
            setFirstName(nameParts[0].toUpperCase());
            const camelCaseFullName = nomeCompleto
              .split(' ')
              .map((name: any )=> name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
              .join(' ');
            setFullName(camelCaseFullName);
            setHasUserData(true);
          } else {
            setHasUserData(false);
          }
        } catch (e) {
          console.error("Erro ao processar dados do cliente:", e);
          setHasUserData(false);
        }
      } else {
        const userMedicalLogin = JSON.parse(localStorage.getItem('userMedicalLogin') || localStorage.getItem('userData') || '{}')

        if(!userMedicalLogin) {
          if(userMedicalLogin.name) {
            setFirstName(userMedicalLogin.name.split(" ")[0].toUpperCase());
            setFullName(userMedicalLogin.name);
            setHasUserData(true);
          }
        }else {
          setHasUserData(false);
        }
      }
    } else {
      setFirstName('Entrar');
      setHasUserData(false);
    }
  }, [block_name]);

  return (
    <>
    <header id="inscricoes" className="bg-white z-50 fixed w-full top-0">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button>
          <img 
            src={logoHeader} 
            alt="Gov.br - Segurança Pública" 
            className="h-[1.5rem] md:h-8" 
          />
        </button>

        <div className="flex items-center space-x-4">
          <button 
            className="text-[#1351b4] hover:text-[#0c326f] transition-colors cursor-default"
          >
            <i className="fas fa-ellipsis-v text-base"></i>
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <button 
            className="text-[#1351b4] hover:text-[#0c326f] transition-colors cursor-default"
          >
            <i className="fas fa-cookie-bite text-base"></i>
          </button>
          <button 
            className="text-[#1351b4] hover:text-[#0c326f] transition-colors cursor-default"
          >
            <i className="fas fa-adjust text-base"></i>
          </button>
          <button 
            className="text-[#1351b4] cursor-default"
          >
            <i className="fas fa-th text-base"></i>
          </button>
          <button 
            onClick={() => {
              if(hasUserData) {
                return;
              }

              navigate("/captura");
            }}
            className="text-white bg-[#1351b4] font-bold rounded-full px-4 py-2 text-base flex items-center cursor-default"
          >
            <i className="fas fa-user text-white mr-2 text-sm"></i>
            {firstName?.split(" ")[0]}
          </button>
        </div>
      </div>
    </header>

    <nav className="bg-white px-6 py-4 flex justify-between items-center mt-16">
      <button className="border-none text-[#1351b4] flex items-center cursor-default">
        <i className="fas fa-bars mr-3 text-lg"></i>
        <div className="flex flex-col" style={{
      textAlign: 'left'
        }}>
          <span className="text-[#333] text-2lg font-light">
            {customTitle || "INSS"}
          </span>
          <span className="text-[#333] text-lg font-light">
            {customSubtitle || "Concurso Público 2026"}
          </span>
        </div>
      </button>
    </nav>
    </>
  );
}

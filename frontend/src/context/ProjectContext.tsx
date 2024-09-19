import React, { createContext, useState, useContext } from 'react';

// Definindo o tipo do projeto que contém o id e o nome
interface SelectedProject {
  id: number;
  name: string;
}

// Definindo as propriedades do contexto
interface ProjectContextProps {
  selectedProject: SelectedProject | null;  // Pode ser null se nenhum projeto for selecionado
  setSelectedProject: React.Dispatch<React.SetStateAction<SelectedProject | null>>;  // Função para alterar o projeto selecionado
}

// Criando o contexto
const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

// Hook para acessar o contexto de forma mais simples
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext deve ser usado dentro de um ProjectProvider');
  }
  return context;
};

// Provedor do contexto, responsável por gerenciar o estado do projeto selecionado
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);  // Gerenciando o estado do projeto selecionado

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

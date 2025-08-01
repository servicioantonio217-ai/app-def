
import React, { useState, useCallback, useEffect } from 'react';
import { Module } from '../../types';
import { generateModuleContent } from '../../services/geminiService';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { ArrowLeftIcon, DownloadIcon } from '../icons';

interface ModuleDetailViewProps {
    module: Module;
    onBack: () => void;
}

const ModuleDetailView: React.FC<ModuleDetailViewProps> = ({ module, onBack }) => {
    const [content, setContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateModuleContent(module.title);
            setContent(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
        } finally {
            setIsLoading(false);
        }
    }, [module.title]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const renderFormattedContent = () => {
        if (!content) return null;
        return content.split('\n').map((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('•')) {
                return <li key={index} className="text-gray-300 ml-5">{trimmedLine.substring(1).trim()}</li>;
            }
             if (trimmedLine.length > 0 && (trimmedLine.endsWith(':') || !trimmedLine.includes('.'))) {
                return <h3 key={index} className="text-xl font-bold text-gray-100 mt-6 mb-2">{trimmedLine}</h3>
            }
            if (trimmedLine.length > 0) {
                 return <p key={index} className="text-gray-300 mb-2 leading-relaxed">{trimmedLine}</p>;
            }
            return null;
        });
    };

    return (
        <Card>
            <div className="p-4 sm:p-6">
                <button onClick={onBack} className="flex items-center gap-2 text-brand-red hover:text-red-400 font-semibold mb-6 transition-colors">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Volver al Dashboard
                </button>
                <h2 className="text-3xl font-bold text-gray-100 mb-4">{module.title}</h2>

                {module.videoUrl && (
                    <div className="mb-8 aspect-w-16 aspect-h-9">
                        <iframe
                            className="w-full h-full rounded-lg shadow-lg aspect-video"
                            src={module.videoUrl}
                            title={`Video para ${module.title}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
                
                {module.materials && module.materials.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-100 mb-4">Material de Estudio</h3>
                        <div className="space-y-3">
                            {module.materials.map((material, index) => (
                                <a 
                                    key={index}
                                    href={`data:${material.type};base64,${material.data}`} 
                                    download={material.name}
                                    className="bg-brand-gray-dark p-3 rounded-lg flex items-center justify-between hover:bg-gray-600 transition-colors"
                                >
                                    <span className="text-gray-200 font-medium">{material.name}</span>
                                    <DownloadIcon className="h-6 w-6 text-brand-red" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {isLoading && <Spinner />}
                {error && <p className="text-red-500 text-center my-4">{error}</p>}
                {content && (
                     <div className="prose max-w-none">
                        <h3 className="text-xl font-bold text-gray-100 mt-6 mb-2">Resumen del Módulo</h3>
                        <ul className="list-none p-0">
                            {renderFormattedContent()}
                        </ul>
                     </div>
                )}
            </div>
        </Card>
    );
};

export default ModuleDetailView;

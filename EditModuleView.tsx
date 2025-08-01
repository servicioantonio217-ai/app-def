
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Module, StudyMaterial } from '../../types';
import Card from '../common/Card';
import { iconMap, UploadIcon, TrashIcon } from '../icons';

interface EditModuleViewProps {
    onSave: (module: Module) => void;
    onCancel: () => void;
    existingModule: Module | null;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const EditModuleView: React.FC<EditModuleViewProps> = ({ onSave, onCancel, existingModule }) => {
    const [title, setTitle] = useState(existingModule?.title || '');
    const [description, setDescription] = useState(existingModule?.description || '');
    const [iconName, setIconName] = useState(existingModule?.iconName || 'BookOpenIcon');
    const [videoUrl, setVideoUrl] = useState(existingModule?.videoUrl || '');
    const [materials, setMaterials] = useState<StudyMaterial[]>(existingModule?.materials || []);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setError(null);
        const newMaterials: StudyMaterial[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit per file
                setError(`El archivo ${file.name} es muy grande. El límite es 5MB.`);
                continue;
            }
            const base64Data = await fileToBase64(file);
            newMaterials.push({
                name: file.name,
                type: file.type,
                data: base64Data.split(',')[1], // Remove the data URL prefix
            });
        }
        setMaterials(prev => [...prev, ...newMaterials]);
    };
    
    const removeMaterial = (index: number) => {
        setMaterials(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError("El título y la descripción son obligatorios.");
            return;
        }

        const moduleData: Module = {
            id: existingModule?.id || Date.now(),
            title,
            description,
            iconName,
            videoUrl,
            materials
        };
        onSave(moduleData);
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-4">
                    {existingModule ? 'Editar Módulo' : 'Crear Nuevo Módulo'}
                </h2>
                
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">Título del Módulo</label>
                    <input id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md text-white focus:ring-brand-red focus:border-brand-red" />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md text-white focus:ring-brand-red focus:border-brand-red" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="iconName" className="block text-sm font-medium text-gray-300">Icono</label>
                        <select id="iconName" value={iconName} onChange={e => setIconName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md text-white focus:ring-brand-red focus:border-brand-red">
                            {Object.keys(iconMap).map(name => <option key={name} value={name}>{name.replace('Icon', '')}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300">URL del Video de YouTube (Opcional)</label>
                        <input id="videoUrl" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md text-white focus:ring-brand-red focus:border-brand-red" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Material de Estudio</label>
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-brand-gray border-2 border-dashed border-gray-600 rounded-md flex justify-center items-center p-6 hover:border-brand-red transition-colors">
                        <div className="text-center">
                            <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                            <span className="mt-2 block text-sm font-semibold text-gray-300">Sube uno o más archivos</span>
                            <span className="block text-xs text-gray-500">PDF, DOCX, PNG, JPG, etc. hasta 5MB</span>
                        </div>
                        <input id="file-upload" type="file" multiple onChange={handleFileChange} className="sr-only" />
                    </label>
                </div>
                
                 {materials.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Archivos subidos:</h4>
                        {materials.map((material, index) => (
                            <div key={index} className="flex items-center justify-between bg-brand-gray-dark p-2 rounded">
                                <span className="text-gray-200 text-sm truncate">{material.name}</span>
                                <button type="button" onClick={() => removeMaterial(index)} className="p-1 text-gray-400 hover:text-brand-red"><TrashIcon className="h-4 w-4" /></button>
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="py-2 px-4 rounded-md text-sm font-medium text-gray-200 bg-brand-gray hover:bg-gray-600">Cancelar</button>
                    <button type="submit" className="py-2 px-4 rounded-md text-sm font-medium text-white bg-brand-red hover:bg-brand-red-dark">Guardar Módulo</button>
                </div>
            </form>
        </Card>
    );
};

export default EditModuleView;

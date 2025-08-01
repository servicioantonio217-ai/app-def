
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { User } from '../../types';
import Card from '../common/Card';
import { UserIcon } from '../icons';

interface EditProfileViewProps {
    user: User;
    onProfileUpdate: (updatedUser: User) => void;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onProfileUpdate }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate || '',
        nationality: user.nationality || '',
        profilePicture: user.profilePicture || '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB size limit
                setError("La imagen es muy grande. El límite es 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onProfileUpdate({ ...user, ...formData });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <div className="p-8">
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-2">
                    {user.firstName ? 'Editar Perfil' : 'Completa tu Perfil'}
                </h2>
                <p className="text-center text-gray-400 mb-8">
                    {user.firstName ? 'Actualiza tu información personal.' : '¡Bienvenido! Añade tus datos para empezar.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Perfil" className="h-32 w-32 rounded-full object-cover border-4 border-brand-red" />
                            ) : (
                                <div className="h-32 w-32 rounded-full bg-brand-gray flex items-center justify-center border-4 border-gray-600">
                                    <UserIcon className="h-16 w-16 text-gray-400" />
                                </div>
                            )}
                            <label htmlFor="profilePicture" className="absolute -bottom-2 -right-2 bg-brand-red text-white p-2 rounded-full cursor-pointer hover:bg-brand-red-dark transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                <input id="profilePicture" name="profilePicture" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} />
                            </label>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">Nombre</label>
                            <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Apellidos</label>
                            <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300">Fecha de Nacimiento</label>
                            <input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                        <div>
                            <label htmlFor="nationality" className="block text-sm font-medium text-gray-300">Nacionalidad</label>
                            <input id="nationality" name="nationality" type="text" value={formData.nationality} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md text-white focus:ring-brand-red focus:border-brand-red" />
                        </div>
                    </div>
                    
                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray-dark focus:ring-brand-red">
                            Guardar Perfil
                        </button>
                    </div>
                </form>
            </div>
        </Card>
    );
};

export default EditProfileView;

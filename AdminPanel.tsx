
import React, { useState, FormEvent } from 'react';
import { User, Module, Announcement } from '../../types';
import Card from '../common/Card';
import { UserIcon, EditIcon, TrashIcon, PlusIcon, iconMap, BookOpenIcon, MegaphoneIcon } from '../icons';

interface AdminPanelProps {
    users: User[];
    onSelectStudent: (user: User) => void;
    isPrimaryAdmin: boolean;
    onPromoteUser: (user: User) => void;
    modules: Module[];
    announcements: Announcement[];
    onEditModule: (module: Module | null) => void;
    onDeleteModule: (id: number) => void;
    onSaveAnnouncement: (content: string) => void;
    onDeleteAnnouncement: (id: string) => void;
}

const RoleBadge: React.FC<{ role: 'admin' | 'student' }> = ({ role }) => {
    const isAdmin = role === 'admin';
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isAdmin ? 'bg-brand-red text-white' : 'bg-gray-500 text-gray-100'}`}>
            {isAdmin ? 'Admin' : 'Estudiante'}
        </span>
    );
};

const StudentsPanel: React.FC<Omit<AdminPanelProps, 'modules' | 'announcements' | 'onEditModule' | 'onDeleteModule' | 'onSaveAnnouncement' | 'onDeleteAnnouncement'>> = ({ users, onSelectStudent, isPrimaryAdmin, onPromoteUser }) => {
    const students = users.filter(user => user.role === 'student');
    const admins = users.filter(user => user.role === 'admin');

    const renderUserList = (userList: User[], title: string) => (
        <>
            <h3 className="text-lg font-bold text-gray-100 mb-1">{title}</h3>
            <p className="text-sm text-gray-400 mb-6">Total: {userList.length}</p>
            <div className="space-y-4">
                {userList.map((user) => (
                    <div key={user.email} className="bg-brand-gray-dark p-3 rounded-lg flex items-center justify-between transition-all duration-200">
                        <div onClick={() => user.role === 'student' && onSelectStudent(user)} className={`flex items-center gap-4 flex-grow ${user.role === 'student' ? 'cursor-pointer' : ''}`}>
                            {user.profilePicture ? <img src={user.profilePicture} alt="Perfil" className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-brand-gray flex items-center justify-center"><UserIcon className="h-6 w-6 text-gray-400" /></div>}
                            <div>
                                <p className="font-semibold text-gray-100">{user.firstName || 'Usuario'} {user.lastName || ''}</p>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {isPrimaryAdmin && user.role === 'student' && (
                                <button onClick={(e) => { e.stopPropagation(); if(window.confirm(`¿Seguro que quieres promover a ${user.email}?`)) { onPromoteUser(user); } }} className="text-xs bg-red-800 text-white font-bold py-1 px-3 rounded-full hover:bg-brand-red transition-colors" title="Promover a Administrador">Promover</button>
                            )}
                            <RoleBadge role={user.role} />
                        </div>
                    </div>
                ))}
                {userList.length === 0 && <p className="text-center text-gray-500 py-4">No hay usuarios en esta categoría.</p>}
            </div>
        </>
    );

    return (
        <div className="space-y-8">
            {renderUserList(students, 'Estudiantes Registrados')}
            {renderUserList(admins, 'Administradores')}
        </div>
    );
};

const ModulesPanel: React.FC<{ modules: Module[], onEditModule: (module: Module | null) => void, onDeleteModule: (id: number) => void }> = ({ modules, onEditModule, onDeleteModule }) => {
    const IconComponent = ({ iconName }: { iconName: string }) => {
        const Icon = iconMap[iconName] || BookOpenIcon;
        return <Icon className="h-6 w-6 text-brand-red" />;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-100">Módulos de Estudio</h3>
                    <p className="text-sm text-gray-400">Gestiona el contenido de aprendizaje.</p>
                </div>
                <button onClick={() => onEditModule(null)} className="flex items-center gap-2 bg-brand-red text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-red-dark transition-colors">
                    <PlusIcon className="h-5 w-5" />
                    Crear Módulo
                </button>
            </div>
            <div className="space-y-4">
                {modules.map(module => (
                    <div key={module.id} className="bg-brand-gray-dark p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <IconComponent iconName={module.iconName} />
                            <div>
                                <p className="font-semibold text-gray-100">{module.title}</p>
                                <p className="text-sm text-gray-400">{module.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onEditModule(module)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md"><EditIcon className="h-5 w-5" /></button>
                            <button onClick={() => onDeleteModule(module.id)} className="p-2 text-gray-300 hover:text-brand-red hover:bg-gray-600 rounded-md"><TrashIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                ))}
                {modules.length === 0 && <p className="text-center text-gray-500 py-4">No hay módulos creados.</p>}
            </div>
        </div>
    );
};

const AnnouncementsPanel: React.FC<{ announcements: Announcement[], onSaveAnnouncement: (content: string) => void, onDeleteAnnouncement: (id: string) => void }> = ({ announcements, onSaveAnnouncement, onDeleteAnnouncement }) => {
    const [newAnnouncement, setNewAnnouncement] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (newAnnouncement.trim()) {
            onSaveAnnouncement(newAnnouncement.trim());
            setNewAnnouncement('');
        }
    };

    return (
        <div>
            <h3 className="text-lg font-bold text-gray-100 mb-4">Anuncios y Notas</h3>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    placeholder="Escribe una nueva nota o anuncio..."
                    className="flex-grow px-3 py-2 bg-brand-gray-dark border border-gray-600 rounded-md text-white focus:ring-brand-red focus:border-brand-red"
                />
                <button type="submit" className="bg-brand-red text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-red-dark transition-colors">Publicar</button>
            </form>
            <div className="space-y-3">
                {announcements.map(ann => (
                    <div key={ann.id} className="bg-brand-gray-dark p-3 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-gray-200">{ann.content}</p>
                            <p className="text-xs text-gray-500">{new Date(ann.date).toLocaleString()}</p>
                        </div>
                        <button onClick={() => onDeleteAnnouncement(ann.id)} className="p-2 text-gray-400 hover:text-brand-red rounded-md"><TrashIcon className="h-5 w-5" /></button>
                    </div>
                ))}
                 {announcements.length === 0 && <p className="text-center text-gray-500 py-4">No hay anuncios publicados.</p>}
            </div>
        </div>
    );
};

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'students' | 'modules' | 'announcements'>('students');

    const renderPanelContent = () => {
        switch (activeTab) {
            case 'students':
                return <StudentsPanel {...props} />;
            case 'modules':
                return <ModulesPanel {...props} />;
            case 'announcements':
                return <AnnouncementsPanel {...props} />;
            default:
                return null;
        }
    };
    
    const getTabClass = (tabName: 'students' | 'modules' | 'announcements') => {
        return activeTab === tabName
            ? 'border-brand-red text-white bg-brand-gray'
            : 'border-transparent text-gray-400 hover:text-white hover:bg-brand-gray-dark';
    };

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Panel de Administrador</h2>
            <Card>
                <div className="border-b border-gray-700">
                    <nav className="-mb-px flex space-x-1 sm:space-x-4 px-4" aria-label="Tabs">
                        <button onClick={() => setActiveTab('students')} className={`whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors ${getTabClass('students')}`}>Estudiantes</button>
                        <button onClick={() => setActiveTab('modules')} className={`whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors ${getTabClass('modules')}`}>Módulos</button>
                        <button onClick={() => setActiveTab('announcements')} className={`whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors ${getTabClass('announcements')}`}>Anuncios</button>
                    </nav>
                </div>
                <div className="p-4 sm:p-6">
                    {renderPanelContent()}
                </div>
            </Card>
        </div>
    );
};

export default AdminPanel;

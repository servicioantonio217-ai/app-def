
import React, { useState, useEffect } from 'react';
import { AppView, ExamAttempt, Module, User, Announcement } from './types';
import DashboardView from './components/dashboard/DashboardView';
import ModuleDetailView from './components/clases/ModuleDetailView';
import ExamSimulatorView from './components/exam/ExamSimulatorView';
import ExamReviewView from './components/exam/ExamReviewView';
import AuthView from './components/auth/AuthView';
import EditProfileView from './components/profile/EditProfileView';
import StudentDetailView from './components/admin/StudentDetailView';
import EditModuleView from './components/modules/EditModuleView';
import { BookOpenIcon, FileTextIcon, ClipboardCheckIcon } from './components/icons';

const initialModules: Module[] = [
    { id: 1, title: "Módulo 1: Fundamentos de Historia", description: "Explora los eventos clave de la historia mundial.", iconName: 'BookOpenIcon' },
    { id: 2, title: "Módulo 2: Principios de la Ciencia", description: "Descubre los conceptos básicos de la física y biología.", iconName: 'FileTextIcon', videoUrl: "https://www.youtube.com/embed/zMYRU4S_C0o" },
    { id: 3, title: "Módulo 3: Geografía Global", description: "Aprende sobre los continentes, climas y culturas.", iconName: 'ClipboardCheckIcon' },
];

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [authReady, setAuthReady] = useState(false);
    const [isPrimaryAdmin, setIsPrimaryAdmin] = useState(false);
    
    const [currentView, setCurrentView] = useState<AppView>('dashboard');
    const [lastAttempt, setLastAttempt] = useState<ExamAttempt | null>(null);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

    // Dynamic Content State
    const [modules, setModules] = useState<Module[]>(() => {
        const savedModules = localStorage.getItem('modulesDB');
        return savedModules ? JSON.parse(savedModules) : initialModules;
    });

    const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
        const savedAnnouncements = localStorage.getItem('announcementsDB');
        return savedAnnouncements ? JSON.parse(savedAnnouncements) : [];
    });

    useEffect(() => {
        localStorage.setItem('modulesDB', JSON.stringify(modules));
    }, [modules]);

    useEffect(() => {
        localStorage.setItem('announcementsDB', JSON.stringify(announcements));
    }, [announcements]);


    useEffect(() => {
        try {
            const loggedInUserJSON = localStorage.getItem('currentUser');
            if (loggedInUserJSON) {
                const loggedInUser = JSON.parse(loggedInUserJSON);
                const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
                
                if (usersDB.length > 0 && loggedInUser.email === usersDB[0].email) {
                    setIsPrimaryAdmin(true);
                }

                setCurrentUser(loggedInUser);

                if (loggedInUser.role === 'admin') {
                    setAllUsers(usersDB);
                }
            }
        } catch (error) {
            console.error("Error al leer el usuario del localStorage", error);
            localStorage.removeItem('currentUser');
        } finally {
            setAuthReady(true);
        }
    }, []);

    const handleLoginSuccess = (user: User, isNewUser: boolean) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        
        const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
        if (usersDB.length > 0 && user.email === usersDB[0].email) {
            setIsPrimaryAdmin(true);
        } else {
            setIsPrimaryAdmin(false);
        }

        if (user.role === 'admin') {
             setAllUsers(usersDB);
        }
        if (isNewUser) {
            setCurrentView('editProfile');
        } else {
            setCurrentView('dashboard');
        }
    };
    
    const handleProfileUpdate = (updatedUser: User) => {
        try {
            const usersDB: User[] = JSON.parse(localStorage.getItem('usersDB') || '[]');
            const userIndex = usersDB.findIndex((u) => u.email === updatedUser.email);
            if (userIndex !== -1) {
                usersDB[userIndex] = updatedUser;
                localStorage.setItem('usersDB', JSON.stringify(usersDB));
                if (updatedUser.role === 'admin') {
                    setAllUsers(usersDB);
                }
            }
        } catch (error) {
            console.error("Error al actualizar la base de datos de usuarios:", error);
        }

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setAllUsers([]);
        setIsPrimaryAdmin(false);
        setCurrentView('dashboard');
    };

    const handleExamComplete = (attempt: ExamAttempt) => {
        if (!currentUser) return;

        const attemptWithDate: ExamAttempt = { ...attempt, date: new Date().toISOString() };
        
        try {
            const usersDB: User[] = JSON.parse(localStorage.getItem('usersDB') || '[]');
            const userIndex = usersDB.findIndex(u => u.email === currentUser.email);
            
            if (userIndex !== -1) {
                if (!usersDB[userIndex].examHistory) {
                    usersDB[userIndex].examHistory = [];
                }
                usersDB[userIndex].examHistory!.push(attemptWithDate);
                localStorage.setItem('usersDB', JSON.stringify(usersDB));
                
                const updatedCurrentUser = { ...currentUser, examHistory: usersDB[userIndex].examHistory };
                localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
                setCurrentUser(updatedCurrentUser);

                if (currentUser.role === 'admin') {
                    setAllUsers(usersDB);
                }
            }
        } catch (error) {
            console.error("Error al actualizar el historial de exámenes:", error);
        }

        setLastAttempt(attemptWithDate);
        setCurrentView('review');
    };

    const handlePromoteUser = (userToPromote: User) => {
        if (!isPrimaryAdmin) return;

        try {
            const usersDB: User[] = JSON.parse(localStorage.getItem('usersDB') || '[]');
            const userIndex = usersDB.findIndex((u) => u.email === userToPromote.email);

            if (userIndex !== -1) {
                usersDB[userIndex].role = 'admin';
                localStorage.setItem('usersDB', JSON.stringify(usersDB));
                setAllUsers([...usersDB]); 
            }
        } catch (error) {
            console.error("Error al promover usuario:", error);
        }
    };
    
    // Module and Announcement Handlers
    const handleSaveModule = (moduleToSave: Module) => {
        setModules(prevModules => {
            const existingIndex = prevModules.findIndex(m => m.id === moduleToSave.id);
            if (existingIndex !== -1) {
                const updatedModules = [...prevModules];
                updatedModules[existingIndex] = moduleToSave;
                return updatedModules;
            } else {
                return [...prevModules, moduleToSave];
            }
        });
        setCurrentView('dashboard');
    };

    const handleDeleteModule = (moduleId: number) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este módulo?")) {
            setModules(prevModules => prevModules.filter(m => m.id !== moduleId));
        }
    };

    const handleSaveAnnouncement = (content: string) => {
        const newAnnouncement: Announcement = {
            id: Date.now().toString(),
            content,
            date: new Date().toISOString(),
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
    };

    const handleDeleteAnnouncement = (announcementId: string) => {
        setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    };

    const handleEditModule = (module: Module | null) => {
        setModuleToEdit(module);
        setCurrentView('editModule');
    };

    const handleGoToDashboard = () => {
        setCurrentView('dashboard');
        setSelectedModule(null);
        setSelectedStudent(null);
        setModuleToEdit(null);
    };
    
    const handleSelectModule = (module: Module) => {
        setSelectedModule(module);
        setCurrentView('module');
    };

    const handleStartExam = () => {
        setCurrentView('exam');
    };
    
    const handleGoToReview = () => {
        if (lastAttempt) {
            setCurrentView('review');
        }
    };
    
    const handleGoToEditProfile = () => {
        setCurrentView('editProfile');
    };

    const handleSelectStudent = (student: User) => {
        setSelectedStudent(student);
        setCurrentView('studentDetail');
    };

    const renderContent = () => {
        if (!authReady) {
            return null;
        }

        if (!currentUser) {
            return <AuthView onLoginSuccess={handleLoginSuccess} />;
        }

        switch (currentView) {
            case 'editProfile':
                 return <EditProfileView user={currentUser} onProfileUpdate={handleProfileUpdate} />;
            case 'editModule':
                return <EditModuleView onSave={handleSaveModule} onCancel={handleGoToDashboard} existingModule={moduleToEdit} />;
            case 'module':
                return selectedModule && <ModuleDetailView module={selectedModule} onBack={handleGoToDashboard} />;
            case 'exam':
                return <ExamSimulatorView onExamComplete={handleExamComplete} onBack={handleGoToDashboard} />;
            case 'review':
                return <ExamReviewView attempt={lastAttempt} onBack={handleGoToDashboard} />;
            case 'studentDetail':
                return selectedStudent && <StudentDetailView student={selectedStudent} onBack={handleGoToDashboard} />;
            case 'dashboard':
            default:
                return (
                    <DashboardView
                        currentUser={currentUser}
                        onLogout={handleLogout}
                        lastAttempt={lastAttempt}
                        onSelectModule={handleSelectModule}
                        onStartExam={handleStartExam}
                        onGoToReview={handleGoToReview}
                        onEditProfile={handleGoToEditProfile}
                        allUsers={allUsers}
                        onSelectStudent={handleSelectStudent}
                        isPrimaryAdmin={isPrimaryAdmin}
                        onPromoteUser={handlePromoteUser}
                        modules={modules}
                        announcements={announcements}
                        onEditModule={handleEditModule}
                        onDeleteModule={handleDeleteModule}
                        onSaveAnnouncement={handleSaveAnnouncement}
                        onDeleteAnnouncement={handleDeleteAnnouncement}
                    />
                );
        }
    };

    return (
        <div className="font-sans bg-brand-black min-h-screen">
             <main className="p-4 sm:p-6 lg:p-8">
                 <div className="max-w-4xl mx-auto">
                    {renderContent()}
                 </div>
            </main>
        </div>
    );
};

export default App;

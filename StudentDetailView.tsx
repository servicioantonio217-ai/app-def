
import React from 'react';
import { User } from '../../types';
import Card from '../common/Card';
import { ArrowLeftIcon, UserIcon } from '../icons';

interface StudentDetailViewProps {
    student: User;
    onBack: () => void;
}

const StudentDetailView: React.FC<StudentDetailViewProps> = ({ student, onBack }) => {
    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-brand-red hover:text-red-400 font-semibold mb-6 transition-colors">
                <ArrowLeftIcon className="h-5 w-5" />
                Volver al Panel
            </button>

            <Card>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-gray-700 pb-6">
                        {student.profilePicture ? (
                            <img src={student.profilePicture} alt="Perfil" className="h-24 w-24 rounded-full object-cover border-4 border-brand-red" />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-brand-gray flex items-center justify-center border-4 border-gray-600">
                                <UserIcon className="h-12 w-12 text-gray-400" />
                            </div>
                        )}
                        <div className="text-center sm:text-left">
                            <h2 className="text-3xl font-bold text-gray-100">{student.firstName || 'Estudiante'} {student.lastName || ''}</h2>
                            <p className="text-gray-400">{student.email}</p>
                            <p className="text-sm text-gray-500 mt-1">Rol: <span className="font-semibold text-gray-400 capitalize">{student.role}</span></p>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-100 mb-4">Historial de Exámenes</h3>
                    {student.examHistory && student.examHistory.length > 0 ? (
                        <div className="space-y-4">
                            {student.examHistory.slice().reverse().map((attempt, index) => (
                                <div key={index} className="bg-brand-gray-dark p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-200">Examen Realizado</p>
                                        <p className="text-sm text-gray-400">
                                            {attempt.date ? new Date(attempt.date).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Fecha desconocida'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-brand-red">{attempt.score} / {attempt.questions.length}</p>
                                        <p className="text-sm text-gray-400">Puntuación</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Este estudiante aún no ha completado ningún examen.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default StudentDetailView;

import React from 'react';
import { ExamAttempt } from '../../types';
import Card from '../common/Card';
import { ArrowLeftIcon } from '../icons';

interface ExamReviewViewProps {
    attempt: ExamAttempt | null;
    onBack: () => void;
}

const ExamReviewView: React.FC<ExamReviewViewProps> = ({ attempt, onBack }) => {

    const renderContent = () => {
        if (!attempt) {
            return (
                <Card className="text-center">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-100">No hay ningún examen para revisar</h2>
                        <p className="text-gray-400 mt-2 mb-6">Completa un simulacro para ver tus resultados aquí.</p>
                         <button onClick={onBack} className="bg-brand-red text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-red-dark transition-colors">
                            Volver al Dashboard
                        </button>
                    </div>
                </Card>
            );
        }

        const { questions, userAnswers, score } = attempt;

        const getOptionClasses = (questionIndex: number, option: string) => {
            const isCorrectAnswer = option === questions[questionIndex].respuestaCorrecta;
            const isSelectedAnswer = userAnswers[questionIndex] === option;

            if (isCorrectAnswer) {
                // Keeping green for correct answers for universal UX understanding
                return 'bg-green-200 border-green-600 text-green-900 font-semibold';
            }
            if (isSelectedAnswer && !isCorrectAnswer) {
                // Red for incorrect answers
                return 'bg-red-200 border-red-500 text-red-900';
            }
            // Default for non-selected, non-correct options
            return 'bg-brand-gray border-gray-600 text-gray-300';
        };

        return (
            <div className="space-y-8">
                <Card>
                    <div className="p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-100">Resultados del Examen</h2>
                        <p className="text-5xl font-extrabold text-brand-red my-3">{score} / {questions.length}</p>
                        <p className="text-gray-300 text-lg">
                            {score > questions.length / 2 ? '¡Excelente trabajo!' : '¡Sigue estudiando y mejorarás!'}
                        </p>
                    </div>
                </Card>

                <Card>
                    <div className="p-4 sm:p-6">
                        <h3 className="text-xl font-bold text-gray-100 mb-6">Revisión de Preguntas</h3>
                        <div className="space-y-8">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
                                    <p className="text-lg font-semibold text-gray-100 mb-4">{qIndex + 1}. {q.pregunta}</p>
                                    <div className="space-y-3">
                                        {q.opciones.map((option, oIndex) => (
                                            <div
                                                key={oIndex}
                                                className={`w-full text-left p-3 border-2 rounded-lg ${getOptionClasses(qIndex, option)}`}
                                            >
                                                {option}
                                                {option === questions[qIndex].respuestaCorrecta && <span className="font-bold ml-2">(Respuesta Correcta)</span>}
                                                {userAnswers[qIndex] === option && option !== questions[qIndex].respuestaCorrecta && <span className="font-bold ml-2">(Tu Respuesta)</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
    
    return (
        <div>
             <button onClick={onBack} className="flex items-center gap-2 text-brand-red hover:text-red-400 font-semibold mb-6 transition-colors">
                <ArrowLeftIcon className="h-5 w-5" />
                Volver al Dashboard
            </button>
            {renderContent()}
        </div>
    )
};

export default ExamReviewView;
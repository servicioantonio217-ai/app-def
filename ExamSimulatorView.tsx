import React, { useState, useCallback } from 'react';
import { ExamQuestion, ExamAttempt } from '../../types';
import { generateExam } from '../../services/geminiService';
import Spinner from '../common/Spinner';
import Card from '../common/Card';
import { ArrowLeftIcon } from '../icons';

interface ExamSimulatorViewProps {
    onExamComplete: (attempt: ExamAttempt) => void;
    onBack: () => void;
}

const ExamSimulatorView: React.FC<ExamSimulatorViewProps> = ({ onExamComplete, onBack }) => {
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [examStarted, setExamStarted] = useState(false);

    const handleStartExam = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setQuestions([]);
        setSelectedAnswers({});
        setExamStarted(true);
        try {
            const result = await generateExam();
            setQuestions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
            setExamStarted(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleSubmit = () => {
        let score = 0;
        questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.respuestaCorrecta) {
                score++;
            }
        });
        
        onExamComplete({
            questions,
            userAnswers: selectedAnswers,
            score
        });
    };

    if (!examStarted) {
        return (
            <Card className="text-center">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Simulacro de Examen</h2>
                    <p className="text-gray-400 mb-8">Pon a prueba tus conocimientos con preguntas de cultura general generadas por IA.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <button
                            onClick={onBack}
                            className="bg-gray-600 text-gray-100 font-bold py-3 px-8 rounded-lg hover:bg-gray-500 transition-colors"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleStartExam}
                            className="bg-brand-red text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-red-dark transition-colors"
                        >
                            Iniciar Simulacro
                        </button>
                    </div>
                </div>
            </Card>
        );
    }
    
    if (isLoading) {
        return <Card><Spinner /></Card>;
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <div className="p-4 sm:p-6">
                 <button onClick={onBack} className="flex items-center gap-2 text-brand-red hover:text-red-400 font-semibold mb-6 transition-colors">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Cancelar Examen
                </button>
                {error && <p className="text-red-500 text-center my-4">{error}</p>}
                {questions.length > 0 && (
                    <div className="space-y-8">
                        {questions.map((q, qIndex) => (
                            <div key={qIndex}>
                                <p className="text-lg font-semibold text-gray-100 mb-4">{qIndex + 1}. {q.pregunta}</p>
                                <div className="space-y-3">
                                    {q.opciones.map((option, oIndex) => (
                                        <button
                                            key={oIndex}
                                            onClick={() => handleAnswerSelect(qIndex, option)}
                                            className={`w-full text-left p-3 border-2 rounded-lg transition-colors duration-200 text-gray-200 ${
                                                selectedAnswers[qIndex] === option
                                                    ? 'bg-red-900 bg-opacity-50 border-brand-red'
                                                    : 'bg-brand-gray border-gray-600 hover:bg-gray-600'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="text-center pt-6 border-t border-gray-700 mt-8">
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(selectedAnswers).length !== questions.length}
                                className="bg-brand-red text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-red-dark transition-colors disabled:bg-red-900 disabled:text-gray-500 disabled:cursor-not-allowed w-full sm:w-auto"
                            >
                                Finalizar y Corregir
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ExamSimulatorView;
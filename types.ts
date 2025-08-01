
export type AppView = 'dashboard' | 'module' | 'exam' | 'review' | 'editProfile' | 'studentDetail' | 'editModule';

export interface User {
    email: string;
    password?: string;
    role: 'admin' | 'student';
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    nationality?: string;
    profilePicture?: string; // Base64 encoded string
    examHistory?: ExamAttempt[];
}

export interface StudyMaterial {
    name: string;
    type: string; // MIME type
    data: string; // Base64 encoded string
}

export interface Module {
    id: number;
    title: string;
    description: string;
    iconName: string;
    videoUrl?: string;
    materials?: StudyMaterial[];
}

export interface Announcement {
    id: string;
    content: string;
    date: string;
}

export interface ExamQuestion {
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: string;
}

export interface ExamAttempt {
    questions: ExamQuestion[];
    userAnswers: Record<number, string>;
    score: number;
    date?: string;
}

export interface Flashcard {
    pregunta: string;
    respuesta: string;
}

export interface QuizQuestion {
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: string;
}

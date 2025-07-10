import axiosInstance from "@/services/api";

export interface Student {
    id: string;
    grade: number;
    name: string;
    firstLetterThatDontRepeat: string;
    cpf: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateStudent {
    name: string;
    cpf: string;
    grade: number;
}

export const studentApi = {
    // Buscar todos os estudantes
    getAll: async (): Promise<Student[]> => {
        const response = await axiosInstance.get("/student");
        return response.data;
    },

    // Buscar estudante por ID
    getById: async (id: string): Promise<Student> => {
        const response = await axiosInstance.get(`/student/${id}`);
        return response.data;
    },

    // Criar estudante
    create: async (student: CreateStudent): Promise<Student> => {
        const response = await axiosInstance.post("/student", student);
        return response.data;
    },

    // Mudar o nome do estudante
    changeName: async (id: string, name: string): Promise<Student> => {
        const response = await axiosInstance.patch("/student/change/name", { id, name });
        return response.data;
    },

    // Mudar o cpf do estudante
    changeCpf: async (id: string, cpf: string): Promise<Student> => {
        const response = await axiosInstance.patch("/student/change/cpf", { id, cpf });
        return response.data;
    },

    // Mudar o email do estudante
    changeEmail: async (id: string, email: string): Promise<Student> => {
        const response = await axiosInstance.patch("/student/change/email", { id, email });
        return response.data;
    },

    // Mudar a nota do estudante
    changeGrade: async (id: string, grade: string): Promise<Student> => {
        const response = await axiosInstance.patch("/student/change/grade", { id, grade });
        return response.data;
    },

    // Desativar um estudante
    deactivate: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/student/${id}`);
    },

}; 
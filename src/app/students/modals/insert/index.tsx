'use client';

import { Modal, TextInput, NumberInput, Button, Alert, Group, Stack, Text, Paper } from '@mantine/core';
import { useState } from 'react';
import { z, ZodError } from 'zod';
import { IconUser, IconTrophy, IconAlertCircle, IconCards } from '@tabler/icons-react';

// Schema com Zod
const studentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter exatamente 11 números'),
  grade: z.number().min(0, 'Nota mínima é 0').max(10, 'Nota máxima é 10'),
});

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; cpf: string; grade: number }) => void;
}

export default function InsertStudentModal({ opened, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [grade, setGrade] = useState<number | string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para formatar CPF enquanto digita
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 11);
  };

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    setCpf(formattedCPF);

    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const gradeValue = typeof grade === 'string' ? parseFloat(grade.replace(',', '.')) : grade;

      if (isNaN(gradeValue as number)) {
        setErrors({ grade: 'Nota inválida' });
        return;
      }

      const validated = studentSchema.parse({
        name: name.trim(),
        cpf,
        grade: gradeValue,
      });

      onSubmit(validated);
      handleClose();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        (err as ZodError<typeof studentSchema>).issues.forEach(issue => {
          const field = issue.path[0];
          if (typeof field === 'string') {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'Erro inesperado. Tente novamente.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setCpf('');
    setGrade('');
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="sm" className="items-center">
          <div className="bg-blue-100 p-2 rounded-full">
            <IconUser size={20} className="text-blue-600" />
          </div>
          <Text size="lg" fw={600} className="!text-black">
            Adicionar Novo Estudante
          </Text>
        </Group>
      }
      centered
      size="md"
      radius="lg"
      classNames={{
        header: 'border-b border-gray-100 pb-4',
        body: 'pt-6',
      }}
    >
      <Paper className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500 mb-6">
        <Text size="sm" className="!text-black">
          Preencha os dados do estudante para adicionar ao sistema
        </Text>
      </Paper>

      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <TextInput
            label="Nome Completo"
            placeholder="Digite o nome completo do estudante"
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            leftSection={<IconUser size={16} className="text-gray-400" />}
            error={errors.name}
            required
            classNames={{
              label: 'text-sm font-medium text-gray-700 mb-1',
              input: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            }}
          />

          <TextInput
            label="CPF"
            placeholder="Digite apenas os números do CPF"
            value={cpf}
            onChange={e => handleCPFChange(e.target.value)}
            leftSection={<IconCards size={16} className="text-gray-400" />}
            error={errors.cpf}
            required
            maxLength={11}
            classNames={{
              label: 'text-sm font-medium text-gray-700 mb-1',
              input: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            }}
          />

          <NumberInput
            label="Nota"
            placeholder="Digite a nota (0 a 10)"
            value={grade}
            onChange={value => {
              setGrade(value || '');
              if (errors.grade) setErrors(prev => ({ ...prev, grade: '' }));
            }}
            leftSection={<IconTrophy size={16} className="text-gray-400" />}
            min={0}
            max={10}
            step={0.1}
            decimalScale={1}
            error={errors.grade}
            required
            classNames={{
              label: 'text-sm font-medium text-gray-700 mb-1',
              input: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            }}
          />

          {errors.general && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              classNames={{
                root: 'border-red-200 bg-red-50',
                icon: 'text-red-600',
                message: 'text-red-800',
              }}
            >
              {errors.general}
            </Alert>
          )}

          <Group justify="flex-end" gap="sm" className="mt-6 pt-4 border-t border-gray-100">
            <Button
              variant="subtle"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              radius="md"
            >
              {isSubmitting ? 'Adicionando...' : 'Adicionar Estudante'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

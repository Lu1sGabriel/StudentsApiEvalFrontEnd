'use client';

import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Alert,
  Group,
  Stack,
  Text,
  Paper,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { useState } from 'react';
import { z, ZodError } from 'zod';
import { IconUser, IconTrophy, IconAlertCircle, IconCards, IconUserPlus } from '@tabler/icons-react';
import { formatCPF } from '@/utils/formatCpfUtils';

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
      const gradeValue =
        typeof grade === 'number'
          ? grade
          : typeof grade === 'string' && grade.trim() !== ''
            ? parseFloat(grade.replace(',', '.'))
            : undefined;

      if (gradeValue === undefined || isNaN(gradeValue)) {
        setErrors({ grade: 'Nota inválida' });
        setIsSubmitting(false);
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
      centered
      size="lg"
      radius="lg"
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      transitionProps={{
        transition: 'slide-up',
        duration: 300,
      }}
      classNames={{
        content: 'overflow-hidden',
        body: 'p-0',
      }}
    >
      <Stack gap={0}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-green-100">
          <Group gap="md" align="center">
            <ThemeIcon size={50} radius="xl" color="green" variant="light">
              <IconUserPlus size={28} />
            </ThemeIcon>
            <div>
              <Text size="xl" fw={700} className="text-green-800">
                Adicionar Novo Estudante
              </Text>
              <Text size="sm" c="dimmed" className="text-green-600">
                Cadastre um novo estudante no sistema
              </Text>
            </div>
          </Group>
        </div>

        {/* Info Card */}
        <div className="px-6 pt-6">
          <Paper className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 p-4 rounded-lg">
            <Group gap="sm" mb="xs">
              <IconUser size={18} className="text-blue-600" />
              <Text size="sm" fw={500} className="text-blue-700">
                Informações necessárias:
              </Text>
            </Group>
            <Text size="sm" className="text-blue-700 ml-6">
              Preencha todos os campos obrigatórios para cadastrar o estudante
            </Text>
          </Paper>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <Stack gap="xl">
              <div className="grid grid-cols-3 gap-4">
                <TextInput
                  label="Nome Completo"
                  placeholder="Digite o nome completo"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  leftSection={<IconUser size={16} />}
                  error={errors.name}
                  size="md"
                  classNames={{
                    label: 'font-medium text-gray-700 mb-1',
                    input: 'border-gray-300 focus:border-green-500',
                  }}
                />
                <TextInput
                  label="CPF"
                  placeholder="Digite apenas os números"
                  value={cpf}
                  onChange={e => handleCPFChange(e.target.value)}
                  leftSection={<IconCards size={16} />}
                  error={errors.cpf}
                  maxLength={11}
                  size="md"
                  classNames={{
                    label: 'font-medium text-gray-700 mb-1',
                    input: 'border-gray-300 focus:border-green-500',
                  }}
                />
                <NumberInput
                  label="Nota"
                  value={grade}
                  onChange={value => setGrade(value || '')}
                  error={errors.grade}
                  clampBehavior="strict"
                  allowNegative={false}
                  decimalScale={2}
                  min={0}
                  max={10}
                  step={0.1}
                  hideControls
                  leftSection={<IconTrophy size={16} />}
                  size="md"
                  classNames={{
                    label: 'font-medium text-gray-700 mb-1',
                    input: 'border-gray-300 focus:border-yellow-500',
                  }}
                />
              </div>

              {errors.general && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                  className="border border-red-200"
                >
                  {errors.general}
                </Alert>
              )}

              <Divider />

              <Group justify="space-between" mt="md">
                <Button
                  variant="default"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  size="md"
                  className="flex-1 mr-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  color="green"
                  size="md"
                  className="flex-1 ml-2"
                  leftSection={<IconUserPlus size={16} />}
                >
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar Estudante'}
                </Button>
              </Group>
            </Stack>
          </form>
        </div>
      </Stack>
    </Modal>
  );
}

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
  ThemeIcon,
  Divider,
  Paper,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { z, ZodError } from 'zod';
import { IconUser, IconTrophy, IconCards, IconAlertCircle, IconEdit, IconMail } from '@tabler/icons-react';
import { Student, studentApi } from '@/services/client/student';
import { formatCPF } from '@/utils/formatCpfUtils';

const studentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter exatamente 11 números'),
  email: z.string().email('Email inválido'),
  grade: z.number().min(0, 'Nota mínima é 0').max(10, 'Nota máxima é 10'),
});

interface Props {
  opened: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: () => void;
}

export default function EditStudentModal({ opened, onClose, student, onSave }: Props) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState<number | string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (opened && student) {
      setName(student.name);
      setCpf(student.cpf);
      setGrade(student.grade);
      setEmail(student.email);
      setErrors({});
    }
  }, [opened, student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const gradeValue = typeof grade === 'number' ? grade : parseFloat(String(grade).replace(',', '.'));

      if (gradeValue === undefined || isNaN(gradeValue)) {
        setErrors({ grade: 'Nota inválida' });
        setIsSubmitting(false);
        return;
      }

      const validated = studentSchema.parse({
        name: name.trim(),
        cpf,
        email: email.trim(),
        grade: gradeValue,
      });

      if (validated.name !== student.name) {
        await studentApi.changeName(student.id, validated.name);
      }

      if (validated.cpf !== student.cpf) {
        await studentApi.changeCpf(student.id, validated.cpf);
      }

      if (validated.grade !== student.grade) {
        const gradeFormatted = validated.grade.toFixed(2);
        await studentApi.changeGrade(student.id, gradeFormatted);
      }

      if (validated.email !== student.email) {
        await studentApi.changeEmail(student.id, validated.email);
      }
      onClose();
      onSave();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(issue => {
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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-yellow-100">
          <Group gap="md" align="center">
            <ThemeIcon size={50} radius="xl" color="yellow" variant="light">
              <IconEdit size={28} />
            </ThemeIcon>
            <div>
              <Text size="xl" fw={700} className="text-yellow-800">
                Editar Estudante
              </Text>
              <Text size="sm" c="dimmed" className="text-yellow-600">
                Atualize as informações do estudante
              </Text>
            </div>
          </Group>
        </div>

        {/* Student Info Card */}
        {student && (
          <div className="px-6 pt-6">
            <Paper className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <Group gap="sm" mb="xs">
                <IconUser size={18} className="text-blue-600" />
                <Text size="sm" fw={500} className="text-blue-700">
                  Estudante atual:
                </Text>
              </Group>
              <Text size="lg" fw={600} className="text-blue-900 ml-6">
                {student.name}
              </Text>
            </Paper>
          </div>
        )}

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Nome Completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  error={errors.name}
                  leftSection={<IconUser size={16} />}
                  size="md"
                  classNames={{
                    label: 'font-medium text-gray-700 mb-1',
                    input: 'border-gray-300 focus:border-yellow-500',
                  }}
                />
                <TextInput
                  label="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  error={errors.email}
                  leftSection={<IconMail size={16} />}
                  size="md"
                  classNames={{
                    label: 'font-medium text-gray-700 mb-1',
                    input: 'border-gray-300 focus:border-yellow-500',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="CPF"
                  value={formatCPF(cpf)}
                  onChange={e => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  error={errors.cpf}
                  maxLength={14}
                  leftSection={<IconCards size={16} />}
                  size="md"
                  classNames={{
                    label: 'font-medium text-gray-700 mb-1',
                    input: 'border-gray-300 focus:border-yellow-500',
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
                <Button variant="default" onClick={onClose} disabled={isSubmitting} size="md" className="flex-1 mr-2">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  color="yellow"
                  size="md"
                  className="flex-1 ml-2"
                  leftSection={<IconEdit size={16} />}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </Group>
            </Stack>
          </form>
        </div>
      </Stack>
    </Modal>
  );
}

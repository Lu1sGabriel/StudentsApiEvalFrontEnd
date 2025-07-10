'use client';

import { Modal, TextInput, NumberInput, Button, Alert, Group, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { z, ZodError } from 'zod';
import { IconUser, IconTrophy, IconCards, IconAlertCircle } from '@tabler/icons-react';
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
    if (student) {
      setName(student.name);
      setCpf(student.cpf);
      setGrade(student.grade);
      setEmail(student.email);
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const validated = studentSchema.parse({
        name: name.trim(),
        cpf,
        email: email.trim(),
        grade: typeof grade === 'string' ? parseFloat(grade.replace(',', '.')) : grade,
      });

      const promises: Promise<Student>[] = [];

      if (validated.name !== student.name) {
        promises.push(studentApi.changeName(student.id, validated.name));
      }
      if (validated.cpf !== student.cpf) {
        promises.push(studentApi.changeCpf(student.id, validated.cpf));
      }
      if (validated.grade !== student.grade) {
        promises.push(studentApi.changeGrade(student.id, validated.grade.toString()));
      }
      if (validated.email !== student.email) {
        promises.push(studentApi.changeEmail(student.id, validated.email));
      }

      await Promise.all(promises);
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
      title={
        <Group gap="sm">
          <div className="bg-yellow-100 p-2 rounded-full">
            <IconUser size={20} className="text-yellow-600" />
          </div>
          <Text size="lg" className="!text-black">
            Editar Estudante
          </Text>
        </Group>
      }
      centered
      size="md"
      radius="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <TextInput
            label="Nome Completo"
            value={name}
            onChange={e => setName(e.target.value)}
            error={errors.name}
            leftSection={<IconUser size={16} />}
            required
            classNames={{
              label: '!text-black',
            }}
          />
          <TextInput
            label="CPF"
            value={formatCPF(cpf)}
            onChange={e => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
            error={errors.cpf}
            maxLength={11}
            leftSection={<IconCards size={16} />}
            required
            classNames={{
              label: '!text-black',
            }}
          />
          <TextInput
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={errors.email}
            required
            leftSection={<IconUser size={16} />}
            classNames={{
              label: '!text-black',
            }}
          />

          <NumberInput
            label="Nota"
            value={grade}
            onChange={value => setGrade(value || '')}
            error={errors.grade}
            min={0}
            max={10}
            step={0.1}
            leftSection={<IconTrophy size={16} />}
            required
            classNames={{
              label: '!text-black',
            }}
          />

          {errors.general && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {errors.general}
            </Alert>
          )}

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting} color="yellow">
              Salvar Alterações
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

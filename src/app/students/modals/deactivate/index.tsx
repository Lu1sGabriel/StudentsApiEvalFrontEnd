'use client';

import { Modal, Text, Group, Button, Stack } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
  loading?: boolean;
}

export default function ConfirmDeactivateModal({ opened, onClose, onConfirm, studentName, loading = false }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      radius="lg"
      title={
        <Group gap="sm">
          <div className="bg-red-100 p-2 rounded-full">
            <IconTrash size={20} className="text-red-600" />
          </div>
          <Text size="lg" fw={600}>
            Confirmar Desativação
          </Text>
        </Group>
      }
      classNames={{
        header: 'border-b border-gray-100 pb-4',
        body: 'pt-6',
      }}
    >
      <Stack gap="lg">
        <Text size="sm" className="text-gray-700">
          Tem certeza que deseja <strong>desativar</strong> o estudante{' '}
          <span className="text-red-600 font-medium">{studentName}</span>?
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button color="red" loading={loading} onClick={onConfirm} className="text-white">
            Confirmar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

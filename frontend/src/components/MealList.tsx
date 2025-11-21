import { useState } from 'react';
import { Button, Card, CardBody, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMeals, createMeal, updateMeal, deleteMeal } from '../services/api';
import type { Meal, MealCreate } from '../types/dinner';

interface MealListProps {
  onBack: () => void;
}

export function MealList({ onBack }: MealListProps) {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [formData, setFormData] = useState<MealCreate>({ meal: '', cuisine: '', reason: '' });

  console.log('MealList render - isOpen:', isOpen);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: getMeals,
  });

  const createMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      onClose();
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MealCreate }) => updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      onClose();
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const resetForm = () => {
    setFormData({ meal: '', cuisine: '', reason: '' });
    setEditingMeal(null);
  };

  const handleAdd = () => {
    console.log('handleAdd called - isOpen before:', isOpen);
    resetForm();
    console.log('handleAdd - calling onOpen');
    onOpen();
    console.log('handleAdd - onOpen called, isOpen after:', isOpen);
  };

  const handleEdit = (meal: Meal) => {
    console.log('handleEdit called - isOpen before:', isOpen, 'meal:', meal);
    setEditingMeal(meal);
    setFormData({ meal: meal.meal, cuisine: meal.cuisine, reason: meal.reason });
    console.log('handleEdit - calling onOpen');
    onOpen();
    console.log('handleEdit - onOpen called, isOpen after:', isOpen);
  };

  const handleSubmit = () => {
    if (editingMeal) {
      updateMutation.mutate({ id: editingMeal.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🍽️ Manage Meals</h1>
        <div className="flex gap-2">
          <Button color="primary" onPress={handleAdd}>Add Meal</Button>
          <Button variant="bordered" onPress={onBack}>Home</Button>
        </div>
      </div>

      <Card>
        <CardBody>
          {isLoading ? (
            <p className="text-center py-8">Loading meals...</p>
          ) : (
            <Table aria-label="Meals table">
              <TableHeader>
                <TableColumn>MEAL</TableColumn>
                <TableColumn>CUISINE</TableColumn>
                <TableColumn>REASON</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {meals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell>{meal.meal}</TableCell>
                    <TableCell>{meal.cuisine}</TableCell>
                    <TableCell>{meal.reason}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" color="primary" variant="flat" onPress={() => handleEdit(meal)}>Edit</Button>
                        <Button size="sm" color="danger" variant="flat" onPress={() => deleteMutation.mutate(meal.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {console.log('Modal rendering - isOpen:', isOpen)}
          <ModalHeader>{editingMeal ? 'Edit Meal' : 'Add New Meal'}</ModalHeader>
          <ModalBody>
            <Input
              label="Meal Name"
              value={formData.meal}
              onChange={(e) => setFormData({ ...formData, meal: e.target.value })}
            />
            <Input
              label="Cuisine"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            />
            <Input
              label="Reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Cancel</Button>
            <Button color="primary" onPress={handleSubmit}>
              {editingMeal ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

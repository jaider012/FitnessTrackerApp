import React, { useState } from 'react';
import {
  HStack,
  Text,
  Input,
  InputField,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon,
} from '../../ui';

interface SetProps {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
  onUpdate: (reps: number, weight: number, completed: boolean) => void;
}

export const SetComponent: React.FC<SetProps> = ({
  setNumber,
  reps: initialReps,
  weight: initialWeight,
  completed: initialCompleted,
  onUpdate,
}) => {
  const [reps, setReps] = useState(initialReps.toString());
  const [weight, setWeight] = useState(initialWeight.toString());
  const [completed, setCompleted] = useState(initialCompleted);

  const handleUpdate = () => {
    onUpdate(parseInt(reps) || 0, parseFloat(weight) || 0, completed);
  };

  return (
    <HStack space="sm" alignItems="center" p="$2">
      <Text minWidth="$8">{setNumber}</Text>
      <Input flex={1} size="sm">
        <InputField
          placeholder="Reps"
          value={reps}
          onChangeText={setReps}
          keyboardType="numeric"
          onBlur={handleUpdate}
        />
      </Input>
      <Input flex={1} size="sm">
        <InputField
          placeholder="Peso"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          onBlur={handleUpdate}
        />
      </Input>
      <Checkbox
        size="md"
        isChecked={completed}
        onChange={(isChecked) => {
          setCompleted(isChecked);
          onUpdate(parseInt(reps) || 0, parseFloat(weight) || 0, isChecked);
        }}
      >
        <CheckboxIndicator mr="$2">
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
      </Checkbox>
    </HStack>
  );
}; 
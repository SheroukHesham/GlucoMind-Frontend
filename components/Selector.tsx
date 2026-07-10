import {Center} from '@/components/ui/center';
import {HStack} from '@/components/ui/hstack';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/components/ui/radio';
import {CircleIcon} from '@/components/ui/icon';
import {IUser} from '../interfaces';
import {useState} from 'react';

interface IProps {
  user: IUser;
  setUser: (value: React.SetStateAction<IUser>) => void;
}

const Selector = ({user, setUser}: IProps) => {
  return (
    <RadioGroup
      value={user.gender}
      onChange={(val: 'Male' | 'Female') =>
        setUser(prev => ({...prev, gender: val}))
      }>
      <HStack space="2xl">
        <Radio value="Male">
          <RadioIndicator>
            <RadioIcon as={CircleIcon} />
          </RadioIndicator>
          <RadioLabel>Male</RadioLabel>
        </Radio>
        <Radio value="Female">
          <RadioIndicator>
            <RadioIcon as={CircleIcon} />
          </RadioIndicator>
          <RadioLabel>Female</RadioLabel>
        </Radio>
      </HStack>
    </RadioGroup>
  );
};

export default Selector;

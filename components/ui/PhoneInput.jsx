import { Input, Space } from 'antd';
import React, { useState } from 'react';

export default function PhoneInput(props) {
  const [number, setNumber] = useState(props.value || '');

  const handleNumberChange = (e) => {
    const newNumber = e.target.value;
    setNumber(newNumber);

    // Propagate change to parent
    if (props.onChange) {
      props.onChange(newNumber);
    }
  };

  return (
    <Space.Compact size="large">
      <Input
        style={{
          width: '15%',
        }}
        disabled
        defaultValue="+47"
      />
      <Input
        name="number"
        style={{
          width: '85%',
        }}
        value={number}
        onChange={handleNumberChange}
      />
    </Space.Compact>
  );
}

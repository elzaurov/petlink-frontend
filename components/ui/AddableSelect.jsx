import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button } from 'antd';

let index = 0;

export default function AddableSelect({ value, onChange }) {
  const [items, setItems] = useState(['Journal', 'Attest']);
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    const newItem = name || `Nytt element ${index++}`;
    setItems([...items, newItem]);
    setName('');
    onChange && onChange(newItem); // Update the value of the Select when a new item is added
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      size="large"
      value={value}
      onChange={onChange} // Added onChange to Select
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider
            style={{
              margin: '8px 0',
            }}
          />
          <Space className="new-item-wrapper">
            <Input
              placeholder="Vennligst skriv inn element"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Legg til element
            </Button>
          </Space>
        </>
      )}
      options={items.map((item) => ({
        label: item,
        value: item,
      }))}
    />
  );
}

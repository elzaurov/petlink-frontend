import React from 'react';

export default function View({ key, children, style, className }) {
  return (
    <div className={className} key={key} style={style}>
      {children}
    </div>
  );
}

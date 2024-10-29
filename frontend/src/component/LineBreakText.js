import React from 'react';

const LineBreakText = ({ text }) => {
  return (
    <>
      {text && text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </>
  );
};

export default LineBreakText;

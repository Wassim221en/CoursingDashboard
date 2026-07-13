import React from 'react';
import ReactDOM from 'react-dom/client';
import Wrapper from 'layout/components/wrapper/wrapper.component';
import Routes from 'routes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Wrapper>
      <Routes />
    </Wrapper>
  </React.StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

import { ColorModeScript } from '@chakra-ui/react';
import theme from './utils/theme';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);

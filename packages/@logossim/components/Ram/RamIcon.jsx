import React from 'react';

import styled from 'styled-components';

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 30px;
  height: 30px;
  font-size: 10px;

  background: var(--body-unselected);
  border: 1px solid var(--border-unselected);
`;

const RamIcon = () => <Icon>RAM</Icon>;

export default RamIcon;

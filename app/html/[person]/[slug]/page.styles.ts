import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100% + 1px);
`;

export const Frame = styled.iframe`
  width: 100%;
  flex: 1;
  min-height: 0;
  border: none;
`;

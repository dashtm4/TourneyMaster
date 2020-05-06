import React, { useState } from 'react';
import { Button } from 'components/common';
import { DiagnosticTypes } from 'components/schedules/types';
import Diagnostics, { IDiagnosticsInput } from '..';

interface IProps {
  teamsDiagnostics: IDiagnosticsInput;
  recalculateDiagnostics?: () => void;
}

export default (props: IProps) => {
  const { teamsDiagnostics, recalculateDiagnostics } = props;

  const [dianosticsOpen, setDiagnosticsOpen] = useState(false);

  const openDianostics = () => {
    if (recalculateDiagnostics) {
      recalculateDiagnostics();
    }
    setDiagnosticsOpen(true);
  };
  const closeDiagnostics = () => setDiagnosticsOpen(false);

  return (
    <>
      <Button
        label="Teams"
        variant="contained"
        color="primary"
        onClick={openDianostics}
      />
      <Diagnostics
        isOpen={dianosticsOpen}
        tableData={teamsDiagnostics}
        onClose={closeDiagnostics}
        diagnosticType={DiagnosticTypes.TEAMS_DIAGNOSTICS}
      />
    </>
  );
};

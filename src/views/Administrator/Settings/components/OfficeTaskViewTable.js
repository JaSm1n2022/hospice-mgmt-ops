import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";

function OfficeTaskViewTable(props) {
  const { columns, dataSource, loading } = props;
  const [cols, setCols] = useState([]);
  const [source, setSource] = useState([]);
  const [isProcess, setIsProcess] = useState(false);
  useEffect(() => {
    setCols(columns);
    setSource(dataSource);
  }, [props]);
  useEffect(() => {
    setIsProcess(loading);
  }, [loading]);

  // use to save it in storage and

  return (
    <div style={{ paddingTop: 2 }}>
      <ReactDataGrid
        idProperty="id"
        columns={cols}
        dataSource={source}
        style={{ height: 300 }}
        editable={false}
        showColumnMenuTool={false}
        checkboxOnlyRowSelect
        activateRowOnFocus
        loading={isProcess}
        defaultLimit={5}
        pagination
      />
    </div>
  );
}
OfficeTaskViewTable.defaultProps = {
  columns: [],
  dataSource: [],
  loading: false,
};
OfficeTaskViewTable.propTypes = {
  columns: PropTypes.node.isRequired,
  dataSource: PropTypes.node.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default OfficeTaskViewTable;

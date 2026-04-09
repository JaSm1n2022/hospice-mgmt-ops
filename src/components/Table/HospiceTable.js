import React, { useCallback, useEffect, useState } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";

let isWithCheckItem = false;

const HospiceTable = (props) => {
  const { main } = props;
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  useEffect(() => {
    setColumns(props.columns);
    setDataSource(props.dataSource);
    isWithCheckItem = (props.dataSource || []).find((d) => d.isChecked);

    // Sync with external selected prop if provided, otherwise reset if no check items
    if (props.selected !== undefined) {
      setSelected(props.selected);
    } else if (!isWithCheckItem) {
      setSelected({});
    }
  }, [props]);

  useEffect(() => {
    setLoading(props.loading);
    // setReservedViewportWidth(null)
  }, [props.loading]);

  const onCellClick = useCallback((event, cellProps) => {
    event.stopPropagation();
  });
  const onRowClick = useCallback((rowProps, event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  const onSelectionChange = useCallback(({ selected: selectedMap, data }) => {
    console.log("[onSelectChange]", data, selectedMap);
    setSelected(selectedMap);

    if (JSON.stringify(selectedMap) === "{}") {
      // no selected
      props.onCheckboxSelectionHandler([], false, false, selectedMap);
    } else if (data && Array.isArray(data) && data.length >= 1) {
      // is Mark as All
      props.onCheckboxSelectionHandler(data, true, true, selectedMap);
    } else {
      // there is selection
      // find to distinguish if true or false
      console.log("[Object.keys(selectedMap)]", Object.keys(selectedMap));
      if (
        selectedMap &&
        Array.isArray(Object.keys(selectedMap)) &&
        Object.keys(selectedMap).length === 0
      ) {
        props.onCheckboxSelectionHandler([data.id], false, false, selectedMap);
      } else {
        const isChecked = Object.keys(selectedMap).find(
          (m) => m.toString() === data.id.toString()
        );
        props.onCheckboxSelectionHandler([data.id], false, isChecked || false, selectedMap);
      }
    }
  });
  const renderPaginationToolbar = useCallback((paginationProps) => {
    return (
      <div
        style={{ height: 50, paddingLeft: 8, paddingTop: 8, paddingBottom: 8 }}
      >
        <renderPaginationToolbar {...paginationProps} bordered={false} />
        <div></div>
      </div>
    );
  }, []);

  // use to save it in storage and

  return (
    <ReactDataGrid
      idProperty="id"
      columns={columns}
      dataSource={dataSource}
      style={{ height: props.height || 500 }}
      editable={false}
      showColumnMenuTool={false}
      checkboxOnlyRowSelect={main}
      activateRowOnFocus={true}
      checkboxColumn={main}
      defaultLimit={100}
      loading={loading}
      selected={selected}
      onSelectionChange={onSelectionChange}
      // renderPaginationToolbar={renderPaginationToolbar}
      // onColumnVisibleChange={props.onColumnVisibleChangeHandler}
      onRowClick={onRowClick}
      onCellClick={onCellClick}
      pagination
    />
  );
};

export default HospiceTable;
